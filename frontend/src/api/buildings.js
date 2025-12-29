// src/api/buildings.js
import api from "./axios";

export const getBuildings = (branchId) =>
  api
    .get(`accounts/companies/branches/${branchId}/buildings/`)
    .then((res) => res.data);

export const createBuilding = (payload) =>
  api
    .post(`accounts/companies/branches/${payload.branch}/buildings/`, payload)
    .then((res) => res.data);
