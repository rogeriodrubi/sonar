import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sonar",
  description: "Plataforma para gravar, armazenar e explorar sessões de psicoterapia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
