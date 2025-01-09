import {React, useState} from 'react'
import { Loader } from "@googlemaps/js-api-loader";
import './Searchbar.css'
import Distance from './Distance.jsx'
import Fuel from './Fuel.jsx'
import Service from './Service.jsx'
import Map from './Map.jsx'
import { useEffect } from 'react';


const Searchbar = () => {
  const [activeFilter, setActiveFilter] = useState('service'); 


// Get users location on button press
const getUserLocation = async () => {
  if (!navigator.geolocation) {
      return;
  }

  navigator.geolocation.getCurrentPosition(
      async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log({latitude, longitude});

          try {
              const response = await fetch('http://localhost:5000/api/calculate-distances', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ latitude, longitude }),
              });

              if (response.ok) {
                  const data = await response.json();  // assuming your backend returns JSON data
                  console.log('Distances calculated:', data);
                  // Process the data here (e.g., update the state to display results)
              } else {
                  console.error('Failed to calculate distances:', response.statusText);
              }
          } catch (error) {
              console.error('Error:', error);
          }
      },
      () => {
          console.log('Unable to retrieve your location.');
      }
  );
};



  return (<>
    <div className="searchbar-container">
      <div className="find-station">Find a station</div>
      <input
        className="searchbar"
        type="text"
        placeholder="Please enter a location / Station / Truck Stop / Airtop"
      />
      <button className="use-current-location" onClick={getUserLocation}>
        Use current location
      </button>
      <div className="filter-by">
        <button
          className={`filter-by-service ${
            activeFilter === 'service' ? 'active' : ''
          }`}
          onClick={() => setActiveFilter('service')}
        >
          Filter by service
        </button>
        <button
          className={`filter-by-price ${
            activeFilter === 'price' ? 'active' : ''
          }`}
          onClick={() => setActiveFilter('price')}
        >
          Filter by price
        </button>
        <button
          className={`filter-by-distance ${
            activeFilter === 'distance' ? 'active' : ''
          }`}
          onClick={() => setActiveFilter('distance')}
        >
          Filter by distance
        </button>
      </div>
      
    </div><div className="filterContent">
        {activeFilter === 'service' && <div><Service /></div>}
        {activeFilter === 'price' && <div><Service /></div>}
        {activeFilter === 'distance' && <div><Service/> </div>}
      </div>
    </>
  );
};

export default Searchbar;

