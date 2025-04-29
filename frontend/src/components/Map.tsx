"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import Loading from "./Loading";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";
// Import MarkerCluster CSS directly from the leaflet.markercluster package
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

type MarkerData = {
    lat: number;
    lng: number;
    name: string;
};

type MapProps = {
    selectedCategory: string;
    data: MarkerData[];
};

export default function Map({ selectedCategory, data }: MapProps) {
    // Create the marker icon
    const [icon, setIcon] = useState<L.Icon | null>(null);

    useEffect(() => {
        // Initialize the icon in a useEffect to ensure it runs only on the client
        const leafletIcon = new L.Icon({
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        });
        setIcon(leafletIcon);
    }, []);

    if (!icon) {
        return <Loading />; // Show loading until the icon is ready
    }

    return (
        <MapContainer
            center={[-7.782746984562106, 110.38382844330042]} // Center Indonesia
            zoom={9}
            style={{ height: "100%", width: "100%", borderRadius: "0.5rem", overflow: "hidden", zIndex: 10 }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <MarkerClusterGroup>
                {data.map((loc: MarkerData, i: number) => (
                    <Marker key={i} position={[loc.lat, loc.lng]} icon={icon}>
                        <Popup>{loc.name}</Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    );
}