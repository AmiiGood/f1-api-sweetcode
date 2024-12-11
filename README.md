# F1 API Documentation

## Description

A RESTful API that provides Formula 1 historical data, including information about drivers, races, circuits, and race results. Built with Node.js, Express, and MongoDB.

## Features

- Complete F1 historical data
- RESTful API architecture
- Pagination and filtering capabilities
- Well-documented endpoints
- Error handling
- Data persistence with MongoDB

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Other dependencies (express, dotenv, etc.)

## Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB installed and running
- NPM or Yarn package manager

## Installation

1. Clone the repository

```bash
git clone https://github.com/AmiiGood/f1-api-sweetcode.git
cd f1-api-sweetcode
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

```bash
cp .env.example .env
```

Then edit the `.env` file with your configuration:

```
MONGODB_URI=mongodb://localhost:27017/f1-database
PORT=3000
```

4. Import initial data

```bash
npm run import-data
```

## Usage

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Drivers

- `GET /api/drivers` - Get all drivers (with pagination)
- `GET /api/drivers/:id` - Get specific driver

### Races

[To be implemented]

### Circuits

[To be implemented]

### Results

[To be implemented]

## Query Parameters

### Common Parameters

- `page`: Page number for pagination (default: 1)
- `limit`: Number of items per page (default: 10)
- `sortBy`: Field to sort by
- `order`: Sort order (asc/desc)

### Specific Parameters

- `nationality`: Filter drivers by nationality
- `search`: Search in driver names

## Project Structure

```
📦 f1-api-sweetcode
 ┣ 📂 src
 ┃ ┣ 📂 config         # Configuration files
 ┃ ┣ 📂 controllers    # Route controllers
 ┃ ┣ 📂 middleware     # Custom middleware
 ┃ ┣ 📂 models        # Database models
 ┃ ┣ 📂 routes        # API routes
 ┃ ┣ 📂 scripts       # Utility scripts
 ┃ ┗ 📜 app.js        # App entry point
 ┣ 📂 data            # CSV data files
 ┣ 📂 docs            # Documentation
 ┗ 📜 .env            # Environment variables
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Formula 1 for the inspiration
- [Ergast API](http://ergast.com/mrd/) for the reference implementation

