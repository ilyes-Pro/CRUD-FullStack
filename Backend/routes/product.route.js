import express from 'express';
import { Upload } from '../config/Cloudinary.js';

import {
  GetProduct,
  CreateProduct,
  UdateProduct,
  Delete,
} from '../controllers/product.controllers.js';

const router = express.Router();

router.get('/AllProdacts', GetProduct);
router.post('/addProdact', Upload.single('image'), CreateProduct);
router.patch('/Update/:id', Upload.single('image'), UdateProduct);
router.delete('/delete/:id', Delete);

export default router;
