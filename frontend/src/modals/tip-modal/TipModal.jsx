import React, { useEffect, useState } from "react";
import styles from "./TipModal.module.css";
import Button from "../../components/button/Button";

const TipModal = ({ isOpen, onClose, answerId, sendReward, isRewardSent }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const presetAmounts = [1, 2, 5, 10, 20];

  // Reset states when modal is opened (especially when opened again)
  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setLoading(false);
    }
  }, [isOpen]);

  // Handle reward status changes
  useEffect(() => {
    if (isRewardSent) {
      setSuccess(true);
      setLoading(false);
    }
  }, [isRewardSent]);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handlePresetAmount = (preset) => {
    setAmount(preset.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      // Call the sendReward function from props
      sendReward(answerId, parseFloat(amount));
    } catch (error) {
      console.error("Transaction failed:", error);
      setLoading(false);
      alert("Transaction failed. Please try again.");
    }
  };

  const handleCloseAndReset = () => {
    setAmount("");
    setSuccess(false);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Tip Scholar</h2>
          <button
            className={styles.closeButton}
            onClick={handleCloseAndReset}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className={styles.tipForm}>
            <div className={styles.amountContainer}>
              <label htmlFor="tipAmount" className={styles.label}>
                Amount (SUI)
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="tipAmount"
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  step="1"
                  min="1"
                  className={styles.amountInput}
                  disabled={loading}
                />
                <span className={styles.currencyIndicator}>SUI</span>
              </div>
            </div>

            <div className={styles.presetAmounts}>
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={styles.presetButton}
                  onClick={() => handlePresetAmount(preset)}
                  disabled={loading}
                >
                  {preset} SUI
                </button>
              ))}
            </div>

            <div className={styles.buttonContainer}>
              <Button
                text={loading ? "Processing..." : "Send Tip"}
                disabled={loading}
              />
            </div>
          </form>
        ) : (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <h3>Tip Sent Successfully!</h3>
            <p>You've sent {amount} SUI to the scholar</p>

            <button
              className={styles.closeButton}
              onClick={handleCloseAndReset}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TipModal;
