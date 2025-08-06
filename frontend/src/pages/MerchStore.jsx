import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getMerchCatalog, getMerchQuote, redeemMerch } from "../api";
import { useUser } from "../context/UserContext";

const MerchStore = () => {
  const { t } = useTranslation();
  const { user, updateCredits } = useUser(); // Get user data from context

  // State for product catalog and user selection
  const [catalog, setCatalog] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quote, setQuote] = useState(null);
  const [creditsToApply, setCreditsToApply] = useState(0);

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderComplete, setOrderComplete] = useState(false);

  // Credit system configuration
  const CREDIT_VALUE = 0.03; // Each credit is worth $0.03
  const MAX_CREDIT_COVERAGE = 0.6; // Max 60% of price can be paid with credits

  useEffect(() => {
    // Fetch merchandise catalog on mount
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        // In a real application, this would be a backend API call
        const response = await getMerchCatalog();
        setCatalog(response.data);
      } catch (err) {
        setError("Failed to load merchandise catalog");
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  // Calculate how many credits the user can apply for a product
  const calculateMaxCredits = (product) => {
    if (!product) return 0;

    const maxDollarCoverage = product.price * MAX_CREDIT_COVERAGE;
    const maxCreditsNeeded = Math.floor(maxDollarCoverage / CREDIT_VALUE);

    // Cap at user's available credits
    return Math.min(maxCreditsNeeded, user.credits);
  };

  // User selects a product to apply credits toward
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCreditsToApply(0);
    setQuote(null);
    setOrderComplete(false);
  };

  // Apply credits to selected product to generate quote
  const handleApplyCredits = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      // In production: backend calculates pricing and returns final quote
      const response = await getMerchQuote({
        productId: selectedProduct._id,
        creditsApplied: creditsToApply,
      });

      if (response.data) {
        setQuote(response.data);
      }
    } catch (err) {
      setError("Failed to generate quote.");
    }
  };

  // Complete the order by redeeming credits and confirming payment
  const handleCompleteOrder = async () => {
    try {
      // In production: backend processes redemption and updates user credits
      const response = await redeemMerch({
        email: user.email,
        productId: selectedProduct._id,
        creditsApplied: creditsToApply,
        cashPayment: quote.cashPayment,
      });

      const { remainingCredits } = response.data ?? {};

      // Update context so UI reflects new credit balance
      updateCredits(remainingCredits);

      setOrderComplete(true);
    } catch (err) {
      setError("Failed to complete order");
    }
  };

  // Start new order from scratch
  const handleReset = () => {
    setSelectedProduct(null);
    setQuote(null);
    setCreditsToApply(0);
    setOrderComplete(false);
  };

  // ---------------- UI Rendering ----------------

  if (loading) {
    return <div className="text-center py-10">{t("common.loading")}</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-center md:justify-between items-center mb-8 gap-2 flex-wrap">
        <h1 className="font-bold text-3xl">{t("merch.title")}</h1>
        <div className="bg-white px-4 py-2 rounded-md shadow-sm">
          <span className="text-gray-600 mr-2">
            {t("common.availableCredits")}:
          </span>
          <span className="font-bold">{user.credits.toLocaleString()}</span>
        </div>
      </div>

      {/* Order confirmation screen */}
      {orderComplete ? (
        <div className="bg-white p-8 rounded-md shadow-md text-center">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-2">{t("merch.orderConfirmed")}</h2>
          <p className="mb-6">{t("merch.thankYou")}</p>
          <button
            onClick={handleReset}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {t("common.confirm")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {/* Product Catalog View */}
          {!selectedProduct && !quote && (
            <div className={`lg:col-span-${selectedProduct ? "1" : "3"}`}>
              <h2 className="text-xl font-semibold mb-4">Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {catalog.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-white p-4 rounded-md shadow-md cursor-pointer hover:scale-[110%] transition-all ${
                      selectedProduct?.id === product.id
                        ? "ring-2 ring-blue-500"
                        : "hover:shadow-lg"
                    }`}
                    onClick={() => handleSelectProduct(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover rounded-md mb-4"
                    />
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {product.description}
                    </p>
                    <p className="font-bold">${product.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Apply Credits Form */}
          {selectedProduct && !quote && (
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-md shadow-md">
                <h2 className="text-xl font-semibold mb-4">Apply Credits</h2>
                <div className="flex items-center mb-4">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-20 h-20 object-cover rounded-md mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{selectedProduct.name}</h3>
                    <p className="font-bold">${selectedProduct.price.toFixed(2)}</p>
                  </div>
                </div>

                <form onSubmit={handleApplyCredits}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("merch.applyCredits")}
                    </label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="0"
                        max={calculateMaxCredits(selectedProduct)}
                        value={creditsToApply}
                        onChange={(e) =>
                          setCreditsToApply(parseInt(e.target.value))
                        }
                        className="w-full mr-4"
                      />
                      <span className="font-medium w-20 text-right">{creditsToApply}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>0</span>
                      <span>
                        {t("merch.maxCredits")}: {calculateMaxCredits(selectedProduct)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      Value: ${(creditsToApply * CREDIT_VALUE).toFixed(2)}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2 flex-1">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                      {t("common.backToStore")}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      {t("merch.apply")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Final Quote Summary */}
          {quote && (
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-md shadow-md">
                <h2 className="text-xl font-semibold mb-4">Quote Summary</h2>
                <div className="flex items-center mb-6">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-20 h-20 object-cover rounded-md mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{selectedProduct.name}</h3>
                    <p className="font-bold">${selectedProduct.price.toFixed(2)}</p>
                  </div>
                </div>

                {/* Breakdown of costs */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span>{t("merch.subtotal")}</span>
                    <span>${quote.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("merch.shipping")}</span>
                    <span>${quote.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("merch.tax")}</span>
                    <span>${quote.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>{t("merch.total")}</span>
                    <span>${quote.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Credit application summary */}
                <div className="space-y-2 mb-6 p-4 bg-gray-50 rounded-md">
                  <div className="flex justify-between">
                    <span>{t("merch.creditsApplied")}</span>
                    <span>
                      {quote.creditsApplied} (${quote.creditValue.toFixed(2)})
                    </span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>{t("merch.cashPayment")}</span>
                    <span>${quote.cashPayment.toFixed(2)}</span>
                  </div>
                </div>

                {/* Final action buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => setQuote(null)}
                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                  >
                    {t("common.cancel")}
                  </button>
                  <button
                    onClick={handleCompleteOrder}
                    style={{ whiteSpace: "nowrap" }}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    {t("merch.completeOrder")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MerchStore;
