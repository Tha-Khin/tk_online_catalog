"use client";

import ImageUploader from "@/components/ImageUploader";
import { uploadFiles } from "@/libs/uploadFiles";
import { Product } from "@/types";
import { db } from "@/firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { assets } from "@/assets/assets";

const initialState: Omit<Product, "id"> = {
    title: "",
    description: "",
    shortDesc: "",
    category: "",
    price: 0,
    imageUrls: [],
    isActive: true,
};

export default function AddProduct() {
    const [formData, setFormData] = useState(initialState);
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const queryClient = useQueryClient();

    async function addProduct(data: Omit<Product, "id">) {
        await addDoc(collection(db, "products"), data);
    }

    const mutation = useMutation({
        mutationFn: addProduct,
        onSuccess: () => {
            toast.success("Product added successfully!");
            queryClient.invalidateQueries({ queryKey: ["products"] });

            setFormData(initialState);
            setFiles([]);
            setLoading(false);
        },
        onError: () => {
            toast.error("Failed to add product");
            setLoading(false);
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (files.length === 0) {
            return setError("Please upload at least 1 image.");
        }

        if (!formData.title.trim() || !formData.shortDesc.trim() || !formData.description.trim() || !formData.category.trim()) {
            return setError("All form fields are required.");
        }

        setLoading(true);

        try {
            const uploadedUrls = await uploadFiles(files);

            const payload: Omit<Product, "id"> = {
                ...formData,
                imageUrls: uploadedUrls,
            };

            mutation.mutate(payload);
        } catch (err) {
            console.error(err);
            toast.error("Image upload failed.");
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: name === 'price' ? Number(value) : value,
        }));
    };

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold text-black">Add Product</h1>

            <form onSubmit={handleSubmit} className="mt-5">
                <ImageUploader files={files} setFiles={setFiles} max={5} />
                <div className="flex flex-col gap-1 max-w-md mt-4">
                    <label className="text-base font-medium">Product Name</label>
                    <input name="title" value={formData.title} onChange={handleChange} className="border px-3 py-2 rounded" placeholder="Enter product name" required/>
                </div>
                <div className="flex flex-col gap-1 max-w-md mt-4">
                    <label className="text-base font-medium">Product Short Description</label>
                    <input name="shortDesc" value={formData.shortDesc} onChange={handleChange} className="border px-3 py-2 rounded" placeholder="Enter product short description" required/>
                </div>
                <div className="flex flex-col gap-1 max-w-md mt-4">
                    <label className="text-base font-medium">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={4} required className="border px-3 py-2 rounded resize-none"/>
                </div>
                <div className="flex flex-col gap-1 max-w-md mt-4">
                    <label className="text-base font-medium">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="border px-3 py-2 rounded" required>
                        <option value="">Select Category</option>
                        {assets.categories.map((c, i) => (
                            <option key={i} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1 max-w-md mt-4">
                    <label className="text-base font-medium">Price</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required className="border px-3 py-2 rounded"/>
                </div>

                <button type="submit" disabled={loading} className="bg-primary text-white px-8 py-2 rounded mt-4">
                    {loading ? "Adding..." : "ADD"}
                </button>

                {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
        </div>
    );
}
