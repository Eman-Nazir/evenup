import AppError from '../utils/AppError.js';


export const calculateSplits = ({ splitType, amount, participants, splitDetails = [] }) => {
  const EPSILON = 0.01;
  let result = [];

  switch (splitType) {
    case 'equal': {
      const share = Math.round((amount / participants.length) * 100) / 100;
      const remainder = Math.round((amount - share * participants.length) * 100) / 100;

      result = participants.map((user, idx) => ({
        user,
        amountOwed: idx === 0 ? share + remainder : share,
      }));
      break;
    }

    case 'exact': {
      if (splitDetails.length !== participants.length) {
        throw new AppError('Exact split amounts must be provided for every participant', 400);
      }
      result = splitDetails.map(({ user, value }) => ({ user, amountOwed: value }));
      break;
    }

    case 'percentage': {
      if (splitDetails.length !== participants.length) {
        throw new AppError('Percentages must be provided for every participant', 400);
      }
      const totalPercent = splitDetails.reduce((sum, s) => sum + s.value, 0);
      if (Math.abs(totalPercent - 100) > EPSILON) {
        throw new AppError('Percentages must add up to 100', 400);
      }
      result = splitDetails.map(({ user, value }) => ({
        user,
        amountOwed: Math.round(((value / 100) * amount) * 100) / 100,
      }));
      break;
    }

    case 'shares': {
      if (splitDetails.length !== participants.length) {
        throw new AppError('Shares must be provided for every participant', 400);
      }
      const totalShares = splitDetails.reduce((sum, s) => sum + s.value, 0);
      if (totalShares <= 0) {
        throw new AppError('Total shares must be greater than 0', 400);
      }
      result = splitDetails.map(({ user, value }) => ({
        user,
        amountOwed: Math.round(((value / totalShares) * amount) * 100) / 100,
      }));
      break;
    }

    default:
      throw new AppError('Invalid split type', 400);
  }

  const sum = result.reduce((acc, r) => acc + r.amountOwed, 0);
  if (Math.abs(sum - amount) > 0.05) {
    throw new AppError('Split amounts do not add up to the total expense amount', 400);
  }

  return result;
};