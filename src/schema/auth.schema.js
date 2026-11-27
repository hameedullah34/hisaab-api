const z = require("zod");

const signupSchema = z.object({
	name: z.string().trim().min(1, "Name is required"),
	email: z.string().trim().toLowerCase().email(),
	password: z.string().min(8).max(64),
});

const loginSchema = z.object({
	email: z.string().trim().toLowerCase().email(),
	password: z.string().min(1, "Password is required"),
});


module.exports = {signupSchema,loginSchema}