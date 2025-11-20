import { Toaster } from "@/components/ui/sonner";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="container mx-auto my-20">
        {children}
      </main>
      <Toaster richColors />
    </>
  );
}
