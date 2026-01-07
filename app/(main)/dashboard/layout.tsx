import { checkUser } from "@/lib/checkUser";
import React from "react";

async function Dashboardlayout({ children }: { children: React.ReactNode }) {
  await checkUser();

  return (
    <div className="min-h-screen px-5 rounded-lg">

  {children}
</div>

  );
}

export default Dashboardlayout;
