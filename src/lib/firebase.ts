import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Replace these with your actual Firebase project configuration
// Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

/**
 * Sets up the Recaptcha verifier for phone authentication
 */
export const setupRecaptcha = (elementId: string) => {
    if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
            'size': 'invisible',
            'callback': () => {
                // reCAPTCHA solved
            }
        });
    }
    return (window as any).recaptchaVerifier;
};

/**
 * Sends OTP to the provided phone number
 */
export const sendOtp = async (phoneNumber: string, verifier: RecaptchaVerifier) => {
    try {
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
        return confirmationResult;
    } catch (error) {
        console.error("Error sending OTP:", error);
        throw error;
    }
};
