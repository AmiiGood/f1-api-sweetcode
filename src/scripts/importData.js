const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const mongoose = require("mongoose");
require("dotenv").config();

const Driver = require("../models/Driver");
const Race = require("../models/Race");
const Circuit = require("../models/Circuit");
const Result = require("../models/Result");

// Configuración de Mongoose
mongoose.set("strictQuery", false);

// Función para conectar a MongoDB
async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;
    console.log("Attempting to connect to MongoDB with URI:", uri);

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

// Función para parsear CSV
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      reject(new Error(`File not found: ${filePath}`));
      return;
    }

    const results = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, skip_empty_lines: true }))
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
};

// Importar circuitos
async function importCircuits(dataPath) {
  try {
    console.log("Importing circuits...");
    const circuitsData = await parseCSV(path.join(dataPath, "circuits.csv"));

    for (const circuit of circuitsData) {
      await Circuit.findOneAndUpdate(
        { circuitId: circuit.circuitId },
        {
          circuitId: circuit.circuitId,
          circuitRef: circuit.circuitRef,
          name: circuit.name,
          location: circuit.location,
          country: circuit.country,
          lat: parseFloat(circuit.lat) || 0,
          lng: parseFloat(circuit.lng) || 0,
          alt: parseInt(circuit.alt) || 0,
        },
        { upsert: true, new: true }
      );
    }
    console.log(`Imported ${circuitsData.length} circuits`);
  } catch (error) {
    throw new Error(`Error importing circuits: ${error.message}`);
  }
}

// Importar pilotos
async function importDrivers(dataPath) {
  try {
    console.log("Importing drivers...");
    const driversData = await parseCSV(path.join(dataPath, "drivers.csv"));

    for (const driver of driversData) {
      await Driver.findOneAndUpdate(
        { driverId: driver.driverId },
        {
          driverId: driver.driverId,
          driverRef: driver.driverRef,
          number: driver.number ? parseInt(driver.number) : null,
          code: driver.code,
          forename: driver.forename,
          surname: driver.surname,
          dob: new Date(driver.dob),
          nationality: driver.nationality,
          url: driver.url,
        },
        { upsert: true, new: true }
      );
    }
    console.log(`Imported ${driversData.length} drivers`);
  } catch (error) {
    throw new Error(`Error importing drivers: ${error.message}`);
  }
}

// Importar carreras
async function importRaces(dataPath) {
  try {
    console.log("Importing races...");
    const racesData = await parseCSV(path.join(dataPath, "races.csv"));

    for (const race of racesData) {
      await Race.findOneAndUpdate(
        { raceId: race.raceId },
        {
          raceId: race.raceId,
          year: parseInt(race.year),
          round: parseInt(race.round),
          circuitId: race.circuitId,
          name: race.name,
          date: new Date(race.date),
          time: race.time || null,
        },
        { upsert: true, new: true }
      );
    }
    console.log(`Imported ${racesData.length} races`);
  } catch (error) {
    throw new Error(`Error importing races: ${error.message}`);
  }
}

// Importar resultados
async function importResults(dataPath) {
  try {
    console.log("Importing results...");
    const resultsData = await parseCSV(path.join(dataPath, "results.csv"));

    for (const result of resultsData) {
      await Result.findOneAndUpdate(
        { resultId: result.resultId },
        {
          resultId: result.resultId,
          raceId: result.raceId,
          driverId: result.driverId,
          position: result.position ? parseInt(result.position) : null,
          points: parseFloat(result.points) || 0,
          grid: parseInt(result.grid) || 0,
          laps: parseInt(result.laps) || 0,
          time: result.time,
          fastestLap: result.fastestLap ? parseInt(result.fastestLap) : null,
          fastestLapTime: result.fastestLapTime,
        },
        { upsert: true, new: true }
      );
    }
    console.log(`Imported ${resultsData.length} results`);
  } catch (error) {
    throw new Error(`Error importing results: ${error.message}`);
  }
}

// Función principal
async function importAllData() {
  try {
    console.log("Starting data import process...");

    // Conectar a la base de datos
    await connectDB();

    // Verificar que los archivos existan
    const dataPath = path.join(__dirname, "../../data");
    const requiredFiles = [
      "circuits.csv",
      "drivers.csv",
      "races.csv",
      "results.csv",
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(dataPath, file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Required file ${file} not found in ${dataPath}`);
      }
    }

    // Importar datos en orden
    await importCircuits(dataPath);
    await importDrivers(dataPath);
    await importRaces(dataPath);
    await importResults(dataPath);

    console.log("Data import completed successfully!");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Fatal error during import:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

importAllData();
