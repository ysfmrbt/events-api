import { jwt } from "hono/jwt";
import { Hono } from "hono";
import type { Context } from "hono";
import type { JwtVariables } from "hono/jwt";
import { sign } from "hono/jwt";
import { createUser, getUserByEmail } from "../../db/users";
import { deleteToken, createToken, getTokens } from "../../db/tokens";
import bcrypt from "bcrypt";
import { setCookie, deleteCookie, getCookie } from "hono/cookie";

const app = new Hono<{ Variables: JwtVariables }>();

interface LoginRequest {
	email: string;
	password: string;
}

const jwtMiddleware = jwt({
	secret: "events-api-secret-key",
	cookie: "token",
});

app.get("/me", jwtMiddleware, async (c) => {
	if (!getCookie(c, "token")) {
		return c.json({ message: "You are not logged in" });
	}
	
	return c.json({ message: "You are authenticated!" });
});

// Define the login route
app.post("/login", async (c: Context) => {
	const { email, password } = await c.req.json<LoginRequest>();
	const user = await getUserByEmail(email);
	if (!user) {
		return c.json({ message: "User not found" }, { status: 404 });
	}
	if (user.email === email && (await bcrypt.compare(password, user.password))) {
		const token = await sign(
			{ email: user.email, role: user.role },
			"events-api-secret-key",
		);
		const tokenExists = await getTokens()
			.then((res) => {
				return res.find((t) => t.token === token);
			})
			.catch((err) => {
				console.error(err);
			});

		if (tokenExists) {
			return c.json(
				{ message: "This token already exists, please logout" },
				{ status: 401 },
			);
		}

		await createToken(token)
			.then(() => {
				console.info("Token saved to the database successfully");
			})
			.catch((err) => {
				console.error(err);
			});
		setCookie(c, "token", token, {
			httpOnly: true,
			sameSite: "None",
			secure: false,
		});
		return c.json({ message: "Successfully logged in!", token: token });
	}

	return c.json({ message: "Invalid credentials" }, { status: 401 });
});

// Define the register route
app.post("/register", async (c: Context) => {
	// Get the user data from the request body
	const { first_name, last_name, email, password, phone, age, role } =
		await c.req.json();

	// Check if the user already exists
	const user = await getUserByEmail(email);
	if (user) {
		return c.json({ message: "User already exists" }, { status: 400 });
	}

	// Hash the password
	const hashedPassword = await bcrypt.hash(password, 10);

	// Create the user
	await createUser(
		first_name,
		last_name,
		email,
		hashedPassword,
		phone,
		age,
		role,
	)
		.then(() => {
			console.log("User created successfully");
		})
		.catch((err) => {
			console.error(err);
		});
	return c.json({ message: user });
});

app.get("/logout", jwtMiddleware, async (c) => {
	const token = getCookie(c, "token") as string;
	if (!getCookie(c, "token")) {
		return c.json({ message: "You are not logged in" });
	}

	// Delete the token cookie
	deleteCookie(c, "token");

	// Check if the token exists in the database
	const tokenExists = await getTokens()
		.then((res) => {
			return res.find((t) => t.token === token);
		})
		.catch((err) => {
			console.error(err);
		});

	if (!tokenExists) {
		return c.json({ message: "This token does not exist" }, { status: 401 });
	}

	// Delete the token from the database
	await deleteToken(token)
		.then(() => {
			console.info("Token deleted from the database successfully");
		})
		.catch((err) => {
			console.error(err);
		});
	return c.json({ message: "Successfully logged out" });
});
export default app;
