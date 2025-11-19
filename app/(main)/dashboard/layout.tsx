import React, { Suspense } from "react";
import Dashboardpage from "./page";
import { BarLoader } from "react-spinners";

function Dashboardlayout() {
  return (
    <div className="px-5">
      <h1 className="text-4xl font-bold bg-gradient-to-r text-gray-900 bg-clip-text  mb-5">
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
