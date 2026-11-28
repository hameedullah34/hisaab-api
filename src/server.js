const express = require("express");
require("dotenv").config();
const { pool } = require("../db/db");

const authrouter = require("./routes/auth.routes");
const requireAuth = require("./middleware/requireAuth");

const app = express();
app.use(express.json());

const port = 3000;

app.get("/me", requireAuth, async (req, res) => {
	const id = req.user;

	try {
		const userData = await pool.query(
			`Select id, name, email , created_at from users where id = $1`,
			[id],
		);

		if (userData.rows.length === 0) {
			return res.status(404).json({
				error: {
					code: "NOT FOUND",
					message: "User is not in our database",
				},
			});
		}

		return res.status(200).json({ data: userData.rows[0] });
	} catch (error) {
		throw error;
	}
});

app.get("/", (req, res) => {
	res.send(`Hello`);
});

app.use("/auth", authrouter);

app.get("/health", async (req, res) => {
	try {
		await pool.query("SELECT 1");
		res.json({ status: "ok", db: "ok" });
	} catch (error) {
		res.status(503).json({ status: "error", db: "down" });
	}
});

app.listen(port, () => {
	console.log(`Listening on the port ${port}`);
});
