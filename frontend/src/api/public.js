import axios from "axios";

export const getCompanyCount = async () => {
  const res = await axios.get("http://localhost:8000/api/public/company-count/");
  return res.data;
};
