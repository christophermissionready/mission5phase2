import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';



const Map = ({ stations }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const validStations = stations.filter(station => station.location?.coordinates?.length === 2);
  const markersfromstation = validStations.map((station) => {
    const [longitude, latitude] = station.location.coordinates;
    return <><Marker key={station._id} position={{ lat: latitude, lng: longitude }}/></>  ;
  });
  

  
  const fetchUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            
          });
          setLoading(false);
          
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          setUserLocation({ lat: -36.8509, lng: 174.7633 });
          setLoading(false);
        }
      );
    } else {
      setUserLocation({ lat: -36.8509, lng: 174.7633 });
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserLocation();
  }, [fetchUserLocation]);

  if (loading) {
    return <div>Loading user location...</div>;
  }

  if (!stations || stations.length === 0) {
    return <div>No stations available</div>;
  }

  const markers = stations.map((station) => {
    const { coordinates } = station.location;

    if (!coordinates || coordinates.length < 2) {
      console.warn(`Invalid location data for station: ${station._id}`);
      return null;
    }

    const [longitude, latitude] = coordinates;

    return (<><Marker
        key={station.name}
        position={{ lat: userLocation.lat, lng: userLocation.lng }}
        icon={{
          url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
        //   scaledSize: new window.google.maps.Size(24, 24),
        }}

      />
      <Marker
        key={station._id}
        position={{ lat: latitude, lng: longitude}}
    /></>
      
    );
  });

  return (
    <LoadScript googleMapsApiKey="AIzaSyABrB-tUS7aJqbPjHTLZVC6PLc0q5mS2lQ">
      <GoogleMap
        center={userLocation}
        zoom={12}
        mapContainerStyle={{ width: '100%', height: '100vh' }}
      >
        {markers}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
