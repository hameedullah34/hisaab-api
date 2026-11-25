const express = require("express");
require("dotenv").config();
const { pool } = require("../db/db");
const { log } = require("node:console");

const app = express();
app.use(express.json());
const port = 3000;

app.get("/", (req, res) => {
	res.send(`Hello`);
});
app.get("/health", async (req, res) => {
	try {
		await pool.query("SELECT 1");
		res.json({ status: "ok", db: "ok" });
	} catch (error) {
		console.log(error);
		res.status(503).json({ status: "error", db: "down" });
	}
});

app.listen(port, () => {
	console.log(`Listening on the port ${port}`);
});
