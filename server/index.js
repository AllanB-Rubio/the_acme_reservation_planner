// Express Application and Set Up Functions // Init Function
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  createReservation,
  fetchCustomers,
  fetchRestaurants,
  fetchReservation,
  destroyReservation,
} = require("./db");

// app routes
app.use(express.json());
app.use(require("morgan")("dev"));

// GET /api/customers - returns array of customers
app.get("/api/customers", async (req, res, next) => {
  try {
    const SQL = `
        SELECT * FROM customer`;

    const response = await client.query(SQL);

    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});
// GET /api/restaurants - returns an array of restaurants
app.get("/api/restaurants", async (req, res, next) => {
  try {
    const SQL = `
        SELECT * FROM restaurant`;

    const response = await client.query(SQL);

    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});
// GET /api/reservations - returns an array of reservations
app.get("/api/reservations", async (req, res, next) => {
  try {
    const SQL = `
          SELECT * FROM reservation`;

    const response = await client.query(SQL);

    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/customers/:id/reservations - payload: an object which has a valid restaurant_id, date, and party_count.
// returns the created reservation with a status code of 201
app.post("/api/customers/:id/reservations", async (req, res, next) => {
  try {
    const SQL = `
    INSERT INTO reservation(id, restaurant_id, date, party_count, customer_id)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
      `;

    const response = await client.query(SQL, [
      uuidv4(),
      req.body.restaurant_id,
      req.body.date,
      req.body.party_count,
      req.params.id,
    ]);
    res.status(201).send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/customers/:customer_id/reservations/:id - the id of the reservation to delete and the customer_id is passed in the URL, returns nothing with a status code of 204
app.delete(
  "/api/customers/:customer_id/reservations/:id",
  async (req, res, next) => {
    try {
      const SQL = `
          DELETE FROM reservation
          WHERE id = $1 AND customer_id = $2
          `;

      await client.query(SQL, [req.params.id, req.params.customer_id]);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

// BONUS - add an error handling route which returns an object with an error property.
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error to the console
  res.status(500).json({ error: err.message }); // Send a JSON response with the error message
});

// Init function
const init = async () => {
  try {
    console.log("connecting to database");
    await client.connect();

    console.log("connected to database");
    console.log("creating tables");

    await createTables();
    console.log("created tables");

    // customers
    const [tim, bella, rod] = await Promise.all([
      createCustomer("tim"),
      createCustomer("bella"),
      createCustomer("rod"),
    ]);

    // restaurants
    const [novo, flourhouse, bedas] = await Promise.all([
      createRestaurant("novo"),
      createRestaurant("flourhouse"),
      createRestaurant("bedas"),
    ]);

    console.log("Customers:", await fetchCustomers());
    console.log("Restaurants:", await fetchRestaurants());

    // reservations
    const [reservation, reservation2] = await Promise.all([
      createReservation({
        date: "2024-05-20",
        party_count: 4,
        restaurant_id: novo.id,
        customer_id: tim.id,
      }),
      createReservation({
        date: "2024-05-25",
        party_count: 2,
        restaurant_id: flourhouse.id,
        customer_id: bella.id,
      }),
    ]);

    console.log("Reservations:", await fetchReservation());
    await destroyReservation({
      id: reservation.id,
      customer_id: reservation.id,
    });
    console.log("Remaining Reservations:", await fetchReservation());

    console.log("data seeded");
    app.listen(port, () => console.log(`server listening on port ${port}`));
  } catch (error) {
    console.error("Error initializing the database:", error);
  }
};
init();
