import "./globals.css";

export const metadata = {
  title: "Gens Birthday Picnic",
  description: "RSVP and picnic item list"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
