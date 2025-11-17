import React, { useState } from "react";
import { motion } from "framer-motion";
import { updateCompany } from "../../../api/company";
import { Upload, Image as ImageIcon, Loader2, XCircle } from "lucide-react";

const Step4CompanyInfo = ({ email, onNext }) => {
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
    if (file) {
      setForm({ ...form, logo: file });
    }
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
      <h4 className="fw-bold mb-3">Company Information</h4>

      {/* UI Message */}
      {msg.text && (
        <div
          className={`alert rounded-pill py-2 px-3 mb-3 ${
            msg.type === "error" ? "alert-danger" : "alert-success"
          } d-flex align-items-center gap-2`}
        >
          <XCircle size={16} />
          <span className="small">{msg.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Logo Upload */}
        <div className="mb-4 text-center">
          <label
            className="d-inline-block position-relative"
            style={{ cursor: "pointer" }}
          >
            <div
              className="border rounded-circle p-4 bg-light d-flex align-items-center justify-content-center"
              style={{
                width: 130,
                height: 130,
                overflow: "hidden",
                position: "relative",
              }}
            >
              {form.logo ? (
                <img
                  src={URL.createObjectURL(form.logo)}
                  alt="logo preview"
                  className="rounded-circle"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div className="text-muted text-center">
                  <ImageIcon size={42} />
                  <p className="small mt-1 mb-0">Upload Logo</p>
                </div>
              )}
            </div>

            {/* Perfectly Round Blue Icon */}
            <span
              className="position-absolute bottom-0 end-0 bg-primary text-white d-flex justify-content-center align-items-center"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
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
          <label className="form-label">Company Name</label>
          <input
            name="name"
            className="form-control rounded-pill"
            placeholder="e.g. Acme Corp"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Domain */}
        <div className="mb-3">
          <label className="form-label">Domain</label>
          <input
            name="domain"
            className="form-control rounded-pill"
            placeholder="e.g. acme.com"
            value={form.domain}
            onChange={handleChange}
            required
          />
        </div>

        {/* Location */}
        <div className="mb-3">
          <label className="form-label">Location</label>
          <input
            name="location"
            className="form-control rounded-pill"
            placeholder="e.g. New Delhi, India"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>

        {/* Bio */}
        <div className="mb-3">
          <label className="form-label">Bio</label>
          <textarea
            name="bio"
            className="form-control rounded-4"
            placeholder="Short description about your company"
            value={form.bio}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-100 rounded-pill mt-2 d-flex justify-content-center align-items-center gap-2"
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

      {/* Loader animation */}
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