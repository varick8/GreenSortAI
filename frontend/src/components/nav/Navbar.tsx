"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Container from "../Container";
import NavLink from "./Navlink";
import { FaUser } from "react-icons/fa";
import LoginModal from "../auth/LoginModal";
import Profile from "./Profile";
import { parse } from "cookie";
import { jwtDecode } from "jwt-decode"; 
import HamburgerMenu from "./Hamburger";

// Define a custom interface for the decoded token
interface User {
    name?: string;
    picture?: string;
    email?: string;
}

const Navbar = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null); // Use the User type

    const toggleLogin = () => setIsLoginOpen(!isLoginOpen);
    const closeLogin = () => setIsLoginOpen(false);

    useEffect(() => {
        const initializeUser = async () => {
            try {
                const cookies = document.cookie;
                const parsedCookies = parse(cookies);
                const token = parsedCookies.auth_token;

                if (token) {
                    const decodedToken = jwtDecode(token) as User; // Cast it to our custom User type
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

    return (
        <div className="sticky top-0 w-full bg-white z-30 shadow-sm">
            <div className="py-4 border-b-[1px]">
                <Container>
                    <div className="flex items-center justify-between gap-3 md:gap-0">
                        <div className="flex items-center gap-8 md:gap-12">
                            <div className="items-center space-x-2">
                                <Link href="/" className="flex items-center space-x-2">
                                    <img src={"/recycle.svg"} alt="logo" width={30} height={30} />
                                    <div className="font-semibold text-black">GreenSortAI</div>
                                </Link>
                            </div>
                            <div className="hidden lg:flex items-center gap-8 md:gap-12">
                                <NavLink href="/scan-sampah">Scan Sampah</NavLink>
                                <NavLink href="/peta">Peta</NavLink>
                                <NavLink href="/perpustakaan">Perpustakaan</NavLink>
                            </div>
                        </div>

                        {/* Profile or Login Button (Hidden on tablets and smaller) */}
                        <div className="flex items-center gap-4 md:gap-6">
                            {!isLoading && user ? (
                                <Profile name={user.name} picture={user.picture} email={user.email} />
                            ) : (
                                <button
                                    className="hidden md:flex items-center space-x-2 px-4 py-2 font-normal text-white bg-green-500 rounded-md hover:bg-green-600 transition"
                                    onClick={toggleLogin}
                                >
                                    <FaUser className="text-white text-lg" />
                                    <span>Mulai</span>
                                </button>
                            )}

                            <HamburgerMenu />
                        </div>
                    </div>
                </Container>
            </div>
            <LoginModal isOpen={isLoginOpen} closeModal={closeLogin} />
        </div>
    );
};

export default Navbar;
