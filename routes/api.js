const express = require("express");
const router = express.Router();

const db = global.db;

router.get("/books", function (req, res, next) {
  // search books
  let search = req.query.search;
  let sqlquery = "SELECT * FROM books";

  if (search) {
    sqlquery = `SELECT * FROM books WHERE name LIKE '%${search}%'`;
  }

  // price filtering
  let min = req.query.minprice;
  let max = req.query.maxprice;

  if (min && max) {
    sqlquery = `SELECT * FROM books WHERE price BETWEEN ${min} AND ${max}`;
  }

  // sorting
  let sort = req.query.sort;

  if (sort === "name") {
    sqlquery += " ORDER BY name ASC";
  } else if (sort === "price") {
    sqlquery += " ORDER BY price ASC";
  }

  // Execute the sql query
  db.query(sqlquery, (err, result) => {
    // Return results as a JSON object
    if (err) {
      res.json(err);
      next(err);
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
