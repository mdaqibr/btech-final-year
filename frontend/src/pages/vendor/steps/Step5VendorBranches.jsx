// src/pages/vendor/steps/VStep5Branches.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { addVendorBranches } from "../../../api/vendor";
import { Plus, Trash2, MapPin, Loader2, CheckCircle } from "lucide-react";
import GreetingBlock from "../../../components/AddBranchesHeader.jsx";

const COUNTRY_LIST = [
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
];

const VStep5Branches = ({ vendorId, onSubmit }) => {
  const [branches, setBranches] = useState([{ branch_name:"", address:"", city:"", state:"", country:"IN" }]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const addBranch = () => setBranches([...branches, { branch_name:"", address:"", city:"", state:"", country:"IN" }]);
  const removeBranch = (i) => setBranches(branches.filter((_, idx) => idx !== i));

  const handleChange = (i, field, val) => {
    const c = [...branches]; c[i][field] = val; setBranches(c);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // basic validation
    if (!vendorId) { setMsg({type:"error", text:"Vendor id missing"}); return; }
    setLoading(true);
    const payload = { vendor_id: vendorId, branches };
    const res = await addVendorBranches(payload);
    setLoading(false);
    if (!res.success) { setMsg({type:"error", text:res.message}); return; }
    setMsg({type:"success", text:"Vendor registered!"});
    setTimeout(()=> onSubmit(), 900);
  };

  return (
    <motion.div key="vstep5" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} style={{maxHeight:"80vh", overflowY:"auto"}}>
      <GreetingBlock email={null} />

      {msg && (<div className={`alert ${msg.type==="error" ? "alert-danger" : "alert-success"} alert-round-shape`}>{msg.text}</div>)}

      <form onSubmit={handleSubmit}>
        {branches.map((b, i) => (
          <div key={i} className="border rounded-4 p-3 mb-3 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="m-0 d-flex align-items-center gap-2"><MapPin size={16}/> Branch {i+1}</h6>
              {branches.length>1 && <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>removeBranch(i)}><Trash2 size={14}/> Remove</button>}
            </div>

            <input className="form-control mb-2 round-shape" placeholder="Branch name" value={b.branch_name} onChange={(e)=>handleChange(i,"branch_name",e.target.value)} required />
            <textarea className="form-control mb-2 rounded-4" placeholder="Address" value={b.address} onChange={(e)=>handleChange(i,"address",e.target.value)} />
            <div className="d-flex gap-2 mb-2">
              <input className="form-control round-shape" placeholder="City" value={b.city} onChange={(e)=>handleChange(i,"city",e.target.value)} />
              <input className="form-control round-shape" placeholder="State" value={b.state} onChange={(e)=>handleChange(i,"state",e.target.value)} />
            </div>

            <select className="form-select round-shape" value={b.country} onChange={(e)=>handleChange(i,"country",e.target.value)}>
              {COUNTRY_LIST.map(c=> <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
            </select>
          </div>
        ))}

        <button type="button" className="btn btn-outline-purple w-100 mb-3 round-shape d-flex justify-content-center gap-2" onClick={addBranch}><Plus size={16}/> Add Another Branch</button>

        <button type="submit" disabled={loading} className="btn btn-purple w-100 round-shape d-flex justify-content-center gap-2">
          {loading ? (<><Loader2 size={16} className="spin" /> Saving... </>) : "Submit Vendor →"}
        </button>
      </form>

      <style>{`.spin{animation:spin .8s linear infinite}@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </motion.div>
  );
};

export default VStep5Branches;