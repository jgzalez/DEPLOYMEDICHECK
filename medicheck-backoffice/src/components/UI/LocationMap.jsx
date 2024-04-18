import {
  GoogleMap,
  useLoadScript,
  Marker,
  LoadScript,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useRef, useState } from "react";
import { PlacesAutoComplete } from "./PlacesAutoComplete";

const libraries = ["places"];
const mapContainerStyle = {
  width: '100%',
  height: '50vh',
};
const center = {
  lat: 18.50012, // default latitude
  lng: -69.98857,
};
export const LocationMap = ({ onLocation, defaultLocation }) => {
  // const [lat, setLat] = useState(null);
  // const [lng, setLng] = useState(null);
  const [marker, setMarker] = useState(null);
  // const mapRef = useRef(null);
  const [selected, setSelected] = useState(null);

  // const handleMapLoad = (map) => {
  //   mapRef.current = map;
  // };

  // const handleClick = (event) => {
  //   const newLat = event.latLng.lat();
  //   console.log(newLat);
  //   const newLng = event.latLng.lng();
  //   setLat(newLat);
  //   setLng(newLng);
  //   onLocation({ lat: newLat, lng: newLng });
  //   setMarker({ lat: newLat, lng: newLng });
  // };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBZhZ6lEhD-rSWFWYu1SiADWZqBQP0Ea9Q",
    libraries,
  });

 console.log(defaultLocation)
  return (
    <div className="relative">
      {isLoaded && (<div>
       <div>
        <PlacesAutoComplete setSelected={setSelected} onLocation={onLocation} />
       </div>
        <GoogleMap
          mapContainerClassName="relative"
          mapContainerStyle={mapContainerStyle}
          zoom={40}
          center={selected || { lat:defaultLocation?.lat, lng:defaultLocation?.lng}}
          // onClick={handleClick}
          // onLoad={handleMapLoad}
        >
          {(selected|| defaultLocation )&& <Marker position={selected ||{ lat:defaultLocation?.lat, lng:defaultLocation?.lng}}/>}
        </GoogleMap>
        </div>
      )}
    </div>
  );
};
