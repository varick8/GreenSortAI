"use client";

import Hero from "@/components/Hero";
import Perpustakaan from "@/components/Perpustakaan";
import WasteManagementMap from "@/components/PetaHome";

export default function Dashboard() {
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     setTimeout(() => setLoading(false), 1000);
    // }, []);

    // if (loading) return <Loading />;

    return (
        <>
        <div className="bg-blue-100">
                <Hero />
            </div>
            <div className="bg-gray-200">
            <Perpustakaan />
            </div>
            <div className="text-center p-4 mt-2">
            <h1 className="text-3xl font-bold text-black">Peta Lokasi Persampahan</h1>                
            <div className="rounded-lg shadow p-4">
                    {/* Using our reusable component */}
                    <WasteManagementMap 
                        height="480px"
                        showCategoryFilter={false}
                        initialCategory="TPA"
                    />
                </div>
            </div>
        </>
    );
}