"use client";

import { useState } from 'react';
import ProductCard from './ProductCard'
import { useProducts } from '@/hooks/useProducts';
import Image from 'next/image';
import { assets } from '@/assets/assets';

const ProductsSection = () => {
  const categories = assets.categories;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const PRODUCTS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, error } = useProducts();

  if (isLoading) return <div>Loading products...</div>;
  if (isError) return <div>An error occurred: {error.message}</div>;

  const productsToDisplay = data?.filter(product => {
    const activeProducts = product.isActive === true;
    const categoryMatches = !selectedCategory || product.category === selectedCategory;
    const searchMatches = !searchQuery || product.title.toLowerCase().includes(searchQuery.toLowerCase());
    return activeProducts &&categoryMatches && searchMatches;
  }) || []; // Ensure productsToDisplay is always an array, not undefined

  // Calculate pagination variables
  const totalProducts = productsToDisplay.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = productsToDisplay.slice(startIndex, endIndex);

  return (
    <div className='pt-40 pb-4 md:pb-8 px-4 md:px-14 lg:px-40 w-full mx-auto'>
      <div className="absolute top-25 right-1/2 lg:right-40 translate-x-1/2 lg:translate-x-0 flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
        <input onChange={(e)=> {setSearchQuery(e.target.value); setCurrentPage(1);}} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
        <Image src={assets.searchIcon} alt='search' className='w-4 h-4'/>
      </div>
      <h2 className='text-3xl font-medium text-gray-800 text-center'>TK Online Catalog</h2>
      <div className='flex flex-wrap gap-2 md:gap-5 mt-5 px-5 lg:px-50 justify-center'>
        <p onClick={() => {setSelectedCategory(null); setSearchQuery('')}} className={`${selectedCategory === null ? 'bg-primary text-white' : 'text-gray-800'} text-sm md:text-base hover:bg-primary hover:text-white border border-primary px-4 py-1 rounded-full cursor-pointer`}>All Products</p>
        {categories.map((category, index) => <p key={index} onClick={() => {setSelectedCategory(category); setCurrentPage(1);}} className={`${selectedCategory === category ? 'bg-primary text-white' : 'text-gray-800'} text-sm md:text-base hover:bg-primary hover:text-white border border-primary px-4 py-1 rounded-full cursor-pointer`}>{category}</p>)}
      </div>
      <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 px-4 md:px-0 my-10 md:my-16 gap-4'>
        {currentProducts.map((product)=> <ProductCard key={product.id} product={product}/>)}
      </div>
      {currentProducts.length === 0 && (
        <div className='text-center text-gray-500 my-10'>
          <p className='text-lg'>No products found!</p>
        </div>
      )}
      {/* --- PAGINATION CONTROLS --- */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">          
          {/* Previous Button */}
          <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className={`hidden md:flex px-4 py-2 border rounded-lg transition ${currentPage === 1 ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-50 border-primary cursor-pointer'}`}>Previous</button>
          {/* Page Number Buttons */}
          <div className="flex items-center gap-2">
            {/* Create an array from 1 to totalPages */}
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <button key={pageNumber} onClick={() => setCurrentPage(pageNumber)} disabled={currentPage === pageNumber} className={`px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer ${currentPage === pageNumber ? 'bg-primary text-white border-primary cursor-default' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}>{pageNumber}</button>
              );
            })}
          </div>          
          {/* Next Button */}
          <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className={`hidden md:flex px-4 py-2 border rounded-lg transition ${currentPage === totalPages ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-50 border-primary cursor-pointer'}`}>Next</button>          
        </div>
      )}
    </div>
  )
}

export default ProductsSection