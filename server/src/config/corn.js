import cron from 'node-cron';
import { processDueRecurringExpenses } from '../services/recurringExpense.service.js';
import logger from '../utils/logger.js';

export const startCronJobs = () => {
  cron.schedule('*/5 * * * *', async () => {
    logger.info('Running recurring expenses check...');
    await processDueRecurringExpenses();
  });
};