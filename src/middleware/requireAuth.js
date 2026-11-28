const jwt = require("jsonwebtoken");

const requireAuth =  (req, res, next) => {
	if (req.headers == undefined) {
		return res
			.status(401)
			.json({ error: { code: "UNAUTHORIZED", message: "token is invalid" } });
	}

	const totalData = req.headers.authorization;
	const token = totalData.split(" ")[1];

	if (token === undefined) {
		return res
			.status(401)
			.json({ error: { code: "UNAUTHORIZED", message: "token is invalid" } });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const payload = decoded.sub;
		req.user = payload;
		next();
	} catch (error) {
		return res.status(401).json({
			error: {
				code: "UNAUTHORIZED",
				message: "Token is invalid or expired",
			},
		});
	}
};

module.exports = requireAuth;
