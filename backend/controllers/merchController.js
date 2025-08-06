const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");
const Metrics = require("../models/Metrics");

// Constants
const CREDIT_VALUE = 0.03; // 1 credit = $0.03
const MAX_CREDIT_COVERAGE = 0.6; // 60% of subtotal max

/**
 * @desc    Get available merchandise catalog (in-stock only)
 * @route   GET /api/merch/catalog
 * @access  Public
 */
const getMerchCatalog = async (req, res) => {
  try {
    const products = await Product.find({ inStock: true });
    res.json(products);
  } catch (error) {
    console.error("Error fetching merchandise catalog:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get a purchase quote applying user credits
 * @route   POST /api/merch/quote
 * @access  Private
 */
const getMerchQuote = async (req, res) => {
  try {
    const { productId, creditsApplied } = req.body;

    // In production, user would be fetched from req.user (after auth middleware)
    // const user = await User.findById(req.user.id);
    const user = { credits: 1250 }; // Mock user for testing

    // Validate requested credits
    if (creditsApplied > user.credits) {
      return res.status(400).json({ message: "Not enough credits" });
    }

    // Fetch product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Calculate pricing
    const subtotal = product.price;
    const shipping = 4.99;
    const tax = subtotal * 0.08;

    // Convert credits to dollar value, with max limit
    const creditValue = creditsApplied * CREDIT_VALUE;
    const maxCreditValue = subtotal * MAX_CREDIT_COVERAGE;
    const appliedCreditValue = Math.min(creditValue, maxCreditValue);

    // Final cash required
    const cashPayment = subtotal - appliedCreditValue + shipping + tax;

    // Quote object
    const quote = {
      product,
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
      creditsApplied,
      creditValue: appliedCreditValue,
      cashPayment,
    };

    res.json(quote);
  } catch (error) {
    console.error("Error generating merchandise quote:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Redeem product using credits and/or cash
 * @route   POST /api/merch/redeem
 * @access  Private
 */
const redeemMerch = async (req, res) => {
  try {
    const { productId, creditsApplied, cashPayment, email } = req.body;

    // In production, user would come from authentication middleware
    // const user = await User.findById(req.user.id);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate credit balance
    if (creditsApplied > user.credits) {
      return res.status(400).json({ message: "Not enough credits" });
    }

    // Fetch product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Recalculate pricing (to prevent manipulation from frontend)
    const subtotal = product.price;
    const shipping = 4.99;
    const tax = subtotal * 0.08;

    const creditValue = creditsApplied * CREDIT_VALUE;
    const maxCreditValue = subtotal * MAX_CREDIT_COVERAGE;
    const appliedCreditValue = Math.min(creditValue, maxCreditValue);

    const expectedCashPayment = subtotal - appliedCreditValue + shipping + tax;

    // Verify that user-submitted payment matches expected payment (allowing slight rounding tolerance)
    if (Math.abs(cashPayment - expectedCashPayment) > 0.01) {
      return res.status(400).json({ message: "Invalid cash payment amount" });
    }

    // Create and save the order
    const order = new Order({
      user: user._id,
      product: productId,
      creditsApplied,
      creditValue: appliedCreditValue,
      cashPayment,
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
      status: "completed",
    });

    await order.save();

    // Deduct used credits from user's balance
    user.credits -= creditsApplied;
    await user.save();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let metrics = await Metrics.findOne({ date: { $gte: today } });
    if (!metrics) {
      metrics = new Metrics({ date: new Date(), purchases: 1, redemptions: 1 });
    } else {
      metrics.purchases += 1;
      metrics.redemptions += 1;
    }
    await metrics.save();

    res.status(201).json({
      message: "Order completed successfully",
      order,
      remainingCredits: user.credits,
    });
  } catch (error) {
    console.error("Error redeeming merchandise:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getMerchCatalog,
  getMerchQuote,
  redeemMerch,
};
