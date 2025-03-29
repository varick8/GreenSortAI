"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaMapMarkedAlt, FaBook, FaTrashRestore, FaUser } from "react-icons/fa";
import Link from "next/link";
import { parse } from "cookie";
import { jwtDecode } from "jwt-decode";
import LoginModal from "../auth/LoginModal";

// Define User type for JWT decoding
interface User {
    name?: string;
    picture?: string;
    email?: string;
}

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const initializeUser = async () => {
            try {
                const cookies = document.cookie;
                const parsedCookies = parse(cookies);
                const token = parsedCookies.auth_token;

                if (token) {
                    const decodedToken = jwtDecode(token) as User;
                    setUser({
                        name: decodedToken.name,
                        picture: decodedToken.picture,
                        email: decodedToken.email,
                    });
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error initializing user:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeUser();
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);
    const toggleLogin = () => setIsLoginOpen(!isLoginOpen);
    const closeLogin = () => setIsLoginOpen(false);

    return (
        <div 
            className="relative md:flex lg:hidden"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Three-bar (☰) button */}
            <button className="text-2xl text-gray-700 focus:outline-none" onClick={toggleMenu}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-12 right-0 bg-white shadow-md rounded-md w-48">
                    <ul className="flex flex-col space-y-1 p-2">
                        <li>
                            <Link 
                                href="/scan-sampah" 
                                className={`flex items-center space-x-2 px-4 py-2 rounded-md group transition-colors ${
                                    pathname === "/scan-sampah" ? "text-green-500" : "text-gray-700 hover:bg-gray-100 hover:text-green-500"
                                }`}
                                onClick={closeMenu}
                            >
                                <FaTrashRestore className="text-gray-400 group-hover:text-green-500" />
                                <span>Scan Sampah</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/peta" 
                                className={`flex items-center space-x-2 px-4 py-2 rounded-md group transition-colors ${
                                    pathname === "/peta" ? "text-green-500" : "text-gray-700 hover:bg-gray-100 hover:text-green-500"
                                }`}
                                onClick={closeMenu}
                            >
                                <FaMapMarkedAlt className="text-gray-400 group-hover:text-blue-500" />
                                <span>Peta</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/perpustakaan" 
                                className={`flex items-center space-x-2 px-4 py-2 rounded-md group transition-colors ${
                                    pathname === "/perpustakaan" ? "text-green-500" : "text-gray-700 hover:bg-gray-100 hover:text-green-500"
                                }`}
                                onClick={closeMenu}
                            >
                                <FaBook className="text-gray-400 group-hover:text-orange-500" />
                                <span>Perpustakaan</span>
                            </Link>
                        </li>

                        {/* Masuk (Login) Section */}
                        <li className="border-t pt-2 sm:flex md:hidden">
                        {!isLoading && user ? null : (
                            <button
                                className="flex items-center space-x-2 px-4 py-2 w-full text-left font-normal text-white bg-green-500 rounded-md hover:bg-green-600 transition"
                                onClick={toggleLogin}
                            >
                                <FaUser className="text-white text-lg" />
                                <span>Masuk</span>
                            </button>
                        )}
                    </li>
                    </ul>
                </div>
            )}

            <LoginModal isOpen={isLoginOpen} closeModal={closeLogin} />
        </div>
    );
};

export default HamburgerMenu;
