import "./globals.css";

export const metadata = {
  title: "OCOS — Home",
  description: "Official OCOS 21 Network Homepage"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <body className="bg-[#05070f] text-white">{children}</body>
    </html>
  );
}
