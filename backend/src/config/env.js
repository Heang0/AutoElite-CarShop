import dotenv from 'dotenv';

dotenv.config();

const env = {
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/autoelite'
};

export default env;
