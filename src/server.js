import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
	res.send("this is home page");
});
app.get("/health", (req, res) => {
	res.json({ status: "ok" });
});

app.listen(port, () => {
	console.log(`Listening on the port ${port}`);
});
