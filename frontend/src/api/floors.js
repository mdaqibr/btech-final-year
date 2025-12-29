// src/api/floors.js
import api from "./axios";

export const getFloors = (branchId, buildingId) =>
  api
    .get(
      `accounts/companies/branches/${branchId}/buildings/${buildingId}/floors/`
    )
    .then((res) => res.data);

export const createFloor = (branchId, payload) =>
  api
    .post(
      `accounts/companies/branches/${branchId}/buildings/${payload.building}/floors/`,
      payload
    )
    .then((res) => res.data);

export const getFloorVendors = (branchId, buildingId, floorId) =>
  api
    .get(
      `accounts/companies/branches/${branchId}/buildings/${buildingId}/floors/${floorId}/vendors/`
    )
    .then((res) => res.data);
