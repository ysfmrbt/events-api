import sql from "../neon";
import type User from "../types/User";

export const getUsers = async () => {
	return await sql`select * from users`;
};

export const getUserById = async (id: number) => {
	return await sql`select * from users where id = ${id}`;
};

export const getUserByEmail = async (email: string) => {
	const result = await sql`select * from users where email = ${email}`;
	const user = result[0] as User;
	return user;
};

export const createUser = async (
	first_name: string,
	last_name: string,
	email: string,
	password: string,
	phone: string,
	age: number,
	role: string,
) => {
	return await sql`insert into users (first_name, last_name, email,password, phone, age, role) values (${first_name}, ${last_name}, ${email}, ${password}, ${phone}, ${age}, ${role}) on conflict do nothing;`;
};

export const updateUser = async (
	id: number,
	first_name: string,
	last_name: string,
	email: string,
	password: string,
	phone: string,
	age: number,
	role: string,
) => {
	return await sql`update users set first_name = ${first_name}, last_name = ${last_name}, email = ${email}, password = ${password}, phone = ${phone}, age = ${age}, role = ${role} where id = ${id}`;
};

export const deleteUser = async (id: number) => {
	return await sql`delete from users where id = ${id}`;
};
