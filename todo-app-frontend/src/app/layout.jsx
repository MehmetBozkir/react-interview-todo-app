import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

export const metadata = {
  title: "Case Study - ToDo App",
  description: "Todo app with add, edit, delete features",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
