import Link from "next/link";
import Container from "../Container";
import NavLink from "./Navlink";

const Navbar = async () => {

    return (
        <div className="sticky top-0 w-full bg-white z-30 shadow-sm">
            <div className="py-4 border-b-[1px]">
                <Container>
                    <div className="flex items-center justify-between gap-3 md:gap-0">
                        <div className="flex items-center gap-8 md:gap-12">
                        <div className="hidden md:flex items-center space-x-2">
                            <Link href="/" className="flex items-center space-x-2">
                                <img src={'/recycle.svg'} alt="logo" width={30} height={30} />
                                <div className="font-semibold">GreenSortAI</div>
                            </Link>
                        </div>
                                    <NavLink href="/scan-sampah">Scan Sampah</NavLink>
                                    <NavLink href="/peta">Peta</NavLink>
                                    <NavLink href="/perpustakaan">Perpustakaan</NavLink>
                        </div>
                        <div className="flex items-center">
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default Navbar;