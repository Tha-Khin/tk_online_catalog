"use client"
import { assets } from "@/assets/assets";
import { db } from "@/firebase/firebase";
import { Product } from "@/types";
import { addDoc, collection } from "firebase/firestore";
import { CldUploadWidget, CloudinaryUploadWidgetResults, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

const initialState: Omit<Product, 'id'> = {
    title: "",
    description: "",
    category: "",
    price: 0,
    imageUrls: [],
    isActive: true,
};

export default function AddProduct() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState(initialState);

    const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
        if (result.event === 'success') {
            if (typeof result.info === 'object' && result.info !== null) {
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
        }
    };

    const deleteImage = async (urlToDelete: string) => {
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

            setFormData(prevData => ({
                ...prevData,
                imageUrls: prevData.imageUrls.filter(url => url !== urlToDelete),
            }));
        } catch (error) {
            toast.error("Failed to delete image: " + error);
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'number' ? Number(value) : value,
        }));
    };

    const addProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        if (formData.imageUrls.length === 0) {
            setError("Please upload at least one product image.");
            return;
        }
        if (!formData.title) {
            setError("Product name is required.");
            return;
        }
        if (!formData.category) {
            setError("Please select a category.");
            return;
        }
        if (formData.price <= 0 || isNaN(formData.price)) {
            setError("Please enter a valid price greater than 0.");
            return;
        }
        setLoading(true);
        
        try {
            if (!db) {
                throw new Error("Firebase database is not initialized.");
            }
            
            await addDoc(collection(db, "products"), formData);

            toast.success("Product added successfully.");
            setFormData(initialState);
        } catch (err) {
            toast.error("Failed to add product.");
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold text-black">Add Product</h1>
            <form onSubmit={addProduct} className="mt-5">
                {/* --- IMAGE DISPLAY AND UPLOAD SECTION --- */}
                <label className="text-base font-medium block">Product Images (Maximum 5 images)</label>
                <div className="flex flex-wrap gap-4 items-end mt-2.5">
                    
                    {/* Display existing and newly uploaded images */}
                    {formData.imageUrls.length > 0 && formData.imageUrls.map((imageUrl) => (
                        <div key={imageUrl} className="relative w-24 h-24 border border-gray-300 rounded overflow-hidden">
                            <Image src={imageUrl} alt='Product' layout="fill" objectFit="cover" />
                            <button type="button" onClick={() => deleteImage(imageUrl)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition cursor-pointer">✕</button>
                        </div>
                    ))}

                    {/* Single Upload Widget */}
                    {formData.imageUrls.length < 5 && (
                        <CldUploadWidget 
                            options={{multiple: false, maxFiles: 1, clientAllowedFormats: ["jpg", "png", "jpeg", "webp"], maxImageFileSize: 1000000}} 
                            uploadPreset="tk-online-catalog" 
                            onSuccess={handleUploadSuccess}>
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

                <div className="flex flex-col gap-1 max-w-md mt-4">
                    <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                    <input value={formData.title} onChange={handleFormChange} name="title" id="product-name" type="text" placeholder="Type here" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                </div>
                <div className="flex flex-col gap-1 max-w-md mt-4">
                    <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                    <textarea value={formData.description} onChange={handleFormChange} name="description" id="product-description" rows={4} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" placeholder="Type here"></textarea>
                </div>
                <div className="flex flex-col gap-1 max-w-md mt-4">
                    <label className="text-base font-medium" htmlFor="category">Category</label>
                    <select value={formData.category} onChange={handleFormChange} name="category" id="category" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40">
                        <option value="">Select Category</option>
                        {assets.categories.map((category, index)=>(
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1 max-w-md mt-4">
                    <label className="text-base font-medium" htmlFor="product-price">Price</label>
                    <input value={formData.price} onChange={handleFormChange} name="price" id="product-price" type="number" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" placeholder="Type here" required></input>
                </div>
                
                {/* Disable button while loading */}
                <button className="px-8 py-1.5 bg-primary text-white font-medium rounded cursor-pointer mt-4" type="submit" disabled={loading}>
                    {loading ? "Adding..." : "ADD"}
                </button>

                {/* Feedback messages */}
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
        </div>
    );
}