const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "service_stations";

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

// Calculate Distance Function
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Filter Stations Route
app.post("/api/filter-stations", async (req, res) => {
  try {
    const { fuels, services, stationType, sortBy } = req.body;

    const db = client.db(dbName);
    const collection = db.collection("distances");

    const query = {};

    // Apply fuel filter to query
    if (fuels && fuels.length > 0) {
      query["fuels.name"] = { $in: fuels };
    }

    // Apply services filter to query
    if (services && services.length > 0) {
      query.$and = services.map((service) => ({
        "services.name": { $regex: new RegExp(service, "i") },
      }));
    }

    // Apply stationType filter to query
    if (stationType && stationType.length > 0) {
      query["type"] = { $in: stationType };
    }

    // Fetch matching stations
    const stations = await collection.find(query).toArray();


    if (sortBy) {
        if (sortBy === "Nearest") {
          stations.sort((a, b) => a.distance_from_user - b.distance_from_user);
        } else if (sortBy === "Cheapest") {
          stations.sort((a, b) => {
            const minPriceA = Math.min(...Object.values(a.pricing).map(Number));
            const minPriceB = Math.min(...Object.values(b.pricing).map(Number));
            return minPriceA - minPriceB;
          });
        }
        else if (sortBy === "Economical") {
          stations.sort((a, b) => {
            const minPricePerDistanceA =
              Math.min(...Object.values(a.pricing).map(Number)) /
              a.distance_from_user;
            const minPricePerDistanceB =
              Math.min(...Object.values(b.pricing).map(Number)) /
              b.distance_from_user;
            return minPricePerDistanceA - minPricePerDistanceB;
          });
        }
    else {
        stations.sort((a, b) => a.distance_from_user - b.distance_from_user);
    }}
      

    res.status(200).json(stations.slice(0, 10));
  } catch (err) {
    console.error("Error filtering stations:", err);
    res.status(500).json({ error: "Failed to filter stations" });
  }
});

// Calculate Distances Route
app.post("/api/calculate-distances", async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).send("Latitude and longitude are required.");
  }

  try {
    const db = client.db(dbName);
    const locationsCollection = db.collection("stations");
    const distancesCollection = db.collection("distances");

    // Fetch locations from MongoDB
    const locations = await locationsCollection.find().toArray();

    // Check if locations are found
    if (locations.length === 0) {
      return res.status(404).send("No locations found in the database.");
    }

    // Calculate distance for each location
    const distanceDocs = locations.map((location) => {
      const [stationLongitude, stationLatitude] = location.location.coordinates;

      // Calculate the distance between the user's location and the station's location
      const distance = calculateDistance(
        latitude,
        longitude,
        stationLatitude,
        stationLongitude
      );

      if (distance > 0) {
        return {
          ...location,
          distance_from_user: distance,
        };
      }
    }).filter(Boolean);

    // Check if we have any valid distance data to insert
    if (distanceDocs.length === 0) {
      return res.status(400).send("No valid distances to insert.");
    }

    // Clear any previous distance data and insert new
    await distancesCollection.deleteMany({});
    await distancesCollection.insertMany(distanceDocs);

    // Send the distances back to the frontend
    return res.status(200).json(distanceDocs);
  } catch (err) {
    console.error("Error calculating distances:", err);
    res.status(500).json({ error: "Failed to calculate distances" });
  }
});

// Get Distances Route
app.get("/api/distances", async (req, res) => {
  try {
    const db = client.db(dbName);
    const distancesCollection = db.collection("distances");

    // Fetch distances from MongoDB
    const distances = await distancesCollection.find().toArray();

    // Check if distances are found
    if (distances.length === 0) {
      return res.status(404).send("No distances found in the database.");
    }

    // Send the distances back to the frontend
    distances.sort((a, b) => a.distance_from_user - b.distance_from_user);
// console.log(distances)
    res.status(200).json(distances);
  } catch (err) {
    console.error("Error fetching distances:", err);
    res.status(500).json({ error: "Failed to fetch distances" });
  }
});



// Start the Server
const PORT = 5000;
app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Server running on port ${PORT}`);
});

