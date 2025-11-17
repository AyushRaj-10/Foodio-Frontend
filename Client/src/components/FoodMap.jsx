import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Auto-move map to user location
const MoveToUser = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo(location, 14);
    }
  }, [location]);
  return null;
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

const FoodioMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // Example restaurant data
  const restaurants = [
    { id: 1, name: "Foodio Burger Hub", lat: 12.9716, lng: 77.5946 },
    { id: 2, name: "Foodio Pizza House", lat: 12.975, lng: 77.609 },
    { id: 3, name: "Foodio Urban Kitchen", lat: 12.9698, lng: 77.634 },
  ];

  // Get user current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert("Enable location to see nearby restaurants.")
    );
  }, []);

  return (
    <MapContainer
      center={userLocation || [12.9716, 77.5946]}
      zoom={13}
      style={containerStyle}
      scrollWheelZoom={true}
    >
      {/* OpenStreetMap tiles */}
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Move map to user when detected */}
      {userLocation && <MoveToUser location={userLocation} />}

      {/* User marker */}
      {userLocation && (
        <Marker position={userLocation}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {/* Restaurant markers */}
      {restaurants.map((res) => (
        <Marker
          key={res.id}
          position={[res.lat, res.lng]}
          eventHandlers={{
            click: () => setSelectedRestaurant(res),
          }}
        />
      ))}

      {/* Restaurant popup */}
      {selectedRestaurant && (
        <Popup
          position={[selectedRestaurant.lat, selectedRestaurant.lng]}
          onClose={() => setSelectedRestaurant(null)}
        >
          <div>
            <h4 className="font-bold">{selectedRestaurant.name}</h4>
            <button className="mt-2 px-3 py-1 bg-red-500 text-white rounded-lg">
              View Details
            </button>
          </div>
        </Popup>
      )}
    </MapContainer>
  );
};

export default FoodioMap;
