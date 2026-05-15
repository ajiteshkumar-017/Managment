"use client";

import { useEffect, useState } from "react";

export default function ContactMap() {
  const [MapComponents, setMapComponents] = useState<any>(null);

  // 1. Only load Leaflet inside useEffect so the server completely ignores it
  useEffect(() => {
    import("react-leaflet").then((mod) => {
      // Also dynamically load the Leaflet CSS so the icons don't break
      import("leaflet/dist/leaflet.css");
      setMapComponents(mod);
    });
  }, []);

  // 2. While loading on the server or initial client tick, show a fallback layout
  if (!MapComponents) {
    return (
      <div className="w-full h-[400px] rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 animate-pulse">
        Loading Campus Map...
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden">
      <MapContainer
        center={[20.2961, 85.8245]}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[20.2961, 85.8245]}>
          <Popup className="text-black">IIT Dholakpur Campus</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
