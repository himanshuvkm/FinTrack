import { Toaster } from "@/components/ui/sonner";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="min-h-screen bg-[#faf9f6]">
        <div className="pt-16">
          {children}
        </div>

        <Toaster
          richColors
          theme="light"
          toastOptions={{
            className:
              "bg-white border border-[#e4e1db] text-[#1a1a16] shadow-lg rounded-none",
          }}
        />
      </main>
    </>
  );
}
