// src/pages/vendor/Dashboard.jsx
import VendorBranches from "./sections/VendorBranches";
import VendorRequests from "./sections/VendorRequests";
import VendorWorkers from "./sections/VendorWorkers";
import VendorStats from "./sections/VendorStats";

const VendorDashboard = () => {
  console.log("Vendor dashboard.");
  return (
    <div className="container mt-4">
      <VendorStats />
      <VendorBranches />
      <VendorRequests />
      <VendorWorkers />
    </div>
  );
};

export default VendorDashboard;
