import cors from 'cors';

export default function CorsOptions() {
  return app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );
}
