"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function ContactMap() {
  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden">
      <MapContainer
        center={[20.2961, 85.8245]}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[20.2961, 85.8245]}>
          <Popup className='text-black'>
            IIT Dholakpur Campus
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}