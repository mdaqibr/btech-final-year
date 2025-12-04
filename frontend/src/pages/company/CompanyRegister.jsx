import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import Step1Email from "./steps/Step1Email";
import Step2Password from "./steps/Step2Password";
import Step3OTP from "./steps/Step3OTP";
import Step4CompanyInfo from "./steps/Step4CompanyInfo";
import Step5Branches from "./steps/Step5Branches";
import Step6Success from "./steps/Step6Success";

import bgImg from "../../../assets/bg-company.jpg";
import "../../styles/vendor.css"; // SAME styling as vendor

import { getCompanyCount } from "../../api/public";
import { themes } from "./../../theme";

const CompanyRegister = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState(null);
  const [country, setCountry] = useState("India");
  const [password, setPassword] = useState("");
  const [companyCount, setCompanyCount] = useState(100);

  useEffect(() => {
    getCompanyCount().then((data) => setCompanyCount(data.count || 100));
  }, []);

  const theme = themes.company;

  return (
    <div
      className="vendor-container min-vh-100 d-flex flex-column flex-md-row"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        color: "#fff",
      }}
    >
      <div className="overlay-dark"></div>

      {/* LEFT SECTION */}
      <div
        className="
          vendor-left
          col-12 col-md-7
          d-flex flex-column 
          px-4 px-sm-5 py-4 py-md-5
          text-md-start
        "
      >
        <div className="mb-4">
          <h3 className="fw-bold text-white fs-4 fs-md-3">☕ Cafetero</h3>
        </div>

        <div className="mt-auto pb-3 pb-md-5">
          <h2
            className="fw-bold lh-base mb-3"
            style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)" }}
          >
            Join {companyCount.toLocaleString()}+ Companies Growing with Cafetero
          </h2>

          <p className="text-light mb-4 fs-6 fs-md-5">
            Manage Vendors | Employees | Dashboard | Smooth Operations
          </p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div
        className="
          vendor-right
          col-12 col-md-5
          bg-white text-dark 
          px-4 px-sm-5 
          py-5 
          shadow-lg
        "
        style={{
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
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
              onNext={() => setStep(2)}
              theme={theme}
            />
          )}

          {step === 2 && (
            <Step2Password
              key="step2"
              email={email}
              setPassword={setPassword}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
              theme={theme}
            />
          )}

          {step === 3 && (
            <Step3OTP
              key="step3"
              email={email}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
              theme={theme}
            />
          )}

          {step === 4 && (
            <Step4CompanyInfo
              key="step4"
              email={email}
              onNext={(id) => {
                setCompanyId(id);
                setStep(5);
              }}
              theme={theme}
            />
          )}

          {step === 5 && (
            <Step5Branches
              key="step5"
              companyId={companyId}
              onSubmit={() => setStep(6)}
              theme={theme}
            />
          )}

          {step === 6 && <Step6Success key="step6" theme={theme} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CompanyRegister;