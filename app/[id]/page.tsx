import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductDetail from "./ProductDetail";

export default async function SingleProduct({ params }: { params: Promise<{ id: string }>; }) {
    const {id} = await params;
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <Navbar />
      <div className="layout-container flex h-full grow flex-col mt-25">
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <ProductDetail id={id}/>
        </main>
      </div>
      <Footer />
    </div>
  );
}