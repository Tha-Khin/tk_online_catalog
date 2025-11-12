import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductsSection from "@/components/ProductsSection";
import Providers from "./providers";
import { AuthProvider } from "@/context/AuthContext";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden group/design-root">
      <AuthProvider>
        <Navbar />
      </AuthProvider>
      <div className="grow">
        <Providers>
          <ProductsSection />
        </Providers>
      </div>
      <Footer />
    </div>
  );
}
