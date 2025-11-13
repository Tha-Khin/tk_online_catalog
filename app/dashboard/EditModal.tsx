"use client";

import { assets } from "@/assets/assets";
import { db } from "@/firebase/firebase";
import { Product } from "@/types";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { CldUploadWidget, CloudinaryUploadWidgetInfo, CloudinaryUploadWidgetResults } from "next-cloudinary";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface EditModalProps {
    product: Product;
    close: () => void;
    onUpdateSuccess: () => void; 
}

export default function EditModal({ product, close, onUpdateSuccess }: EditModalProps) {    
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Product>(product);

    useEffect(() => {
        setFormData(product);
    }, [product]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: name === 'price' ? Number(value) : value,
        }));
    };

    const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
        if (result.event === 'success') {
            const info = result.info as CloudinaryUploadWidgetInfo;
            if (info.secure_url) {
                const newUrl = info.secure_url;
                setFormData(prevData => {
                    if (prevData.imageUrls.length < 5) {
                        return { ...prevData, imageUrls: [...prevData.imageUrls, newUrl] };
                    }
                    return prevData;
                });
            }
        }
    };

    const deleteImage = async (urlToDelete: string) => {
        if (!formData.id) {
            console.error("Cannot delete image: Product ID is missing.");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('/api/cloudinary-delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: urlToDelete }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete image on server.');
            }

            const productRef = doc(db, "products", formData.id);
            await updateDoc(productRef, {
                imageUrls: arrayRemove(urlToDelete),
            });

            setFormData(prevData => ({
                ...prevData,
                imageUrls: prevData.imageUrls.filter(url => url !== urlToDelete),
            }));
        } catch (error) {
            console.error("Deletion failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const editProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.imageUrls.length === 0) {
            toast.error("Please upload at least one product image.");
            return;
        }

        setLoading(true);
        try {
            const productRef = doc(db, "products", product.id);
            const snapshot = await getDoc(productRef);
            if (!snapshot.exists()) {
                throw new Error("Product not found");
            }
            const { id, ...dataToUpdate } = formData;
            await updateDoc(productRef, dataToUpdate);             
            setLoading(false);
            onUpdateSuccess();
            close();
        } catch (err) {
            setLoading(false);
            console.error(err);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full max-w-2xl bg-white p-6 rounded shadow-lg relative overflow-y-auto max-h-screen">
                <button onClick={close} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-xl cursor-pointer">✕</button>
                <h1 className="text-2xl font-bold">Edit Product: {product.title}</h1>
                
                <form onSubmit={editProduct} className="mt-5 space-y-4">

                    {/* --- IMAGE DISPLAY AND UPLOAD SECTION --- */}
                    <label className="text-base font-medium block">Product Images (Maximum 5 images)</label>
                    <div className="flex flex-wrap gap-4 items-end">
                        
                        {/* 3. Display existing and newly uploaded images */}
                        {formData.imageUrls.map((imageUrl) => (
                            <div key={imageUrl} className="relative w-24 h-24 border border-gray-300 rounded overflow-hidden">
                                <Image src={imageUrl} alt='Product' layout="fill" objectFit="cover" />
                                <button type="button"  disabled={loading} onClick={() => deleteImage(imageUrl)} className={`absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>✕</button>
                            </div>
                        ))}

                        {/* 4. Single Upload Widget */}
                        {formData.imageUrls.length < 5 && (
                             <CldUploadWidget 
                                options={{multiple: false, maxFiles: 1, clientAllowedFormats: ["jpg", "png", "jpeg", "webp"], maxImageFileSize: 1000000}} 
                                uploadPreset="tk-online-catalog" 
                                onSuccess={handleUploadSuccess} 
                            >
                                {({ open }) => (
                                    <button 
                                        type="button" 
                                        onClick={() => open()} 
                                        className="w-24 h-24 border-2 border-dashed border-gray-400 rounded flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/10 transition cursor-pointer"
                                    >
                                        + Upload
                                    </button>
                                )}
                            </CldUploadWidget>
                        )}
                    </div>
                    {/* --- END IMAGE SECTION --- */}

                    {/* Product Name */}
                    <div className="flex flex-col gap-1 max-w-md">
                        <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                        <input name="title" id="product-name" type="text" value={formData.title} onChange={handleFormChange} placeholder="Type here" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>

                    {/* Product Description */}
                    <div className="flex flex-col gap-1 max-w-md">
                        <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                        <textarea name="description" id="product-description" value={formData.description} onChange={handleFormChange} rows={4} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" placeholder="Type here"></textarea>
                    </div>

                    {/* Category */}
                    <div className="flex flex-col gap-1 max-w-md">
                        <label className="text-base font-medium" htmlFor="category">Category</label>
                        <select name="category" id="category" value={formData.category} onChange={handleFormChange} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40">
                            <option value="">Select Category</option>
                            {assets.categories.map((category, index)=>(
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price */}
                    <div className="flex flex-col gap-1 max-w-md">
                        <label className="text-base font-medium" htmlFor="product-price">Price</label>
                        <input name="price" id="product-price" value={formData.price} onChange={handleFormChange} type="number" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" placeholder="Type here" required/>
                    </div>
                    
                    {/* Submission Button */}
                    <button className="px-8 py-1.5 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition cursor-pointer mt-4 disabled:bg-gray-400" type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}