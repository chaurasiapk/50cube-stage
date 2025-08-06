const express = require('express');
const router = express.Router();
const { 
  getMerchCatalog, 
  getMerchQuote, 
  redeemMerch 
} = require('../controllers/merchController');

// @route   GET /api/merch/catalog
// @desc    Get merchandise catalog
// @access  Public
router.get('/catalog', getMerchCatalog);

// @route   POST /api/merch/quote
// @desc    Get quote for merchandise with credits applied
// @access  Private
router.post('/quote', getMerchQuote);

// @route   POST /api/merch/redeem
// @desc    Redeem merchandise with credits
// @access  Private
router.post('/redeem', redeemMerch);

module.exports = router;