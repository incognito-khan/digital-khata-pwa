import "./globals.css";

export const metadata = {
  title: "Digital Khata",
  description: "Private daily expense khata",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: 0,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <main className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
          {children}
        </main>
      </body>
    </html>
  );
}
