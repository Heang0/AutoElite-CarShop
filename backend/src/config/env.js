import dotenv from 'dotenv';
import { resolve } from 'node:path';

dotenv.config({ path: resolve(process.cwd(), '.env') });
dotenv.config({ path: resolve(process.cwd(), '..', '.env'), override: false });

const env = {
  port: Number(process.env.PORT) || 4000,
  mongoUri:
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    'mongodb://127.0.0.1:27017/autoelite',
  bakongApiBaseUrl: process.env.BAKONG_API_BASE_URL || 'https://api-bakong.nbc.gov.kh',
  bakongEnv: process.env.BAKONG_ENV || 'sandbox',
  bakongMock: process.env.BAKONG_MOCK === 'true',
  bakongToken: process.env.BAKONG_TOKEN || '',
  bakongAccountId: process.env.BAKONG_ACCOUNT_ID || '',
  bakongMerchantId: process.env.BAKONG_MERCHANT_ID || '',
  bakongAcquiringBank: process.env.BAKONG_ACQUIRING_BANK || '',
  bakongMerchantName: process.env.BAKONG_MERCHANT_NAME || '',
  bakongMerchantCity: process.env.BAKONG_MERCHANT_CITY || '',
  bakongStoreLabel: process.env.BAKONG_STORE_LABEL || '',
  bakongTerminalLabel: process.env.BAKONG_TERMINAL_LABEL || '',
  bakongMerchantMobile: process.env.BAKONG_MERCHANT_MOBILE || '',
  bakongMerchantCategoryCode: process.env.BAKONG_MERCHANT_CATEGORY_CODE || '5999'
};

export default env;
