import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "User CRUD application with NextJS 15",
  description: "developed by Amir haghighi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col mx-auto my-5 justify-center items-center">{children}</body>
    </html>
  );
}
