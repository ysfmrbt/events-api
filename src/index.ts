import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { init } from "./db/init";
import AuthRoute from "./api/auth/auth.route";
const app = new Hono();

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

const port = 3000;
console.log(`Server is running on port ${port}`);

init()
	.then(() => {
		console.info("Tables were successfully initialized.");
	})
	.catch((err) => {
		console.error(err);
	});

// Register the hono instance with the AuthRoute
app.route("/auth", AuthRoute);

serve({
	fetch: app.fetch,
	port,
});
