import './globals.css';

export const metadata = {
  title: 'Multi-Tier Academic Portal | Hierarchical Portal Architecture',
  description: 'Enterprise Multi-Tier Hierarchical Academic Portal for Superadmins, Institutions, Teachers, and Students.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#ffffff] text-[#0f172a] antialiased min-h-screen selection:bg-indigo-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
