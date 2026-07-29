import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      default: null, // null = 1-on-1 expense (Phase 2 territory, schema ready now)
    },
    description: {
      type: String,
      required: [true, 'Expense description is required'],
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    currency: {
      type: String,
      default: 'PKR',
    },
    category: {
      type: String,
      enum: ['food', 'rent', 'transport', 'entertainment', 'utilities', 'shopping', 'other'],
      default: 'other',
    },
    receiptImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    paidBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    splitType: {
      type: String,
      enum: ['equal', 'exact', 'percentage', 'shares'],
      default: 'equal',
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },


    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrence: {
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: null,
      },
      nextRunDate: {
        type: Date,
        default: null,
      },
      endDate: {
        type: Date,
        default: null,
      },
      parentExpense: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense',
        default: null,
      },
    },
  },
  { timestamps: true }
);

expenseSchema.index({ group: 1, date: -1 });
expenseSchema.index({ participants: 1 });
expenseSchema.index({ isRecurring: 1, 'recurrence.nextRunDate': 1 });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;