// src/pages/company/buildings/BuildingFeatureDashboard.jsx
import React from "react";
import { useParams } from "react-router-dom";
import FeatureDashboard from "../shared/FeatureDashboard";

const BuildingFeatureDashboard = () => {
  const { branchId, buildingId } = useParams();
  const basePath = `/company/branches/${branchId}/buildings/${buildingId}`;
  return <FeatureDashboard basePath={basePath} />;
};

export default BuildingFeatureDashboard;