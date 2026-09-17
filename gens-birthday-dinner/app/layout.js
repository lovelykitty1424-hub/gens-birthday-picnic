import "./globals.css";

export const metadata = {
  title: "Mi Cena de Cumpleaños",
  description: "Invitación y RSVP para mi cena de cumpleaños",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
