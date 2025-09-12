import express from 'express';
import CorsOptions from './config/cors.js';
import path from 'path';

import ProductRoute from './routes/product.route.js';
import dotenv from 'dotenv';
dotenv.config();
let NODE_ENV = process.env.NODE_ENV?.trim();
const app = express();
const port = process.env.PORT || 5000;
const __dirname = path.resolve();
app.use(express.json());
app.use('/api/products', ProductRoute);

if (process.env.NODE_ENV === 'development') {
  app.use(CorsOptions()); // ✅ هنا تناديها كدالة
}

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
