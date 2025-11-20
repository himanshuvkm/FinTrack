import React, { Suspense } from "react";
import Dashboardpage from "./page";
import { BarLoader } from "react-spinners";

function Dashboardlayout() {
  return (
    <div className="px-5">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-5">
  Dashboard
</h1>

      <Suspense
        fallback={<BarLoader color="#00ACB6" width={"100%"} className="mt-4" />}
      >
        <Dashboardpage />
      </Suspense>
    </div>
  );
}

export default Dashboardlayout;
