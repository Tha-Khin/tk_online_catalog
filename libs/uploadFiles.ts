export async function uploadFiles(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed for file: ${file.name}`);
        }

        const data = await response.json();
        return data.url as string;
    });

    return Promise.all(uploadPromises);
}