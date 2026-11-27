import "../styles/index.css";

export const metadata = {
  title: "Harry Koena Mofoka | macOS Portfolio",
  description:
    "Interactive macOS-inspired developer portfolio for Harry Koena Mofoka — software developer, product builder, and co-founder of Nexlink Solutions ZA.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
