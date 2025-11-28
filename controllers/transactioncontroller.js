const Transaction = require('../models/Transaction');

/**
 * GET /api/transactions
 * return list of transactions for logged-in user (sorted desc by date)
 */
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const txns = await Transaction.find({ userId }).sort({ date: -1, createdAt: -1 });
    return res.json(txns);
  } catch (err) {
    console.error('getTransactions', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/transactions/add
 * body: { title, amount, type, category, date, notes }
 */
exports.addTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, amount, type, category, date, notes } = req.body;

    if (!title || typeof amount === 'undefined' || !type)
      return res.status(400).json({ message: 'title, amount and type are required' });

    const txn = await Transaction.create({
      userId,
      title,
      amount,
      type,
      category: category || 'General',
      date: date ? new Date(date) : Date.now(),
      notes
    });

    return res.status(201).json(txn);
  } catch (err) {
    console.error('addTransaction', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * DELETE /api/transactions/:id
 */
exports.deleteTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const txn = await Transaction.findById(id);
    if (!txn) return res.status(404).json({ message: 'Transaction not found' });
    if (txn.userId.toString() !== userId) return res.status(403).json({ message: 'Not authorized' });

    await txn.remove();
    return res.json({ message: 'Transaction deleted' });
  } catch (err) {
    console.error('deleteTransaction', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/transactions/summary
 * returns { income, expense, balance }
 */
exports.getSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const txns = await Transaction.find({ userId });

    const summary = txns.reduce(
      (acc, t) => {
        if (t.type === 'income') acc.income += t.amount;
        if (t.type === 'expense') acc.expense += t.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );

    summary.balance = summary.income - summary.expense;
    return res.json(summary);
  } catch (err) {
    console.error('getSummary', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
