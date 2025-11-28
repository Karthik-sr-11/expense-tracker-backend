const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getTransactions,
  addTransaction,
  deleteTransaction,
  getSummary
} = require('../controllers/transactionController');

// All routes protected by auth middleware
router.get('/', auth, getTransactions);
router.post('/add', auth, addTransaction);
router.delete('/:id', auth, deleteTransaction);
router.get('/summary', auth, getSummary);

module.exports = router;
