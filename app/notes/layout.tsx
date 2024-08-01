import Navbar from "@/components/Navbar";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div>
            <Navbar />
          <main className="m-auto max-w-7xl p-4">{children}</main>
        </div>
    );
  }