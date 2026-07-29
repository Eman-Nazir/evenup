export const simplifyDebts = (netBalances) => {
  const EPSILON = 0.01;
  const creditors = [];
  const debtors = [];

  Object.entries(netBalances).forEach(([userId, amount]) => {
    if (amount > EPSILON) creditors.push({ userId, amount });
    else if (amount < -EPSILON) debtors.push({ userId, amount: -amount });
  });

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const settledAmount = Math.min(debtor.amount, creditor.amount);

    if (settledAmount > EPSILON) {
      transactions.push({
        from: debtor.userId,
        to: creditor.userId,
        amount: Math.round(settledAmount * 100) / 100,
      });
    }

    debtor.amount -= settledAmount;
    creditor.amount -= settledAmount;
    if (debtor.amount <= EPSILON) i++;
    if (creditor.amount <= EPSILON) j++;
  }

  return transactions;
};


export const computeNetBalances = (expenses, splits, settlements = []) => {
  const balances = {};
  const addBalance = (userId, amount) => {
    balances[userId] = (balances[userId] || 0) + amount;
  };

  splits.forEach((split) => {
    addBalance(split.user.toString(), -split.amountOwed);
  });

  settlements.forEach((s) => {
    addBalance(s.from.toString(), s.amount);  
    addBalance(s.to.toString(), -s.amount);   
  });

  return balances;
};