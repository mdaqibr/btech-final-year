// src/pages/vendor/steps/VStep4VendorInfo.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { updateVendor } from "../../../api/vendor";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import GreetingBlock from "../../../components/BasicDetailsHeader.jsx";

const VStep4VendorInfo = ({ email, onNext }) => {
  const [form, setForm] = useState({ name: "", logo: null });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (file) setForm({...form, logo: file});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append("email", email);
    fd.append("name", form.name);
    if (form.logo) fd.append("logo", form.logo);

    const res = await updateVendor(fd);
    setLoading(false);
    if (!res.success) { setMsg(res.message || "Error"); return; }
    onNext(res.data.vendor_id);
  };

  return (
    <motion.div key="vstep4" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}>
      <GreetingBlock
        title="Set up your vendor profile"
        subtitle="Provide your vendor details to continue"
        email={email}
      />
      {msg && <div className="alert alert-danger alert-round-shape mb-3">{msg}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4 text-center">
          <label className="d-inline-block position-relative" style={{ cursor: "pointer" }}>
            <div className="border rounded-circle p-3 bg-light d-flex align-items-center justify-content-center" style={{ width:110, height:110 }}>
              {form.logo ? (<img src={URL.createObjectURL(form.logo)} alt="logo" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} />) : (<div className="text-muted text-center"><ImageIcon size={36} /><div className="small">Upload Logo</div></div>)}
            </div>

            <span className="position-absolute bottom-0 end-0 bg-primary text-white d-flex justify-content-center align-items-center" style={{ width:34, height:34, borderRadius:"50%" }}>
              <Upload size={14} />
            </span>

            <input type="file" accept="image/*" onChange={handleLogo} className="d-none" />
          </label>
        </div>

        <div className="mb-3">
          <label className="form-label">Vendor Name</label>
          <input name="name" className="form-control round-shape" placeholder="Vendor name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} required />
        </div>

        <button type="submit" disabled={loading} className="btn btn-purple w-100 round-shape">
          {loading ? (<><Loader2 size={16} className="spin" /> Saving...</>) : "Continue →"}
        </button>
      </form>

      <style>{`.spin{animation:spin .8s linear infinite}@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </motion.div>
  );
};

export default VStep4VendorInfo;