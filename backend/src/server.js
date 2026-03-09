import app from './app.js';
import env from './config/env.js';
import { connectDatabase } from './config/db.js';

async function startServer() {
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      console.log(`Server running on http://127.0.0.1:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start backend server:', error);
    process.exit(1);
  }
}

startServer();
