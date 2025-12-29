import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import EntityCard from "../../../components/common/EntityCard";

const FloorsSelector = ({ floors }) => {
  const navigate = useNavigate();
  const { branchId, buildingId } = useParams();

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">Select Floor</h3>

      <div className="row">
        {floors.map((f) => (
          <div key={f.id} className="col-md-4 mb-3">
            <EntityCard
              title={f.floor_name}
              subtitle={`Floor ${f.floor_number}`}
              onClick={() =>
                navigate(
                  `/company/branches/${branchId}/buildings/${buildingId}/floors/${f.id}/dashboard`
                )
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloorsSelector;