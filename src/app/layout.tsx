import type { Metadata } from "next";
import "../styles/globals.css";
import {AppShell} from "../components/app-shell";


export const metadata: Metadata = {
  title: "Seguimiento de Cartas Fianza",
  description: "Prototipo local de gestión y seguimmiento de Cartas Fianza",
};

export default function RootLayout(
  { children,}: Readonly<{ 
    children: React.ReactNode;
  }>) {
  return (
    <html lang="es">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
