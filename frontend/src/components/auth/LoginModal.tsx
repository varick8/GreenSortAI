import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";

interface LoginModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, closeModal }) => {
    const login = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            console.log("codeResponse", codeResponse);
            try {
                const tokenResponse = await axios.get(
                    `https://greensortai.up.railway.app/api/auth/google/callback?code=${codeResponse.code}`
                );
                
                console.log("tokenResponse", tokenResponse.data);

                Cookies.set("auth_token", tokenResponse.data.token, { 
                    expires: 7,
                    path: "/",
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                });

                window.location.href = "/";
            } catch (error) {
                console.error("Error fetching token:", error);
            }
        },
        flow: "auth-code",
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 w-full h-full z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="bg-white rounded-lg shadow-lg p-12 w-full max-w-[500px] h-[350px] text-center relative flex flex-col justify-center"
                    >
                        <button 
                            onClick={closeModal} 
                            className="absolute top-6 right-6 text-gray-700 hover:text-gray-900"
                        >
                            <IoClose size={32} />
                        </button>

                        {/* Logo + Title */}
                        <div className="flex items-center justify-center mb-4">
                            <Image src="/recycle.svg" alt="logo" width={40} height={40} className="mr-3" />
                            <h1 className="text-4xl font-bold text-black">GreenSortAI</h1>
                        </div>

                        <h2 className="font-semibold mb-8 text-green-600">
                            Teknologi AI Untuk Daur Ulang yang Lebih Baik
                        </h2>

                        {/* Google Login Button */}
                        <button 
                            onClick={() => login()}
                            className="flex items-center justify-center w-[90%] py-4 mx-auto text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                        >
                            <Image 
                                src="https://img.icons8.com/fluency/48/google-logo.png" 
                                alt="Google Logo" 
                                width={28} 
                                height={28} 
                                className="mr-3"
                            />
                            <span className="text-lg font-medium">Log In with Google</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LoginModal;
