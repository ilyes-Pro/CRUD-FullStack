import cors from 'cors';

const CorsOptions = cors({
  origin: process.env.FRONTEND_URL, // allowed frontend
  credentials: true,
});

export default CorsOptions;
