import mongoose from 'mongoose';

const paymentSessionSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, trim: true, default: 'USD' },
    md5: { type: String, required: true, trim: true, index: true },
    qrString: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'expired', 'failed'],
      default: 'pending',
      index: true
    },
    carId: { type: String, trim: true, default: null },
    userId: { type: String, trim: true, default: null },
    purposeOfTransaction: { type: String, trim: true, default: '' },
    expiresAt: { type: Date, default: null },
    paidAt: { type: Date, default: null },
    lastCheckedAt: { type: Date, default: null },
    bakongResponse: { type: mongoose.Schema.Types.Mixed, default: null }
  },
  {
    timestamps: true
  }
);

const PaymentSession = mongoose.model('PaymentSession', paymentSessionSchema);

export default PaymentSession;
