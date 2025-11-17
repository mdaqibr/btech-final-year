import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Step1Email from "./steps/Step1Email";
import Step2Password from "./steps/Step2Password";
import Step3OTP from "./steps/Step3OTP";
import Step4CompanyInfo from "./steps/Step4CompanyInfo";
import Step5Branches from "./steps/Step5Branches";
import Step6Success from "./steps/Step6Success";
import bgImg from "../../../assets/bg-company.jpg";
import { getCompanyCount } from "../../api/public";

const CompanyRegister = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState(null);
  const [country, setCountry] = useState("India");
  const [password, setPassword] = useState("");
  const [companyCount, setCompanyCount] = useState(100);

  useEffect(() => {
    // Fetch available companies count from public API
    getCompanyCount().then((data) => setCompanyCount(data.count || 100));
  }, []);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);
  const handleSubmit = (data) => {
    console.log("Final form data:", data);
  };

  return (
    <div
      className="d-flex flex-column flex-md-row align-items-stretch justify-content-between min-vh-100"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        color: "#fff",
      }}
    >
      {/* Overlay for better text contrast */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      ></div>

      {/* LEFT SECTION */}
      <div
        className="position-relative d-flex flex-column justify-content-between text-white px-4 px-md-5 py-4 py-md-5 w-100 w-md-6"
        style={{
          flex: 1,
          zIndex: 2,
        }}
      >
        {/* Brand Name */}
        <div className="mb-4">
          <h3 className="fw-bold text-white">☕ Cafetero</h3>
        </div>

        {/* Bottom Text */}
        <div className="mt-auto">
          <h2 className="fw-bold lh-base mb-3" style={{ fontSize: "1.8rem" }}>
            Join {companyCount.toLocaleString()}+ Businesses that Trust Cafetero
          </h2>
          <p className="text-light mb-4">
            Connect Vendors | Manage Employees | Powerful Dashboard
          </p>
        </div>
      </div>

      {/* RIGHT SECTION (Form Area) */}
      <div
        className="position-relative bg-white text-dark rounded-top-4 rounded-md-0 px-4 px-md-5 py-5 w-100 w-md-4"
        style={{
          minHeight: "80vh",
          zIndex: 3,
          borderTopLeftRadius: "2rem",
          borderBottomLeftRadius: "2rem",
        }}
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <Step1Email
              key="step1"
              email={email}
              setEmail={setEmail}
              country={country}
              setCountry={setCountry}
              onNext={handleNext}
            />
          )}
          {step === 2 && (
            <Step2Password
              key="step2"
              email={email}
              setPassword={setPassword}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 3 && (
            <Step3OTP
              key="step3"
              email={email}
              onNext={handleNext}
              onBack={() => setStep(1)}
            />
          )}
          {step === 4 && (
            <Step4CompanyInfo
              key="step4"
              email={email}
              onNext={(company_id) => {
                setCompanyId(company_id);
                handleNext();
              }}
            />
          )}
          {step === 5 && (
            <Step5Branches
              key="step5"
              companyId={companyId}
              onSubmit={() => setStep(6)}
            />
          )}
          {step === 6 && <Step6Success key="step6" />}
        </AnimatePresence>
      </div>

      {/* Mobile adjustments */}
      <style>{`
        @media (max-width: 768px) {
          .w-md-4 { width: 100% !important; }
          .w-md-6 { width: 100% !important; }
          .rounded-md-0 { border-radius: 0 !important; }
          .rounded-top-4 { border-radius: 1.5rem 1.5rem 0 0 !important; }
          .rounded-bottom-4 { border-radius: 0 0 1.5rem 1.5rem !important; }
          h2 { font-size: 1.4rem !important; }
          h3 { font-size: 1.2rem !important; }
          .form-control, .btn { font-size: 0.95rem !important; }
          .text-light { font-size: 0.9rem !important; }
        }

        @media (min-width: 992px) {
          .w-md-4 { width: 33.3333% !important; }
          .w-md-6 { width: 66.6667% !important; }
        }
      `}</style>
    </div>
  );
};

export default CompanyRegister;
