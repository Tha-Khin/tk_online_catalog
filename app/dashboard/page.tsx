"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { toggleIsActive, useProducts } from '@/hooks/useProducts';
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditModal from "./EditModal";
import { Product } from "@/types";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import ConfirmModal from "./ConfirmModal";
import { toast } from "react-toastify";

export default function DashboardPage() {
    const { loading } = useAuth();
    const { data, isLoading, isError, error } = useProducts();
    const queryClient = useQueryClient();
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [targetProduct, setTargetProduct] = useState<Product | null>(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const PRODUCTS_PER_PAGE = 10;
    const productsToDisplay = data || [];
    const totalProducts = productsToDisplay.length;
    const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const currentProducts = productsToDisplay.slice(startIndex, endIndex);

    const toggleMutation = useMutation({
        mutationFn: toggleIsActive,
        onSuccess: () => {
            toast.success("Active status updated successfully.");
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: () => {
            toast.error("Failed to update active status.");
        },
    });

    const onUpdateSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        toast.success("Product updated successfully.");
    };

    const handleConfirmDelete = async () => {
        if (!targetProduct) return;
        try {
            await deleteDoc(doc(db, "products", targetProduct.id));
            toast.success("Product deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ['products'] });
            setTargetProduct(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete product.");
        }
    };

    if (isLoading) return <div>Loading products...</div>;
    if (isError) return <div>An error occurred: {error.message}</div>;

    if (loading) {
        return <div>Loading session...</div>;
    }

    return (
        <div className="w-full">
            <div className="w-full p-4 md:p-10">
                <h2 className="pb-4 text-lg font-medium">All Products</h2>
                <div className="flex flex-col items-center w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                    <table className="md:table-auto table-fixed w-full overflow-hidden">
                        <thead className="text-gray-900 text-sm text-left">
                            <tr>
                                <th className="px-4 py-3 font-semibold truncate">Product</th>
                                <th className="px-4 py-3 font-semibold truncate">Category</th>
                                <th className="px-4 pr-40 py-3 font-semibold truncate hidden md:block text-end">Selling Price</th>
                                <th className="px-4 py-3 font-semibold truncate">In Stock</th>
                                <th className="px-4 py-3 font-semibold truncate">Manage</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-500">
                            {currentProducts.map((product) => (
                                <tr key={product.id} className="border-t border-gray-500/20">
                                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                                        <div className="border border-gray-300 rounded p-2">
                                            <Image src={product.imageUrls[0]} alt="Product" width={100} height={100} className="w-16" />
                                        </div>
                                        <span className="truncate max-sm:hidden w-full">{product.title}</span>
                                    </td>
                                    <td className="px-4 py-3">{product.category}</td>
                                    <td className="px-4 pr-40 py-3 max-sm:hidden text-end">{product.price.toLocaleString('en-US')} MMK</td>
                                    <td className="px-4 py-3">
                                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                            <input type="checkbox" checked={product.isActive} onChange={() => product.id && toggleMutation.mutate(product.id)} disabled={toggleMutation.isPending} className="sr-only peer" />
                                            <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-primary transition-colors duration-200"></div>
                                            <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                        </label>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span onClick={() => setProductToEdit(product)} className="text-blue-600 font-semibold cursor-pointer mr-2">Edit</span>|
                                        <span onClick={() => setTargetProduct(product)} className="text-red-500 font-semibold cursor-pointer ml-2">Delete</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* --- PAGINATION CONTROLS --- */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">          
                    {/* Previous Button */}
                    <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className={`px-4 py-2 border rounded-lg transition ${currentPage === 1 ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-50 border-primary cursor-pointer'}`}>Previous</button>
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
                    <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className={`px-4 py-2 border rounded-lg transition ${currentPage === totalPages ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-50 border-primary cursor-pointer'}`}>Next</button>          
                    </div>
                )}
            </div>
            {productToEdit && (
                <EditModal product={productToEdit} close={() => setProductToEdit(null)} onUpdateSuccess={onUpdateSuccess}/>
            )}
            {targetProduct && (
                <ConfirmModal targetProduct={targetProduct} onConfirm={handleConfirmDelete} onCancel={() => setTargetProduct(null)}
                />
            )}
        </div>
    )
}