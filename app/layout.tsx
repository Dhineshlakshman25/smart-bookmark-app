import "./globals.css";

export const metadata = {
  title: "Smart Bookmark",
  description: "Save and organize your bookmarks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
