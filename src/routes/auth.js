const express = require("express");
const z = require("zod");
const argon2 = require("argon2");
const { pool } = require("../../db/db");

const signupSchema = z.object({
	name: z.string().trim().min(1, "Name is required"),
	email: z.email().trim().toLowerCase(),
	password: z.string().min(8).max(64),
});

const router = express.Router();

router.post("/signup", async (req, res) => {
	try {
		const check = signupSchema.safeParse(req.body);

		if (!check.success) {
			return res.status(400).json({ error: check.error.issues[0].message });
		}

		const hash = await argon2.hash(check.data.password);

		const result = await pool.query(
			`INSERT INTO users (name, email, password_hash)
VALUES ($1, $2, $3) returning name , email, id ,created_at;`,
			[check.data.name, check.data.email, hash],
		);

		res.status(201).json(result.rows[0]);
	} catch (error) {
		if (error.code == "23505") {
			return res.status(409).json({ messege: "Email already Registered" });
		}
		throw error;
	}
});

module.exports = router;
