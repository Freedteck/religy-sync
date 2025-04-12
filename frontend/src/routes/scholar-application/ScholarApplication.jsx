import { useState } from "react";
import styles from "./ScholarApplication.module.css";
import StepsProgress from "../../components/steps-progress/StepsProgress";
import PersonalInfo from "../../components/personal-info/PersonalInfo";
import Credentials from "../../components/credentials/Credentials";
import Tradition from "../../components/tradition/Tradition";
import Review from "../../components/review/Review";

const ScholarApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",

    // Credentials & Faith Tradition
    credentials: "",
    faithTradition: "",
    denomination: "",

    // Additional Information
    additionalInfo: "",

    // Areas of Expertise
    expertise: {
      scripture: false,
      theology: false,
      ritual: false,
      history: false,
      ethics: false,
      mysticism: false,
      contemporary: false,
    },
    otherExpertise: "",

    // Verification & Wallet
    credentialsDoc: null,
    walletAddress: "",

    // Terms
    agreeTerms: false,
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name.startsWith("expertise.")) {
        const expertiseField = name.split(".")[1];
        setFormData({
          ...formData,
          expertise: {
            ...formData.expertise,
            [expertiseField]: checked,
          },
        });
      } else {
        setFormData({
          ...formData,
          [name]: checked,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle file uploads
  const handleFileUpload = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    }
  };

  // Next step
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // Previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Submit the form to the blockchain
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Preparing to submit to blockchain:", formData);

    try {
      // Format data for blockchain submission
      const blockchainData = {
        name: formData.name,
        credentials: formData.credentials,
        faithTradition: formData.faithTradition,
        additionalInfo: JSON.stringify({
          email: formData.email,
          denomination: formData.denomination,
          expertise: Object.keys(formData.expertise).filter(
            (key) => formData.expertise[key]
          ),
          otherExpertise: formData.otherExpertise,
        }),
      };

      console.log("Submitting to blockchain:", blockchainData);
      // Here you would call the Sui blockchain function:
      // apply_for_scholar(platform, name, credentials, faithTradition, additionalInfo)

      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Scholar Application</h1>
        <p className={styles.pageDescription}>
          Join our community of verified religious scholars and share your
          knowledge with seekers worldwide. All content you create will be
          stored on the Sui blockchain for authenticity and permanence.
        </p>
      </div>

      {/* Application Steps Progress */}
      <StepsProgress currentStep={currentStep} />

      {/* Application Form */}
      <div className={styles.applicationForm}>
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <PersonalInfo
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {currentStep === 2 && (
            <Credentials
              formData={formData}
              handleInputChange={handleInputChange}
              handleFileUpload={handleFileUpload}
            />
          )}

          {currentStep === 3 && (
            <Tradition
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {currentStep === 4 && (
            <Review formData={formData} handleInputChange={handleInputChange} />
          )}

          <div className={styles.formActions}>
            {currentStep > 1 && (
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={prevStep}
              >
                Previous
              </button>
            )}
            {currentStep < 4 ? (
              <button
                type="button"
                className={styles.primaryButton}
                onClick={nextStep}
              >
                Next
              </button>
            ) : (
              <button type="submit" className={styles.primaryButton}>
                Submit Application
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScholarApplication;
