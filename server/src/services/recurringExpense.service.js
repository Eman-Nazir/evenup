import Expense from '../models/Expense.model.js';
import Split from '../models/Split.model.js';
import Group from '../models/Group.model.js';
import { calculateSplits } from './splitCalculator.service.js';
import logger from '../utils/logger.js';

  export const addInterval = (date, frequency) => {
  const next = new Date(date);
  if (frequency === 'daily') next.setDate(next.getDate() + 1);
  if (frequency === 'weekly') next.setDate(next.getDate() + 7);
  if (frequency === 'monthly') next.setMonth(next.getMonth() + 1);
  return next;
};


export const processDueRecurringExpenses = async () => {
  const now = new Date();

  const dueExpenses = await Expense.find({
    isRecurring: true,
    'recurrence.nextRunDate': { $lte: now },
    $or: [
      { 'recurrence.endDate': null },
      { 'recurrence.endDate': { $gte: now } },
    ],
  });

  let createdCount = 0;

  for (const original of dueExpenses) {
    try {
      const group = await Group.findById(original.group);
      if (!group) continue;

      const memberIds = group.members.map((m) => m.user);
      const splits = calculateSplits({
        splitType: original.splitType,
        amount: original.amount,
        participants: memberIds,
      });

      const newExpense = await Expense.create({
        description: original.description,
        amount: original.amount,
        category: original.category,
        group: original.group,
        splitType: original.splitType,
        paidBy: original.paidBy,
        participants: memberIds,
        createdBy: original.createdBy,
        date: now,
        recurrence: { parentExpense: original._id },
      });

      const splitDocs = splits.map((s) => {
        const paidAmount = original.paidBy.find((p) => p.user.toString() === s.user.toString())?.amount || 0;
        return {
          expense: newExpense._id,
          group: original.group,
          user: s.user,
          amountOwed: Math.round((s.amountOwed - paidAmount) * 100) / 100,
        };
      });

      await Split.insertMany(splitDocs);

      // Schedule the original template's next run
      original.recurrence.nextRunDate = addInterval(original.recurrence.nextRunDate, original.recurrence.frequency);
      await original.save();

      createdCount++;
    } catch (err) {
      logger.error(`Failed to process recurring expense ${original._id}:`, err.message);
    }
  }

  logger.info(`Recurring expenses processed: ${createdCount} new expense(s) created`);
  return createdCount;
};