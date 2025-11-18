import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { checkUser } from "@/lib/checkUser";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Ensure user exists in database (should be already checked in onboarding, but double-check)
  const user = await checkUser();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to your Dashboard, {user?.name || "User"}!
          </h1>
          <p className="text-xl text-gray-600">
            Your financial tracking starts here.
          </p>
        </div>

        {/* Placeholder content */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
          <p className="text-gray-600">
            Dashboard is ready. Add your first transaction, create an account, or set up budgets.
          </p>
        </div>
      </div>
    </div>
  );
}
