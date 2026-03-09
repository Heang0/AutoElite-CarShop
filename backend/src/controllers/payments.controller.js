import PaymentSession from '../models/PaymentSession.js';
import env from '../config/env.js';
import { checkTransactionByMd5, generateMerchantKhqr } from '../services/bakong.service.js';

function buildQrImageUrl(qrString) {
  const encoded = encodeURIComponent(qrString);
  return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encoded}`;
}

function toSessionResponse(session) {
  return {
    success: true,
    paymentId: String(session._id),
    reference: session.reference,
    amount: session.amount,
    currency: session.currency,
    status: session.status,
    qrString: session.qrString,
    qrImageUrl: buildQrImageUrl(session.qrString),
    merchantName: env.bakongMerchantName || env.bakongAccountId || 'Bakong Merchant',
    expiresAt: session.expiresAt ? session.expiresAt.getTime() : null,
    paidAt: session.paidAt ? session.paidAt.getTime() : null
  };
}

export async function createBakongPayment(req, res) {
  try {
    const {
      amount,
      currency = 'USD',
      billNumber,
      purposeOfTransaction,
      carId,
      userId,
      expirationMinutes
    } = req.body || {};

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      res.status(400).json({ success: false, message: 'Invalid amount' });
      return;
    }

    const reference = billNumber || `CAR-${Date.now().toString(36).toUpperCase()}`;
    const { qrString, md5, expiresAt } = generateMerchantKhqr({
      amount: parsedAmount,
      currency,
      billNumber: reference,
      purposeOfTransaction,
      expirationMinutes
    });

    const session = await PaymentSession.create({
      reference,
      amount: parsedAmount,
      currency,
      md5,
      qrString,
      status: 'pending',
      carId: carId || null,
      userId: userId || null,
      purposeOfTransaction: purposeOfTransaction || '',
      expiresAt: expiresAt ? new Date(expiresAt) : null
    });

    res.json(toSessionResponse(session));
  } catch (error) {
    console.error('[Bakong] Failed to create payment', error);
    res.status(500).json({ success: false, message: 'Failed to create KHQR payment' });
  }
}

export async function confirmBakongPayment(req, res) {
  try {
    const { paymentId } = req.body || {};
    if (!paymentId) {
      res.status(400).json({ success: false, message: 'Missing payment ID' });
      return;
    }

    const session = await PaymentSession.findById(paymentId);
    if (!session) {
      res.status(404).json({ success: false, message: 'Payment not found' });
      return;
    }

    const verification = await checkTransactionByMd5(session.md5);
    session.lastCheckedAt = new Date();
    session.bakongResponse = verification.raw;

    if (verification.paid) {
      session.status = 'paid';
      session.paidAt = new Date();
    } else if (session.expiresAt && session.expiresAt.getTime() < Date.now()) {
      session.status = 'expired';
    }

    await session.save();

    res.json({
      success: true,
      paymentId: String(session._id),
      status: session.status,
      paidAt: session.paidAt ? session.paidAt.getTime() : null
    });
  } catch (error) {
    console.error('[Bakong] Failed to confirm payment', error);
    res.status(500).json({ success: false, message: 'Failed to confirm payment' });
  }
}

export async function getBakongPaymentStatus(req, res) {
  try {
    const { paymentId } = req.params;
    const session = await PaymentSession.findById(paymentId);

    if (!session) {
      res.status(404).json({ success: false, message: 'Payment not found' });
      return;
    }

    if (session.status === 'pending') {
      const verification = await checkTransactionByMd5(session.md5);
      session.lastCheckedAt = new Date();
      session.bakongResponse = verification.raw;

      if (verification.paid) {
        session.status = 'paid';
        session.paidAt = new Date();
      } else if (session.expiresAt && session.expiresAt.getTime() < Date.now()) {
        session.status = 'expired';
      }

      await session.save();
    }

    res.json({
      success: true,
      paymentId: String(session._id),
      status: session.status,
      reference: session.reference,
      amount: session.amount,
      currency: session.currency,
      paidAt: session.paidAt ? session.paidAt.getTime() : null
    });
  } catch (error) {
    console.error('[Bakong] Failed to get payment status', error);
    res.status(500).json({ success: false, message: 'Failed to get payment status' });
  }
}
