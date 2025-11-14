"use client";

import { assets } from "@/assets/assets";
import { db } from "@/firebase/firebase";
import { Product } from "@/types";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { uploadFiles } from "@/libs/uploadFiles";
import EditImageUploader from "@/components/EditImageUploader";

interface EditModalProps {
    product: Product;
    close: () => void;
    onUpdateSuccess: () => void; 
}

export default function EditModal({ product, close, onUpdateSuccess }: EditModalProps) {    
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Product>(product);
    const [files, setFiles] = useState<File[]>([]);
    const [prevImages, setPrevImages] = useState<string[]>(product.imageUrls || []);
    const [urlsToDelete, setUrlsToDelete] = useState<string[]>([]);

    useEffect(() => {
        setFormData(product);
        setPrevImages(product.imageUrls || []);
    }, [product]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: name === 'price' ? Number(value) : value,
        }));
    };

    const deleteImage = async (urlToDelete: string) => {
        if (!formData.id) {
            console.error("Cannot delete image: Product ID is missing.");
            return;
        }
        setPrevImages(prev => prev.filter(url => url !== urlToDelete));
        setUrlsToDelete(prev => [...prev, urlToDelete]);
        setFormData(prevData => ({
            ...prevData,
            imageUrls: prevData.imageUrls.filter(url => url !== urlToDelete),
        }));
    };

    const editProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const totalImageCount = prevImages.length + files.length;
        if (totalImageCount === 0 && (formData.imageUrls?.length ?? 0) === 0) {
            toast.error("Please upload at least one product image.");
            return;
        }

        setLoading(true);
        try {
            if (urlsToDelete.length > 0) {
                const res = await fetch('/api/cloudinary-delete-batch', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ urls: urlsToDelete }),
                });
                
                if (!res.ok) {
                    throw new Error('Failed to delete images from Cloudinary.');
                }
            }
            const uploadedUrls = await uploadFiles(files);
            const allUrls = [...prevImages, ...uploadedUrls];
            const payload: Omit<Product, "id"> = {
                ...formData,
                imageUrls: allUrls,
            };
            const productRef = doc(db, "products", product.id);
            const snapshot = await getDoc(productRef);
            if (!snapshot.exists()) {
                throw new Error("Product not found");
            }
            await updateDoc(productRef, payload);         
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
                    <EditImageUploader files={files} setFiles={setFiles} max={5} deleteImage={deleteImage} prevImages={prevImages}/>
                    <div className="flex flex-col gap-1 max-w-md">
                        <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                        <input name="title" id="product-name" type="text" value={formData.title} onChange={handleFormChange} placeholder="Type here" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                    <div className="flex flex-col gap-1 max-w-md">
                        <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                        <textarea name="description" id="product-description" value={formData.description} onChange={handleFormChange} rows={4} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" placeholder="Type here"></textarea>
                    </div>
                    <div className="flex flex-col gap-1 max-w-md">
                        <label className="text-base font-medium" htmlFor="category">Category</label>
                        <select name="category" id="category" value={formData.category} onChange={handleFormChange} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40">
                            <option value="">Select Category</option>
                            {assets.categories.map((category, index)=>(
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1 max-w-md">
                        <label className="text-base font-medium" htmlFor="product-price">Price</label>
                        <input name="price" id="product-price" value={formData.price} onChange={handleFormChange} type="number" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" placeholder="Type here" required/>
                    </div>
                    
                    <button className="px-8 py-1.5 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition cursor-pointer mt-4 disabled:bg-gray-400" type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}