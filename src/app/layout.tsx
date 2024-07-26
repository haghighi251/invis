import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/components/ReactQuery/ReactQueryProvider";
import { BreadcrumbComponent } from "@/components/Breadcrumb/Breadcrumb";

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
      <body>
        <ReactQueryProvider>
          <div className="flex w-full flex-col mx-auto my-5 justify-center items-center py-3">
            <BreadcrumbComponent />
            {children}
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
