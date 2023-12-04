const path = require("path");
const express = require("express");
const router = express.Router();

// client side static assets
router.get("/", (_, res) => res.sendFile(path.join(__dirname, "./index.html")));
router.get("/client.js", (_, res) =>
  res.sendFile(path.join(__dirname, "./client.js"))
);

/**
 * Student code starts here
 */

// connect to postgres
const pg = require("pg");
const pool = new pg.Pool({
  user: "apple",
  host: "localhost",
  database: "recipeguru",
  password: "lol",
  port: 5432,
});

router.get("/type", async (req, res) => {
  const { type } = req.query;
  console.log("get ingredients", type);

  const { rows } = await pool.query(
    "SELECT * FROM ingredients WHERE type= $1",
    [type]
  );

  // return all ingredients of a type

  res.status(200).json({ status: "send", rows });
});

router.get("/search", async (req, res) => {
  let { term, page } = req.query;
  page = page ? page : 0;
  console.log("search ingredients", term, page);

  // return all columns as well as the count of all rows as total_count
  // make sure to account for pagination and only return 5 rows at a time

  let where_clause = "";
  const params = [page * 5];

  if (term) {
    where_clause = `WHERE CONCAT(title, type) ILIKE $2`;
    params.push(`%${term}%`);
  }

  const { rows } = await pool.query(
    `SELECT * FROM ingredients ${where_clause} OFFSET $1 LIMIT 5`,
    params
  );
  res.json({ rows });
});

/**
 * Student code ends here
 */

module.exports = router;
