import cron from 'node-cron';
import { processDueRecurringExpenses } from '../services/recurringExpense.service.js';
import logger from '../utils/logger.js';

export const startCronJobs = () => {
  // Runs every day at midnight
  cron.schedule('0 0 * * *', async () => {
    logger.info('Running recurring expenses check...');
    await processDueRecurringExpenses();
  });
};