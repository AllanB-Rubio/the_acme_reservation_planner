// Data Layer
const pg = require("pg");
const { v4: uuidv4 } = require("uuid");

// client - a node pg client
const { Client } = pg;
const client = new Client({
  database: "the_acme_reservation_planner",
});

// createTables method - drops and creates the tables for your application
const createTables = async () => {
  const SQL = `
          DROP TABLE IF EXISTS reservation;
          DROP TABLE IF EXISTS customer;
          DROP TABLE IF EXISTS restaurant;
  
          CREATE TABLE customer (
              id UUID PRIMARY KEY,
              name VARCHAR NOT NULL
          );
          CREATE TABLE restaurant (
              id UUID PRIMARY KEY,
              name VARCHAR NOT NULL 
          );
          CREATE TABLE reservation (
              id UUID PRIMARY KEY,
              date DATE NOT NULL,
              party_count INTEGER NOT NULL,
              restaurant_id UUID REFERENCES restaurant(id),
              customer_id UUID REFERENCES customer(id) NOT NULL
          )
          `;
  await client.query(SQL);
  return;
};
// createCustomer - creates a customer in the database and returns the created record
const createCustomer = async (name) => {
  const SQL = `
          INSERT INTO customer (id, name)
          VALUES ($1, $2) 
          RETURNING *
      `;
  const response = await client.query(SQL, [uuidv4(), name]);
  return response.rows[0];
};
// createRestaurant - creates a restaurant in the database and returns the created record
const createRestaurant = async (name) => {
  const SQL = `
      INSERT INTO restaurant (id, name)
      VALUES ($1,$2)
      RETURNING *
  
  `;
  const response = await client.query(SQL, [uuidv4(), name]);
  return response.rows[0];
};
// fetchCustomers - returns an array of customers in the database
const fetchCustomers = async () => {
  const SQL = `
          SELECT * 
          FROM customer
      `;
  const response = await client.query(SQL);
  return response.rows;
};
// fetchRestaurants - returns an array of restaurants in the database
const fetchRestaurants = async () => {
  const SQL = `
          SELECT * 
          FROM restaurant
      `;
  const response = await client.query(SQL);
  return response.rows;
};
// createReservation - creates a reservation in the database and returns the created record
const createReservation = async ({
  date,
  party_count,
  restaurant_id,
  customer_id,
}) => {
  const SQL = `
          INSERT INTO reservation (id, date, party_count, restaurant_id, customer_id )
          VALUES ($1, $2, $3, $4, $5)
          RETURNING * 
      `;
  const response = await client.query(SQL, [
    uuidv4(),
    date,
    party_count,
    restaurant_id,
    customer_id,
  ]);
  return response.rows[0];
};
const fetchReservation = async () => {
  const SQL = `
          SELECT * 
          FROM reservation
      `;
  const response = await client.query(SQL);
  return response.rows;
};
// destroyReservation - deletes a reservation in the database
const destroyReservation = async ({ id, customer_id }) => {
  console.log(id, customer_id);
  const SQL = `
        DELETE FROM reservation
        WHERE id = $1 AND customer_id=$2
    `;
  await client.query(SQL, [id, customer_id]);
};
module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  createReservation,
  fetchCustomers,
  fetchRestaurants,
  fetchReservation,
  destroyReservation,
};
