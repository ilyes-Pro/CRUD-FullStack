import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import pg from 'pg';
import path from 'path';
import cors from 'cors';

const { Pool } = pg;
const __dirname = path.resolve();

dotenv.config();
let NODE_ENV = process.env.NODE_ENV?.trim();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
if (NODE_ENV === 'development') {
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );
}

// إعداد Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// إعداد multer + CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'prodactADD',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

await db.query(`
  CREATE TABLE IF NOT EXISTS prodact (
    id SERIAL PRIMARY KEY,
    name_p VARCHAR(100) NOT NULL,
    price_p INT NOT NULL,
    img_p TEXT
  )
`);

// دالة لاستخراج public_id من رابط Cloudinary
function getPublicId(url) {
  // الرابط: https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/prodactADD/filename.jpg
  // public_id = "prodactADD/filename"
  const parts = url.split('/');
  const filenameWithExt = parts[parts.length - 1]; // filename.jpg
  const filename = filenameWithExt.split('.')[0]; // filename
  const folder = parts[parts.length - 2]; // prodactADD
  return `${folder}/${filename}`;
}

// جلب كل المنتجات
app.get('/AllProdacts', async (req, res) => {
  try {
    let result = await db.query('SELECT * FROM prodact');
    const products = result.rows.map((row) => ({
      ...row,
      img_p: row.img_p,
    }));
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// إضافة منتج جديد
app.post('/addProdact', upload.single('image'), async (req, res) => {
  try {
    let nameP = req.body?.nameP?.trim();
    let priceP = parseInt(req.body.priceP);
    let imgP = req.file ? req.file.path : null;

    let Error = [];
    if (!nameP) Error.push('Name');
    if (!priceP) Error.push('Price');
    if (!imgP) Error.push('Img');

    if (Error.length > 0) {
      return res
        .status(400)
        .json({ error: `Enter your ${Error.join(' and ')}` });
    }

    let result = await db.query(
      'INSERT INTO prodact (name_p, price_p, img_p) VALUES ($1,$2,$3) RETURNING *',
      [nameP, priceP, imgP]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// تحديث منتج مع حذف الصورة القديمة
app.patch('/Update/:id', upload.single('image'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let nameP = req.body?.nameP?.trim();
    let priceP = req.body?.priceP ? parseInt(req.body.priceP) : null;
    let imgP = req.file ? req.file.path : null;

    let check = await db.query('SELECT * FROM prodact WHERE id=$1', [id]);
    if (!check.rows.length)
      return res.status(404).json({ error: 'Product not found' });

    // حذف الصورة القديمة إذا تم رفع صورة جديدة
    if (imgP && check.rows[0].img_p) {
      const publicId = getPublicId(check.rows[0].img_p);
      await cloudinary.uploader.destroy(publicId);
    }

    nameP = nameP || check.rows[0].name_p;
    priceP = priceP || check.rows[0].price_p;
    imgP = imgP || check.rows[0].img_p;

    let result = await db.query(
      'UPDATE prodact SET name_p=$2, price_p=$3, img_p=$4 WHERE id=$1 RETURNING *',
      [id, nameP, priceP, imgP]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// حذف منتج مع حذف الصورة من Cloudinary
app.delete('/delete/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await db.query(
      'DELETE FROM prodact WHERE id=$1 RETURNING *',
      [id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: 'Product not found' });

    // حذف الصورة من Cloudinary
    if (result.rows[0].img_p) {
      const publicId = getPublicId(result.rows[0].img_p);
      await cloudinary.uploader.destroy(publicId);
    }

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

if (NODE_ENV === 'production') {
  const frontDist = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(frontDist));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontDist, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
