import { checkUser } from "@/lib/checkUser";
import React from "react";

async function Dashboardlayout({ children }: { children: React.ReactNode }) {
  await checkUser();

  return (
    <div className="min-h-screen bg-neutral-950 px-5 rounded-lg">
 <h1 className=" text-4xl text-center font-bold font-[Poppins] pt-4 tracking-wide text-white/90">
    Dashboard
  </h1>

  {children}
</div>

  );
}

export default Dashboardlayout;
