"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
    files: File[];
    setFiles: (files: File[]) => void;
    max?: number;
}

export default function ImageUploader({ files, setFiles, max = 5 }: Props) {
    const [previews, setPreviews] = useState<string[]>([]);

    // Generate previews
    useEffect(() => {
        const urls = files.map(file => URL.createObjectURL(file));
        // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
        if(urls) setPreviews(urls);

        return () => urls?.forEach(url => URL.revokeObjectURL(url));
    }, [files]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const selected = Array.from(e.target.files);

        setFiles([...files, ...selected].slice(0, max));
    };

    const removeFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
    };

    return (
        <div>
            <label className="text-base font-medium block">
                Product Images (Max {max})
            </label>

            <div className="flex flex-wrap gap-4 items-end mt-2.5">
                {previews.map((url, index) => (
                    <div key={index} className="relative w-24 h-24 border border-gray-300 rounded overflow-hidden">
                        <Image src={url} alt="Preview" fill className="object-cover"/>
                        <button type="button" onClick={() => removeFile(index)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-90 hover:opacity-100 transition">✕</button>
                    </div>
                ))}

                {files.length < max && (
                    <>
                        <label htmlFor="uploader" className="w-24 h-24 border-2 border-dashed border-gray-400 rounded flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/10 transition cursor-pointer">
                            + Upload
                        </label>
                        <input id="uploader" type="file" multiple onChange={handleChange} className="hidden"/>
                    </>
                )}
            </div>
        </div>
    );
}
