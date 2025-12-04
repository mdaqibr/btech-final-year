import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import VStep1Email from "./steps/Step1Email";
import VStep2Password from "./steps/Step2Password";
import VStep3OTP from "./steps/Step3OTP";
import VStep4VendorInfo from "./steps/Step4VendorInfo";
import VStep5Branches from "./steps/Step5VendorBranches";
import VStep6Success from "./steps/Step6Success";

import BrandLogo from "../../components/BrandLogo";
import bgImg from "../../../assets/bg-company.jpg";
import "../../styles/vendor.css";

const VendorRegister = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [vendorId, setVendorId] = useState(null);
  const [country, setCountry] = useState("India");
  const [password, setPassword] = useState("");
  const [vendorCount, setVendorCount] = useState(500);

  return (
    <div
      className="vendor-container min-vh-100 d-flex flex-column flex-md-row"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        color: "#fff",
      }}
    >
      <div className="overlay-dark"></div>

      {/* LEFT SECTION */}
      <div className="vendor-left col-12 col-md-7 d-flex flex-column px-4 px-sm-5 py-4 py-md-5">
        
        <BrandLogo />

        <div className="mt-auto pb-3 pb-md-5">

          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="fw-bold lh-base mb-3"
            style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)" }}
          >
            Join {vendorCount.toLocaleString()}+ Vendors Growing with Cafetero
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-light mb-4 fs-6 fs-md-5"
          >
            Get Orders • Manage Menu • Automate Billing
          </motion.p>

        </div>
      </div>

      {/* RIGHT SECTION */}
      <div
        className="vendor-right col-12 col-md-5 bg-white text-dark px-4 px-sm-5 py-5 shadow-lg"
        style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <VStep1Email
              key="vstep1"
              email={email}
              setEmail={setEmail}
              country={country}
              setCountry={setCountry}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <VStep2Password
              key="vstep2"
              email={email}
              setPassword={setPassword}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <VStep3OTP
              key="vstep3"
              email={email}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && (
            <VStep4VendorInfo
              key="vstep4"
              email={email}
              onNext={(id) => {
                setVendorId(id);
                setStep(5);
              }}
            />
          )}

          {step === 5 && (
            <VStep5Branches
              key="vstep5"
              vendorId={vendorId}
              onSubmit={() => setStep(6)}
            />
          )}

          {step === 6 && <VStep6Success key="vstep6" />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VendorRegister;