import { BakongKHQR, khqrData, MerchantInfo } from 'bakong-khqr';
import env from '../config/env.js';

const khqr = new BakongKHQR();

const DEFAULT_EXPIRY_MINUTES = 3;

function resolveCurrency(currency) {
  const normalized = String(currency || '').toLowerCase();
  if (normalized === 'khr') {
    return khqrData.currency.khr;
  }
  return khqrData.currency.usd;
}

function buildOptionalData({
  amount,
  currency,
  billNumber,
  storeLabel,
  terminalLabel,
  mobileNumber,
  purposeOfTransaction,
  expirationMinutes
}) {
  const optionalData = {
    currency: resolveCurrency(currency),
    amount: typeof amount === 'number' ? amount : undefined,
    billNumber,
    storeLabel,
    terminalLabel,
    mobileNumber,
    purposeOfTransaction,
    merchantCategoryCode: env.bakongMerchantCategoryCode
  };

  if (typeof amount === 'number' && amount > 0) {
    const minutes = Number(expirationMinutes) || DEFAULT_EXPIRY_MINUTES;
    optionalData.expirationTimestamp = Date.now() + minutes * 60 * 1000;
  }

  return optionalData;
}

export function generateMerchantKhqr({
  amount,
  currency,
  billNumber,
  purposeOfTransaction,
  expirationMinutes
}) {
  if (!env.bakongAccountId) {
    throw new Error('Bakong account ID is not configured');
  }

  const merchantId = env.bakongMerchantId || env.bakongAccountId;
  const acquiringBank = env.bakongAcquiringBank || 'UNKNOWNBANK';

  const optionalData = buildOptionalData({
    amount,
    currency,
    billNumber,
    storeLabel: env.bakongStoreLabel,
    terminalLabel: env.bakongTerminalLabel,
    mobileNumber: env.bakongMerchantMobile,
    purposeOfTransaction,
    expirationMinutes
  });

  const merchantInfo = new MerchantInfo(
    env.bakongAccountId,
    env.bakongMerchantName || 'AutoElite',
    env.bakongMerchantCity || 'Phnom Penh',
    merchantId,
    acquiringBank,
    optionalData
  );

  const response = khqr.generateMerchant(merchantInfo);

  if (!response || response.status === false) {
    throw new Error(response?.errorCode?.description || 'Failed to generate KHQR');
  }

  return {
    qrString: response.data?.qr,
    md5: response.data?.md5,
    expiresAt: optionalData.expirationTimestamp || null
  };
}

export async function checkTransactionByMd5(md5) {
  if (!md5) {
    throw new Error('Missing md5 for payment verification');
  }

  if (env.bakongMock) {
    return {
      paid: true,
      raw: {
        responseCode: 0,
        message: 'Mock payment verified'
      }
    };
  }

  if (!env.bakongToken) {
    throw new Error('Bakong token is not configured');
  }

  const response = await fetch(`${env.bakongApiBaseUrl}/v1/check_transaction_by_md5`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.bakongToken}`
    },
    body: JSON.stringify({ md5 })
  });

  const rawText = await response.text();
  let payload = null;

  try {
    payload = rawText ? JSON.parse(rawText) : null;
  } catch {
    payload = { rawText };
  }

  if (!response.ok) {
    throw new Error(
      payload?.message ||
        payload?.error ||
        `Bakong verification failed with status ${response.status}`
    );
  }

  const paid =
    Boolean(payload?.data) ||
    payload?.transactionStatus === 'SUCCESS' ||
    payload?.status === 'SUCCESS';

  return {
    paid,
    raw: payload
  };
}
