"use server";
import { fetchUserEmail } from '@/utils/fetchUserEmail';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

async function signUploadFile(folder: string, upload_preset: string, file_metadata: string) {
    const userEmail = await fetchUserEmail();

    if (!userEmail)
        throw new Error("User not defined");


    const timestamp = Math.round((new Date()).getTime() / 1000);

    if (!apiSecret) {
        throw new Error("CLOUDINARY_API_SECRET is not defined");
    }

    try {
        const signature = cloudinary.utils.api_sign_request({
            timestamp: timestamp,
            folder: folder,
            upload_preset: upload_preset,
            context: file_metadata,
        }, apiSecret);

        return { timestamp, signature, apiKey };

    } catch (error) {
        console.error("Error Uploading Image: ", error);
        throw new Error("Image Upload Failed!");
    }
}


export { signUploadFile };