import Db from '../config/db.js';
import { GetPublicId } from '../config/Cloudinary.js';
import { v2 as cloudinary } from 'cloudinary';

export const GetProduct = async (req, res) => {
  try {
    let result = await Db.query('SELECT * FROM prodact');
    // const products = result.rows.map((row) => ({
    //   ...row,
    //   img_p: row.img_p,
    // }));
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const CreateProduct = async (req, res) => {
  try {
    console.log('this is ' + process.env.CLOUD_NAME);
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

    let result = await Db.query(
      'INSERT INTO prodact (name_p, price_p, img_p) VALUES ($1,$2,$3) RETURNING *',
      [nameP, priceP, imgP]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const UdateProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let nameP = req.body?.nameP?.trim();
    let priceP = req.body?.priceP ? parseInt(req.body.priceP) : null;
    let imgP = req.file ? req.file.path : null;

    let check = await Db.query('SELECT * FROM prodact WHERE id=$1', [id]);
    if (!check.rows.length)
      return res.status(404).json({ error: 'Product not found' });

    // حذف الصورة القديمة إذا تم رفع صورة جديدة
    if (imgP && check.rows[0].img_p) {
      const publicId = GetPublicId(check.rows[0].img_p);
      await cloudinary.uploader.destroy(publicId);
    }

    nameP = nameP || check.rows[0].name_p;
    priceP = priceP || check.rows[0].price_p;
    imgP = imgP || check.rows[0].img_p;

    let result = await Db.query(
      'UPDATE prodact SET name_p=$2, price_p=$3, img_p=$4 WHERE id=$1 RETURNING *',
      [id, nameP, priceP, imgP]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const Delete = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await Db.query(
      'DELETE FROM prodact WHERE id=$1 RETURNING *',
      [id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: 'Product not found' });

    // حذف الصورة من Cloudinary
    if (result.rows[0].img_p) {
      const publicId = GetPublicId(result.rows[0].img_p);
      await cloudinary.uploader.destroy(publicId);
    }

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
