import mongoose from 'mongoose';

const splitSchema = new mongoose.Schema(
  {
    expense: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expense',
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amountOwed: {
      type: Number,
      required: true,
    },
    settled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Critical for balance calculation performance — this is the query that runs
// every time we compute "who owes whom" in a group
splitSchema.index({ group: 1, user: 1, settled: 1 });
splitSchema.index({ expense: 1 });

const Split = mongoose.model('Split', splitSchema);
export default Split;