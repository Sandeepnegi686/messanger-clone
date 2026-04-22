// import AuthHydrator from "./_context/AuthContext";
import ToasterContext from "./_context/ToasterContext";
import "./globals.css";
// import { getServerAuth } from "./lib/auth-server";

export const metadata = {
  title: "Messanger Clone",
  description: "Built on top of NextJs, NodeJs, Express, MongoDB and Socket",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const auth = await getServerAuth();
  return (
    <html lang="en" className={` h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <>
          {/* {auth?.accessToken && <AuthHydrator accessToken={auth.accessToken} />} */}
          {children}
          <ToasterContext />
        </>
      </body>
    </html>
  );
}
