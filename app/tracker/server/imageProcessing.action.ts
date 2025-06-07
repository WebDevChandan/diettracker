"use server";
import { CloudStoredFileType } from "@/types/CloudStoredFileURL";
import { ProductNutrientLabelType } from "@/types/ProductNutrientLabel";
import { fetchUserEmail } from "@/utils/fetchUserEmail";
import ai from "@/utils/gemini";
import { extractNutritionFromImage } from "@/utils/prompts/extractNutritionFromImage";
import { GenerateContentResponse, HarmBlockThreshold, HarmCategory } from "@google/genai";

export const imageProcessingAction = async (file: CloudStoredFileType) => {
    try {
        const userEmail = await fetchUserEmail();

        if (!userEmail)
            throw new Error(`User not found`);

        const uploadedImageToGeminiFM = await ai.files.upload({
            file: await fetch(file.secure_url).then(res => res.blob()),
        })

        const geminiFileUri = uploadedImageToGeminiFM.uri;
        const geminiMimeType = uploadedImageToGeminiFM.mimeType;

        if (!geminiFileUri || !geminiMimeType) {
            return {
                errorMessage: "Failed to upload image to Gemini File Manager.",
                status: 500,
            };
        }

        //gemini-1.5-flash, gemini-2.0-flash
        const model = 'gemini-2.0-flash';

        const config = {
            temperature: 0.4,
            topP: 1,
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                },
            ],
            responseMimeType: 'application/json',
            systemInstruction: [{ text: `${extractNutritionFromImage}` }],
            maxOutputTokens: 200,
        };

        const contents = [
            {
                role: 'user',
                parts: [
                    {
                        fileData: {
                            fileUri: geminiFileUri,
                            mimeType: geminiMimeType,
                        },
                    },
                    {
                        text: `Extract the nutritional information from the attached image and return it as a JSON object.`,
                    },
                ],
            },
        ];

        const MAX_RETRIES = 3;
        let retries = 0;
        let lastError: any = null;

        while (retries < MAX_RETRIES) {
            try {
                const response: GenerateContentResponse = await ai.models.generateContent({
                    model,
                    contents,
                    config,
                });

                if (!response || !response.text) {
                    return { errorMessage: "No response text found", status: 500 };
                }

                const parsedLabelData: ProductNutrientLabelType = response.text ? JSON.parse(response.text) : null;

                return { message: "Image processed successfully", data: parsedLabelData, status: 200 };

            } catch (error: any) {
                lastError = error;
                const { statusCode } = await geminiErrorParsing(error);

                if (statusCode === 500 || statusCode === 503) {
                    retries++;
                    const delayTime = Math.pow(2, retries) * 1000;
                    console.warn(`Gemini API call failed with status ${statusCode}. Retrying in ${delayTime / 1000} seconds... (Attempt ${retries}/${MAX_RETRIES})`);
                    await delay(delayTime);

                } else {
                    console.error("Non-retryable error encountered:", error);
                    return { errorMessage: "Something went wrong!", status: 500 };
                }
            }
        }

        const { errorMessage, statusCode } = await geminiErrorParsing(lastError);
        if (statusCode === 500 || statusCode === 503)
            return { errorMessage: `Please try again later or Switch to another model`, status: statusCode };
        else
            return { errorMessage: `${errorMessage} or switch model`, status: statusCode };

    } catch (error) {
        console.error("Error processing image:", error);
        const { errorMessage, statusCode } = await geminiErrorParsing(error);
        return { errorMessage: `Image processing failed: ${errorMessage}`, status: statusCode || 500 };
    }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const geminiErrorParsing = async (error: any) => {
    let errorMessage = "An unknown error occurred.";
    let statusCode = 500;

    // Check if the error is a ServerError from the Gemini SDK and has a message
    if (error && typeof error.message === 'string') {
        const jsonStartIndex = error.message.indexOf('{');

        if (jsonStartIndex !== -1) {
            const jsonString = error.message.substring(jsonStartIndex);
            try {
                const errorDetails = JSON.parse(jsonString);

                if (errorDetails.error) {
                    statusCode = errorDetails.error.code || 500;
                    errorMessage = errorDetails.error.message || "An unknown error occurred from the model.";
                } else {
                    // If JSON is parsed but doesn't have the expected 'error' structure
                    errorMessage = error.message;
                }
            } catch (parseError) {
                // If parsing the extracted JSON string fails, it means it wasn't valid JSON
                console.error("Failed to parse JSON from error message:", parseError);
                errorMessage = error.message;
            }
        } else {
            // If no JSON object is found in the message, use the whole message
            errorMessage = error.message;
        }
    } else if (error instanceof Error) {
        // Handle generic JavaScript errors (e.g., network errors, etc.)
        errorMessage = error.message;
    } else {
        // Fallback for any other unexpected error types
        errorMessage = String(error);
    }

    return {
        errorMessage,
        statusCode
    }
}