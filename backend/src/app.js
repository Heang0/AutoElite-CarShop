import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import carsRoutes from './routes/cars.routes.js';

const app = express();

const allowedOrigins = [
  'http://localhost:8100',
  'http://127.0.0.1:8100',
  'http://localhost:4200',
  'http://127.0.0.1:4200'
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
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

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

export default app;
