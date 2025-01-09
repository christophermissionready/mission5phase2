import { React, useState } from "react";
import "./Service.css"; 
import Map from "./Map";

const Service = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    fuel: [],
    services: [],
    stationType: [],
    sortBy: "Nearest",
  });

  const [filteredStations, setFilteredStations] = useState([]);

  const handleButtonClick = (category, value) => {
    setSelectedFilters((prev) => {
      const updatedCategory = prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value];
      return { ...prev, [category]: updatedCategory };
    });
  };

  const handleSortByChange = (value) => {
    setSelectedFilters((prev) => ({ ...prev, sortBy: value }));
  };

  const handleSubmit = async () => {
    const filters = {
      fuels: selectedFilters.fuel,
      services: selectedFilters.services,
      stationType: selectedFilters.stationType,
      sortBy: selectedFilters.sortBy,
    };

    console.log("Submitting filters:", filters);

    try {
      const response = await fetch(
        "http://localhost:5000/api/filter-stations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filters),
        }
      );

      if (response.ok) {
        const stations = await response.json();
        setFilteredStations(stations);
      } else {
        const error = await response.json();
        console.error("Failed to fetch filtered stations:", error);
      }
    } catch (error) {
      console.error("Error submitting filters:", error);
    }
  };

  const handleResetFilters = () => {
    setSelectedFilters({
      fuel: [],
      services: [],
      stationType: [],
      sortBy: "",
    });
    setFilteredStations([]);
  };
  // handleSubmit();
  console.log(filteredStations)
  return (
    <>
    
      <div className="filter-section">
        <div className="filter-category">Select Fuel</div>
        <div className="button-group">
          {["ZX Premium", "Z91 Unleaded", "Z Diesel"].map((fuel) => (
            <button
              key={fuel}
              onClick={() => handleButtonClick("fuel", fuel)}
              className={`filter-button ${
                selectedFilters.fuel.includes(fuel) ? "active" : ""
              }`}
            >
              {fuel}
            </button>
          ))}
        </div>

        <div className="filter-category">Select Services</div>
        <div className="button-group">
          {[
            "Z2O carwash",
            "Trailer hire",
            "LPG SWAP'n'GO",
            "AdBlue Diesel Exhaust Fluid",
            "Tyre Pressure",
            "Z Espress Coffee & Fresh Food",
          ].map((service, index) => (
            <button
              key={service}
              onClick={() => handleButtonClick("services", service)}
              className={`filter-button ${
                selectedFilters.services.includes(service) ? "active" : ""
              }`}
              style={{ gridColumn: index % 2 === 0 ? 1 : 2 }}
            >
              {service}
            </button>
          ))}
        </div>
        <div className="button-group">
          {[
            "Pay in app",
            "Pay at pump",
            "Pay by plate",
            "ATM",
            "Bathrooms",
            "EV Charging",
          ].map((service, index) => (
            <button
              key={service}
              onClick={() => handleButtonClick("services", service)}
              className={`filter-button ${
                selectedFilters.services.includes(service) ? "active" : ""
              }`}
              style={{ gridColumn: index % 2 === 0 ? 1 : 2 }}
            >
              {service}
            </button>
          ))}
        </div>
        <div className="bottom-row">
          <div style={{ display: "flex", flexDirection: "column" , marginRight: "400px"}}>
            <div className="filter-category">Select Station Type</div>
            <div className="button-group">
              {["Service station", "Truck stop"].map((type) => (
                <button
                  key={type}
                  onClick={() => handleButtonClick("stationType", type)}
                  className={`filter-button ${
                    selectedFilters.stationType.includes(type) ? "active" : ""
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div><div className="filter-category">Sort by</div>
          <div className="button-group">
            {["Nearest", "Cheapest", "Economical"].map((sortOption) => (
              <button
                key={sortOption}
                onClick={() => handleSortByChange(sortOption)}
                className={`filter-button ${
                  selectedFilters.sortBy === sortOption ? "active" : ""
                }`}
              >
                {sortOption}
              </button>
            ))}
          </div></div>
          
        </div>

        <div className="button-group">
          <button className="reset-button" onClick={handleResetFilters}>
            Reset Filters
          </button>
          <button className="apply-button" onClick={handleSubmit}>
            Apply Filters
          </button>
        </div>
      </div>

      <div > 
        <h2>Filtered Stations</h2>
        <div style={{ display: "flex", flexDirection: "row" }}>{filteredStations.length > 0 ? (
          <ul className="station-list">
            {filteredStations.map((station) => (
              <li key={station.uuid}>
                <h3>{station.name} ({station.type})</h3>
                <p>{station.location.address}, {station.location.city}</p>
                <p>Fuels: {station.fuels.map(fuel => fuel.name).join(", ")}</p>
                <p>Services: {station.services.map(service => service.name).join(", ")}</p>
                <p>Distance: {station.distance_from_user}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No stations match your filters.</p>
        )}<Map stations={filteredStations}/>
      </div></div>
        
    </>
  );
};

export default Service;
