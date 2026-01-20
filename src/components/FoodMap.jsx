import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Ensure marker icons render when bundled
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const defaultCenter = [12.9716, 77.5946];
const restaurants = [
  { id: 1, name: "Foodio Burger Hub", lat: 12.9716, lng: 77.5946 },
  { id: 2, name: "Foodio Pizza House", lat: 12.975, lng: 77.609 },
  { id: 3, name: "Foodio Urban Kitchen", lat: 12.9698, lng: 77.634 },
];

const FlyTo = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo(location, 14, { duration: 1.2 });
    }
  }, [location, map]);
  return null;
};

const FoodioMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [geoError, setGeoError] = useState(null);

  const center = useMemo(
    () => userLocation || defaultCenter,
    [userLocation]
  );

  useEffect(() => {
    if (!navigator?.geolocation) {
      setGeoError("Geolocation not available in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.warn("Location access denied; using default area.", err);
        setGeoError("Location blocked. Showing default area.");
      },
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 }
    );
  }, []);

  return (
    <div className="w-full h-full min-h-[320px]">
      {geoError && (
        <div className="mb-2 text-xs text-red-600 text-center">{geoError}</div>
      )}
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom
        className="w-full h-full rounded-2xl overflow-hidden"
        style={{ minHeight: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && <FlyTo location={userLocation} />}

        {userLocation && (
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {restaurants.map((res) => (
          <Marker
            key={res.id}
            position={[res.lat, res.lng]}
            eventHandlers={{ click: () => setSelectedRestaurant(res) }}
          />
        ))}

        {selectedRestaurant && (
          <Popup
            position={[selectedRestaurant.lat, selectedRestaurant.lng]}
            eventHandlers={{
              remove: () => setSelectedRestaurant(null),
            }}
          >
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900">
                {selectedRestaurant.name}
              </h4>
              <button className="px-3 py-1 bg-red-500 text-white rounded-lg">
                View Details
              </button>
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  );
};

export default FoodioMap;
