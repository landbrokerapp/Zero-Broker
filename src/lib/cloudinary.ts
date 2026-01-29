export const uploadToCloudinary = async (file: File | string): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'zerobroker';

    if (!cloudName) {
        console.error('Cloudinary Cloud Name is missing in environment variables');
        throw new Error('Cloudinary configuration error: Cloud Name missing');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    console.log(`Uploading to Cloudinary: ${cloudName} with preset: ${uploadPreset}`);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Cloudinary API Error:', errorData);
            throw new Error(errorData.error?.message || 'Failed to upload image to Cloudinary');
        }

        const data = await response.json();
        console.log('Cloudinary Upload Success:', data.secure_url);
        return data.secure_url;
    } catch (error) {
        console.error('Cloudinary upload exception:', error);
        throw error;
    }
};
