"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";
import { MdHistory, MdPerson } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";
import { googleLogout } from "@react-oauth/google";
import Cookies from "js-cookie";
import Image from "next/image";

interface ProfileProps {
    name?: string;
    picture?: string;
    email?: string;
}

const Profile: React.FC<ProfileProps> = ({ name, picture, email }) => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const handleLogout = () => {
        Cookies.remove("auth_token");
        googleLogout();
        window.location.href = "/";
    };

    const handleMenuClick = () => {
        setIsOpen(false);
    };

    return (
        <div 
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                className="flex items-center justify-between px-2 md:px-3 py-2 font-normal text-white bg-green-500 rounded-md hover:bg-green-600 transition w-full max-w-[800px]"
            >
                <div className="flex items-center space-x-2 overflow-hidden">
                    {picture ? (
                        <Image
                            src={picture || "/default-avatar.png"} 
                            alt="User Avatar"
                            width={24} 
                            height={24}
                            className="rounded-full"
                        />
                    ) : (
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full">
                            <MdPerson className="text-white text-lg" />
                        </div>
                    )}
                    <span className="hidden md:inline whitespace-nowrap overflow-hidden text-ellipsis">{name || "Nama Pengguna"}</span>
                </div>

                <IoIosArrowDown
                    className={`text-white text-lg transition-transform duration-200 flex-shrink-0 ml-1 md:ml-4 lg:ml-8 ${isOpen ? "rotate-180" : "rotate-0"}`}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border z-50 p-4 min-w-[250px] w-full">
                    <div className="p-4 border-b flex items-center space-x-3">
                        {picture ? (
                            <Image
                                src={picture || "/default-avatar.png"} 
                                alt="User Avatar"
                                width={36} 
                                height={36}
                                className="rounded-full"
                            />
                        ) : (
                            <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full">
                                <MdPerson className="text-gray-600 text-lg" />
                            </div>
                        )}
                        <div className="overflow-hidden">
                            <p className="font-medium whitespace-nowrap overflow-hidden text-ellipsis text-black">{name || "Nama Pengguna"}</p>
                            <p className="text-gray-500 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                                {email || "Email Pengguna"}
                            </p>
                        </div>
                    </div>

                    <ul className="py-2">
                        <li>
                            <Link href="/profil" onClick={handleMenuClick}>
                                <span className={`flex items-center px-4 py-2 rounded cursor-pointer transition ${pathname === "/profil" ? "text-green-600" : "text-gray-700 hover:text-green-600 hover:bg-gray-100"}`}>
                                    <MdPerson className={`mr-2 ${pathname === "/profil" ? "text-green-600" : "hover:text-green-600"}`} />
                                    Profil
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/riwayat" onClick={handleMenuClick}>
                                <span className={`flex items-center px-4 py-2 rounded cursor-pointer transition ${pathname === "/riwayat" ? "text-green-600" : "text-gray-700 hover:text-green-600 hover:bg-gray-100"}`}>
                                    <MdHistory className={`mr-2 ${pathname === "/riwayat" ? "text-green-600" : "hover:text-green-600"}`} />
                                    Riwayat
                                </span>
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 rounded">
                                <FaSignOutAlt className="mr-2" />
                                Keluar
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Profile;