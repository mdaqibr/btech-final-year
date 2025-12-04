import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Step1Email from "./steps/Step1Email";
import Step2Password from "./steps/Step2Password";
import Step3OTP from "./steps/Step3OTP";
import Step4EmployeeInfo from "./steps/Step4EmployeeInfo";
import Step5Success from "./steps/Step5Success";

import bgImg from "../../../assets/bg-company.jpg";
import "../../styles/vendor.css";
import BrandLogo from "../../components/BrandLogo";

const EmployeeRegister = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div
      className="vendor-container min-vh-100 d-flex flex-column flex-md-row"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        position: "relative",
      }}
    >
      <div className="overlay-dark"></div>

      {/* LEFT */}
      <div className="vendor-left col-12 col-md-7 d-flex flex-column px-5 py-5">
        
        <BrandLogo />

        <div className="mt-auto">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="fw-bold lh-base"
          >
            Join Your Company on Cafetero
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-light fs-6 mt-3"
          >
            Order Food • Track Orders • Rate Services
          </motion.p>
        </div>
      </div>

      {/* RIGHT */}
      <div
        className="vendor-right col-12 col-md-5 bg-white text-dark px-4 px-sm-5 py-5 shadow-lg"
        style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}
      >
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <Step1Email
              key="step1"
              email={email}
              setEmail={setEmail}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <Step2Password
              key="step2"
              email={email}
              setPassword={setPassword}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <Step3OTP
              key="step3"
              email={email}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && (
            <Step4EmployeeInfo
              key="step4"
              email={email}
              onNext={() => setStep(5)}
            />
          )}

          {step === 5 && <Step5Success key="step5" />}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default EmployeeRegister;