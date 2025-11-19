import { Toaster } from "@/components/ui/sonner";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="container mx-auto my-20">{children}</main>
        <Toaster richColors/>
      </body>
    </html>
  );
}
