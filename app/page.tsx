import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductsSection from "@/components/ProductsSection";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden group/design-root">
      <Navbar />
      <div className="grow">
        <ProductsSection />
      </div>
      <Footer />
    </div>
  );
}
