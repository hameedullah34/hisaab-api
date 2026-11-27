const express = require("express");
const argon2 = require("argon2");
const { pool } = require("../../db/db");
const jwt = require("jsonwebtoken");
const { signupSchema, loginSchema } = require("../schema/auth.schema.js");

const authrouter = express.Router();

authrouter.post("/signup", async (req, res) => {
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
			return res.status(409).json({ message: "Email already Registered" });
		}
		throw error;
	}
});

authrouter.post("/login", async (req, res) => {
	const password = req.body.password;

	const loginCheck = loginSchema.safeParse(req.body);

	if (!loginCheck.success) {
		return res.status(400).json({ message: "email or password is required " });
	}

	const availableRows = await pool.query(
		`select * from users where email = $1`,
		[loginCheck.data.email],
	);

	if (availableRows.rows.length === 0) {
		return res.status(401).json({ message: "invalid credential" });
	}

	const passwordVerification = await argon2.verify(
		availableRows.rows[0].password_hash,
		password,
	);

	if (!passwordVerification) {
		return res.status(401).json({ message: "invalid credential" });
	}

	const token = jwt.sign(
		{ sub: String(availableRows.rows[0].id) },
		process.env.JWT_SECRET,
		{
			expiresIn: "1h",
		},
	);

	return res.status(200).json({ token: token });
});

module.exports = authrouter;
