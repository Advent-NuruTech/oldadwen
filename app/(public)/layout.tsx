import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div
      className="min-h-[100svh] flex flex-col text-gray-900 relative bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url('https://res.cloudinary.com/dg7jxs7st/image/upload/v1777989749/nature1_pwxrui.jpg')",
      }}
    >
      {/* Soft overlay for readability */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

      {/* Content layer */}
      <div className="relative z-10 flex flex-col min-h-[100svh]">
        
        <Header />

        <main className="flex-1 flex flex-col">
          {children}
        </main>

        <Footer />

      </div>
    </div>
  );
}