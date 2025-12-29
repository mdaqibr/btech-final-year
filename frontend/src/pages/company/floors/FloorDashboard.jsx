// src/pages/company/floors/FloorDashboard.jsx
import React from "react";
import { useParams } from "react-router-dom";
import FeatureDashboard from "../shared/FeatureDashboard";

const FloorDashboard = () => {
  const { branchId, buildingId, floorId } = useParams();
  const basePath = `/company/branches/${branchId}/buildings/${buildingId}/floors/${floorId}`;

  return <FeatureDashboard basePath={basePath} />;
};

export default FloorDashboard;