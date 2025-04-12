import styles from "./StepsProgress.module.css";

const StepsProgress = ({ currentStep }) => {
  const steps = [
    { number: 1, label: "Personal Information" },
    { number: 2, label: "Credentials" },
    { number: 3, label: "Faith Tradition" },
    { number: 4, label: "Review & Submit" },
  ];

  return (
    <div className={styles.stepsProgress}>
      {steps.map((step) => (
        <div
          key={step.number}
          className={`${styles.step} ${
            currentStep >= step.number ? styles.active : ""
          }`}
        >
          <div className={styles.stepNumber}>{step.number}</div>
          <div className={styles.stepLabel}>{step.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StepsProgress;
