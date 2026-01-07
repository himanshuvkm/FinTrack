import { Toaster } from "@/components/ui/sonner";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="min-h-screen bg-neutral-950">
  <div className="container mx-auto px-5 py-16 text-white">
    {children}
  </div>

  <Toaster
    richColors
    theme="dark"
    toastOptions={{
      className:
        "bg-neutral-900 border border-white/10 text-white",
    }}
  />
</main>

    </>
  );
}
