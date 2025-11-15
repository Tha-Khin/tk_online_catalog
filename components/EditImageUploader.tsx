"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
    files: File[];
    setFiles: (files: File[]) => void;
    max?: number;
    deleteImage: (urlToDelete: string) => Promise<void>;
    prevImages: string[];
}

export default function EditImageUploader({ files, setFiles, max = 5, deleteImage, prevImages }: Props) {
    const [filePreviews, setFilePreviews] = useState<string[]>([]);
    const [allPreviews, setAllPreviews] = useState<string[]>([]);

    // Generate previews for uploaded files
    useEffect(() => {
        const urls = files.map(file => URL.createObjectURL(file));
        // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
        setFilePreviews(urls);

        return () => urls.forEach(url => URL.revokeObjectURL(url));
    }, [files]);

    // Merge prevImages + filePreviews
    useEffect(() => {
        setAllPreviews([...prevImages, ...filePreviews]);
    }, [prevImages, filePreviews]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const selected = Array.from(e.target.files);
        const available = max - prevImages.length;
        setFiles([...files, ...selected].slice(0, available));
    };

    const handleImageDelete = async (url: string, index: number) => {
        const isPrev = prevImages.includes(url);

        if (isPrev) {
            await deleteImage(url);
        } else {
            // local uploads — remove File
            const fileIndex = index - prevImages.length;
            const newFiles = files.filter((_, i) => i !== fileIndex);
            setFiles(newFiles);
        }
    };

    return (
        <div>
            <label className="text-base font-medium block">
                Product Images (Max {max})
            </label>

            <div className="flex flex-wrap gap-4 items-end mt-3">

                {allPreviews.map((url, index) => (
                    <div key={url} className="relative w-24 h-24 border rounded overflow-hidden">
                        <Image src={url} alt="Preview" fill sizes="200px" className="object-cover" />

                        <button
                            type="button"
                            onClick={() => handleImageDelete(url, index)}
                            className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            ✕
                        </button>
                    </div>
                ))}

                {allPreviews.length < max && (
                    <>
                        <label
                            htmlFor="uploader"
                            className="w-24 h-24 border-2 border-dashed rounded flex items-center justify-center cursor-pointer">
                            + Upload
                        </label>

                        <input id="uploader" type="file" multiple className="hidden" onChange={handleChange} />
                    </>
                )}

            </div>
        </div>
    );
}
