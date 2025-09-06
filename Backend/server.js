import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import pg from 'pg';
import path from 'path';
import cors from 'cors';
import fs from 'fs';

const { Pool } = pg;

const __dirname = path.resolve();

// dotenv.config({ path: path.resolve('../.env') });

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
if (process.env.MOD_ENV == 'development') {
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );
}

console.log('Mod', process.env.DATABASE_URL);

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/AllProdacts', async (req, res) => {
  try {
    let result = await db.query('SELECT * FROM prodact');
    console.log('this is url : ', process.env.BASE_URL);
    const products = result.rows.map((row) => ({
      ...row,
      img_p: `${process.env.BASE_URL}/${row.img_p}`,
    }));

    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // هنا دايمًا حيحفظ في Backend/uploads/prodactADD
    cb(null, path.join(__dirname, 'prodactADD'));
  },

  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // السماح بالملف
  } else {
    cb(new Error('Only .png, .jpg and .jpeg files are allowed'), false); // رفض الملف
  }
};

const upload = multer({ storage, fileFilter });

app.post('/addProdact', upload.single('image'), async (req, res) => {
  try {
    let nameP = req.body?.nameP;
    let priceP = parseInt(req.body.priceP);
    let imgP = req.file ? req.file.filename : null;
    let Error = [];
    if (!nameP) {
      Error.push('name');
    }
    if (!priceP) {
      Error.push('price');
    }
    if (!imgP) {
      Error.push('img');
    }

    if (Error.length > 0) {
      return res
        .status(404)
        .json({ error: `enter you ${Error.join(' and ')}` });
    }

    let result = await db.query(
      'INSERT INTO  prodact (name_p,price_p,img_p) VALUES ($1,$2,$3) RETURNING *',
      [nameP, priceP, imgP]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.patch('/Update/:id', upload.single('image'), async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let { nameP, priceP } = req.body;
    let imgP = req.file ? req.file.filename : null;

    if (!nameP && !priceP && !imgP) {
      return res
        .status(400)
        .json({ error: 'You must provide at least one field to update' });
    }

    let check = await db.query('SELECT * FROM prodact WHERE id=$1', [id]);
    if (!check.rows.length) {
      return res.status(404).json({ error: 'enter real id' });
    }

    nameP = nameP || check.rows[0].name_p;
    priceP = priceP || check.rows[0].price_p;
    // imgP = imgP || check.rows[0].img_p;
    if (imgP) {
      deleteImage(check.rows[0].img_p);
    } else {
      imgP = check.rows[0].img_p;
    }
    let result = await db.query(
      'UPDATE prodact SET name_p=$2,price_p=$3 ,img_p=$4 WHERE id=$1 RETURNING *',
      [id, nameP, priceP, imgP]
    );

    const a = `${process.env.BASE_URL}/${result.rows[0].img_p}`;
    result.rows[0].img_p = a;
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.patch('/Update/:id', upload.single("image"), async (req, res) => {
//     try {
//         const id = parseInt(req.params.id);

//         let nameP = req.body?.nameP || null;
//         let priceP = req.body?.priceP ? parseInt(req.body.priceP) : null;
//         let imgP = req.file ? req.file.path : null;

//         let result = await db.query(
//             `UPDATE prodact
//              SET name_p = COALESCE($2, name_p),
//                  price_p = COALESCE($3, price_p),
//                  img_p = COALESCE($4, img_p)
//              WHERE id = $1
//              RETURNING *`,
//             [id, nameP, priceP, imgP]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: "Product not found" });
//         }

//         res.status(200).json(result.rows);

//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

app.delete('/delete/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);

    // نحذف من قاعدة البيانات
    let result = await db.query('DELETE FROM prodact WHERE id=$1 RETURNING *', [
      id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // اسم الصورة المخزّن في db (مثلاً: 1757...jpg)
    const filename = result.rows[0].img_p;
    console.log('This is img ', filename);

    // نحذف الصورة من السيرفر
    deleteImage(filename);

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function deleteImage(img) {
  // مسار مطلق → يربط مجلد المشروع مع uploads/prodactADD
  const fullPath = path.join(__dirname, 'prodactADD', img);

  fs.unlink(
    fullPath,
    // 'prodactADD/' + img
    (err) => {
      if (err) {
        console.error('Problem in Delete file', err);
      } else {
        console.log('File deleted:', fullPath);
      }
    }
  );
}

app.use('/prodactADD', express.static('prodactADD'));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
