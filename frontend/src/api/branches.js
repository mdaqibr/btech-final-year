import api from "./axios";

export const getBranches = () =>
  api.get("accounts/companies/branches/").then(res => res.data);

export const createBranch = (payload) =>
  api.post("accounts/companies/add-branches/", payload).then(res => res.data);