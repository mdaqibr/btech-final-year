import React, { useState } from "react";
import { motion } from "framer-motion";
import { updateCompany } from "../../../api/company";
import { Upload, Image as ImageIcon, Loader2, XCircle } from "lucide-react";
import GreetingBlock from "../../../components/BasicDetailsHeader.jsx";

const Step4CompanyInfo = ({ email, onNext, theme }) => {
  const [form, setForm] = useState({
    name: "",
    domain: "",
    location: "",
    bio: "",
    logo: null,
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const showMessage = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 4000);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (file) setForm({ ...form, logo: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("email", email);
    fd.append("name", form.name);
    fd.append("domain", form.domain);
    fd.append("location", form.location);
    fd.append("bio", form.bio);
    if (form.logo) fd.append("logo", form.logo);

    setLoading(true);
    const res = await updateCompany(fd);
    setLoading(false);

    if (!res.success) {
      showMessage("error", res.message || "Something went wrong.");
      return;
    }

    const companyId = res.data.company_id;
    onNext(companyId);
  };

  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <GreetingBlock
        title="Almost there!"
        subtitle="Fill in your company details to complete setup"
        email={email}
        theme={theme}
      />

      {msg.text && (
        <div
          className="d-flex align-items-center gap-2 mb-3 p-2"
          style={{
            backgroundColor: msg.type === "error" ? "#FEE2E2" : "#D1FAE5",
            color: msg.type === "error" ? "#B91C1C" : "#065F46",
            borderRadius: "6px",
          }}
        >
          <XCircle size={16} />
          <span className="small">{msg.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Logo Upload */}
        <div className="mb-4 text-center">
          <label style={{ cursor: "pointer" }}>
            <div
              className="border bg-light d-flex align-items-center justify-content-center"
              style={{
                width: 130,
                height: 130,
                borderRadius: "50%",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {form.logo ? (
                <img
                  src={URL.createObjectURL(form.logo)}
                  alt="logo preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  className="text-center"
                  style={{ color: theme.text.subtitle }}
                >
                  <ImageIcon size={42} />
                  <p className="small mt-1 mb-0">Upload Logo</p>
                </div>
              )}
            </div>

            <span
              className="d-flex justify-content-center align-items-center"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                backgroundColor: theme.primary,
                color: "#fff",
                position: "absolute",
                bottom: 0,
                right: 0,
              }}
            >
              <Upload size={16} />
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={handleLogo}
              className="d-none"
            />
          </label>
        </div>

        {/* Name */}
        <div className="mb-3">
          <label className="form-label" style={{ color: theme.text.body }}>
            Company Name
          </label>
          <input
            name="name"
            className="form-control"
            placeholder="e.g. Acme Corp"
            value={form.name}
            onChange={handleChange}
            required
            style={{ borderColor: theme.primary, color: theme.text.body }}
          />
        </div>

        {/* Domain */}
        <div className="mb-3">
          <label className="form-label" style={{ color: theme.text.body }}>
            Domain
          </label>
          <input
            name="domain"
            className="form-control"
            placeholder="e.g. acme.com"
            value={form.domain}
            onChange={handleChange}
            required
            style={{ borderColor: theme.primary, color: theme.text.body }}
          />
        </div>

        {/* Location */}
        <div className="mb-3">
          <label className="form-label" style={{ color: theme.text.body }}>
            Location
          </label>
          <input
            name="location"
            className="form-control"
            placeholder="e.g. New Delhi, India"
            value={form.location}
            onChange={handleChange}
            required
            style={{ borderColor: theme.primary, color: theme.text.body }}
          />
        </div>

        {/* Bio */}
        <div className="mb-3">
          <label className="form-label" style={{ color: theme.text.body }}>
            Bio
          </label>
          <textarea
            name="bio"
            className="form-control"
            placeholder="Short description about your company"
            value={form.bio}
            onChange={handleChange}
            style={{ borderColor: theme.primary, color: theme.text.body }}
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn w-100 d-flex justify-content-center align-items-center gap-2"
          style={{ backgroundColor: theme.primary, color: "#fff" }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="spin" /> Processing...
            </>
          ) : (
            "Continue →"
          )}
        </button>
      </form>

      <style>{`
        .spin {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default Step4CompanyInfo;