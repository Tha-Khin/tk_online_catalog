'use client';
import { useProductDetail, useRelatedProducts } from "@/hooks/useProducts";
import { ProductIdProps } from "@/types"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const ProductDetail = ({id}: ProductIdProps) => {

  const { data: product, isLoading: isProductLoading, isError } = useProductDetail(id);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { data: relatedProducts, isLoading: areRelatedLoading } = 
    useRelatedProducts(product?.category, product?.id);

  const activeImage = selectedImage || (product?.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : null);

  if (isProductLoading) return <div>Loading Detail...</div>;
  if (isError || !product) return <div>An error occurred in product detail.</div>;
  if (!activeImage) return <div>No images found for this product.</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-12">
        <div className="grow lg:w-2/3">
            {/* Product Gallary */}
            <div className="flex flex-col gap-4">
                <Image className="w-full rounded-xl" alt='product-image' src={activeImage} width={1000} height={600} loading="eager"/>
                <div className="grid grid-cols-5 gap-3">
                    {product.imageUrls.map((image, index) => <Image onClick={() => setSelectedImage(image)} src={image} key={index} alt={`product-image-${index}`} width={250} height={150} className="w-full rounded-lg border-2 border-primary cursor-pointer"/>)}
                </div>
            </div>
            {/* Product Info */}
            <div className="mt-8">
                <h1 className="text-[#181711] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">{product.title} <span className="text-[#898361] text-sm">({product.category})</span></h1>
                <p className="text-[#898361] dark:text-[#f8f8f6]/70 text-lg font-normal leading-normal mt-2">
                    Experience unparalleled comfort and performance with our latest model, designed for both casual joggers and marathon runners.
                </p>
                <p className="text-3xl font-bold mt-4 text-[#181711] dark:text-white">{product.price.toLocaleString('en-US')} MMK</p>
                <button className="w-full sm:w-auto grow flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-primary text-[#181711] text-base font-bold leading-normal tracking-[0.015em] mt-2 sm:mt-5">
                    <span className="truncate">Buy Now</span>
                </button>
                {/* Detailed Info Tabs */}
                <div className="mt-10 border-t border-[#f4f4f0] dark:border-[#221f10] pt-6">
                    <div className="flex gap-6 border-b border-[#f4f4f0] dark:border-[#221f10]">
                        <button className="py-3 font-bold border-b-2 border-primary text-[#181711] dark:text-white">Description</button>
                    </div>
                    <div className="py-6 text-base text-[#181711]/80 dark:text-[#f8f8f6]/80 space-y-4">
                        <p>{product.description}</p>
                    </div>
                </div>
            </div>
        </div>
        {/* Product Sidebar */}
        <aside className="lg:w-1/3 shrink-0">
            <div className="sticky top-10 space-y-8">
                {/* Related Products */}
                <div className="bg-white dark:bg-[#1c1a0e] p-6 rounded-lg shadow-sm border border-[#f4f4f0] dark:border-[#221f10]">
                    <h3 className="text-lg font-bold text-[#181711] dark:text-white mb-4">Related Products</h3>
                    {areRelatedLoading && <div>Loading related items...</div>}
                    <div className="space-y-5">
                        {relatedProducts?.length === 0 ? 
                        <p className="text-sm text-[#898361] dark:text-[#f8f8f6]/70">No related products found.</p> 
                        :
                        relatedProducts?.map((rProduct, index) => (<Link href={`/${rProduct.id}`} className="flex items-center gap-4" key={index}>
                            <Image src={rProduct.imageUrls[0]} alt={`related-product-image-${index}`} width={250} height={150} className="w-25 h-15 rounded-md shrink-0"/>
                            <div>
                                <h4 className="font-bold text-sm text-[#181711] dark:text-white">{rProduct.title}</h4>
                                <p className="text-sm text-[#898361] dark:text-[#f8f8f6]/70">{rProduct.price.toLocaleString('en-US')} MMK</p>
                            </div>
                        </Link>))}
                    </div>
                </div>
            </div>
        </aside>
    </div>
  )
}

export default ProductDetail