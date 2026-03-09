import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import carsRoutes from './routes/cars.routes.js';
import paymentsRoutes from './routes/payments.routes.js';

const app = express();

const allowedOrigins = [
  'http://localhost:8100',
  'http://127.0.0.1:8100',
  'http://localhost:4200',
  'http://127.0.0.1:4200'
];

function isAllowedOrigin(origin) {
  if (!origin || allowedOrigins.includes(origin)) {
    return true;
  }

  return /^https?:\/\/(10(?:\.\d{1,3}){3}|127(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(:\d+)?$/i.test(
    origin
  );
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('CORS not allowed'));
    }
  })
);

app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

app.use('/api/cars', carsRoutes);
app.use('/api/payments', paymentsRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

export default app;
