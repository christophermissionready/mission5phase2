# Auction Items Seeder for MongoDB

A Node.js command-line utility for seeding auction items data into a MongoDB collection.

- ChatGPT 4o - [Conversation to create this CLI tool](https://chatgpt.com/share/675cc88b-c900-800d-89c7-2b853101666a)

# MongoDB Auction Seeder Documentation

This documentation provides an overview of the project structure, setup instructions, and usage guidelines for the CLI tool that seeds sample auction data into a MongoDB instance.

---

## Folder Structure

```
project-root/
├── docker-compose.yml                  # Docker configuration for MongoDB
├── mongo-init.js                       # Initialization script for MongoDB (user, database, collection setup)
├── seed.js                             # CLI tool for seeding auction data
├── ../../datasets/auction_items.json   # Sample data for seeding
├── .env                                # Environment variables configuration
├── .gitignore                          # Git ignore file
└── package.json                        # Project metadata and dependencies
```

---

## Project Setup

1. **Install Dependencies**:
   Run the following command to install the required Node.js dependencies:

   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the project root with the following variables:

   ```plaintext
   MONGO_URI=mongodb://localhost:27017
   MONGO_USERNAME=admin
   MONGO_PASSWORD=password
   MONGO_PORT=27017
   DB_NAME=auction
   COLLECTION_NAME=items
   ```

   - **MONGO_URI**: (Optional) Full MongoDB connection string.
   - **MONGO_USERNAME**: MongoDB username for authentication.
   - **MONGO_PASSWORD**: MongoDB password for authentication.
   - **MONGO_PORT**: MongoDB port.
   - **DB_NAME**: Name of the database to use.
   - **COLLECTION_NAME**: Name of the collection to seed data into.

3. **.gitignore**:
   Ensure your `.env` file and `node_modules` folder are excluded by including them in the `.gitignore` file.

   ```plaintext
   .env
   node_modules/
   ```

---

## Starting Up MongoDB

Start the MongoDB instance using Docker Compose. Ensure Docker is installed and running on your machine.

Run the following command:

```bash
docker-compose up -d
```

- **Flags**:
  - `-d`: Run containers in detached mode.

This command starts MongoDB with the configuration specified in `docker-compose.yml`.

---

## Using the CLI Tool to Seed the Database

1. **Prepare Data**:
   Ensure the `auction_items.json` file contains valid auction data.

2. **Run the CLI Tool**:
   Use the following command to seed data into the database:

   ```bash
   node seed.js --file path/to/auction_items.json
   ```
   or

   ```bash
   [MacOS/Linux]
   chmod +x seed.js
   ./seed.js -f path/to/auction_items.json

   ```

3. **Options**:
   - `--file`: Path to the JSON file containing the auction data. Defaults to `auction_items.json` in the project root.

Example:

```bash
node seed.js --file ../../datasets/auction_items.json
```

4. **Authentication**:
   The CLI tool uses the username and password from the `.env` file to authenticate with MongoDB.

---

## CLI Tool Options

The `seed.js` CLI tool supports the following options:

| Option              | Alias | Description                                           | Default               |
|---------------------|-------|-------------------------------------------------------|-----------------------|
| `--file <path>`     | `-f`  | Path to the JSON file containing auction data         | `auction_items.json`  |
| `--version`         | `-v`  | Display the version of the CLI tool                   |                       |
| `--help`            | `-h`  | Show help information for using the CLI tool          |                       |

---

## Environment Variables and `.env`

The application uses the following environment variables, which can be configured in the `.env` file:

| Variable          | Description                                     | Default Value |
|-------------------|-------------------------------------------------|---------------|
| `MONGO_URI`       | Full MongoDB connection string (optional)       |               |
| `MONGO_USERNAME`  | MongoDB username                                | `admin`       |
| `MONGO_PASSWORD`  | MongoDB password                                | `password`    |
| `DB_NAME`         | Database name                                   | `auction`     |
| `COLLECTION_NAME` | Collection name                                 | `items`       |

Ensure your `.env` file is secure and excluded from version control by listing it in `.gitignore`.

---

## Notes

- The `mongo-init.js` script initializes the database, user, and collection but does not seed data.
- Use the `seed.js` CLI tool to insert data into MongoDB.
- If you encounter any issues, check the logs for both the CLI tool and the MongoDB container.
