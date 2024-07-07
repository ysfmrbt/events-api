import sql from "../neon";

export const getTokens = async () => {
	return await sql`select * from tokens`;
};

export const deleteToken = async (token: string) => {
	return await sql`delete from tokens where token = ${token}`;
};

export const deleteAllTokens = async () => {
	return await sql`delete from tokens`;
};

export const createToken = async (token: string) => {
	return await sql`insert into tokens (token) values (${token}) on conflict do nothing;`;
};
