# The Acme Reservation Planner

The Acme Reservation Planner is a Node.js application designed to manage restaurant reservations for customers. It provides RESTful API endpoints for creating customers, restaurants, and reservations, as well as retrieving and deleting them.

## Table of Contents

- [Features](#features)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Dependencies](#dependencies)

## Features

- **Customer Management:** Create and retrieve customer records.
- **Restaurant Management:** Create and retrieve restaurant records.
- **Reservation Management:** Create, retrieve, and delete reservation records.

## Installation

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd the_acme_reservation_planner`
3. Install dependencies: `npm install`

## Usage

1. Ensure PostgreSQL is installed and running.
2. Set up the PostgreSQL database by creating a database named `the_acme_reservation_planner`.
3. Configure the PostgreSQL connection details in the `db.js` file.
4. Run the initialization script: `npm start`.
5. Use Postman or another API testing tool to interact with the endpoints.

## API Endpoints

- **GET /api/customers:** Retrieve all customers.
- **GET /api/restaurants:** Retrieve all restaurants.
- **GET /api/reservations:** Retrieve all reservations.
- **POST /api/customers/:id/reservations:** Create a reservation for a specific customer.
- **DELETE /api/customers/:customer_id/reservations/:id:** Delete a reservation.

## Dependencies

- [Express](https://www.npmjs.com/package/express): Web application framework for Node.js.
- [morgan](https://www.npmjs.com/package/morgan): HTTP request logger middleware for Node.js.
- [pg](https://www.npmjs.com/package/pg): PostgreSQL client for Node.js.
- [uuid](https://www.npmjs.com/package/uuid): Generate RFC-compliant UUIDs in JavaScript.
