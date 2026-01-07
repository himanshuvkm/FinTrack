import { Toaster } from "@/components/ui/sonner";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-5 py-16">
          {children}
        </div>

        <Toaster
          richColors
          theme="light"
          toastOptions={{
            className:
              "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-lg",
          }}
        />
      </main>
    </>
  );
}
