import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Replace these with your actual Firebase project configuration
// Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
    apiKey: "AIzaSyDaAeoVhJw8h_Xdwdkf5y0AjBbczGlVthM",
    authDomain: "zero-487916.firebaseapp.com",
    projectId: "zero-487916",
    storageBucket: "zero-487916.firebasestorage.app",
    messagingSenderId: "873932774483",
    appId: "1:873932774483:web:cd5830a96be4a25869baa6",
    measurementId: "G-8B0WRQ7FWC"
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
