import WasteManagementMap from "@/components/Peta";

export default function PetaPage() {
    return (
        <div className="bg-white rounded-lg shadow p-4 min-h-screen">
            {/* Using our reusable component */}
                <WasteManagementMap 
                height="420px"
                showCategoryFilter={true}
                initialCategory="TPA"
            />
        </div>
    );
}