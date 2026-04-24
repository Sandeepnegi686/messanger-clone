import { AuthProvider } from "./_context/AuthContext";
import ToasterContext from "./_context/ToasterContext";
import "./globals.css";

export const metadata = {
  title: "Messanger Clone",
  description: "Built on top of NextJs, NodeJs, Express, MongoDB and Socket",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={` h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
          <ToasterContext />
        </AuthProvider>
      </body>
    </html>
  );
}
