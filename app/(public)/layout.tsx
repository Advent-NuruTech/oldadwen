import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
