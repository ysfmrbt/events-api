import sql from "../neon";

export const getEvents = async () => {
	return await sql`select * from events`;
};

export const getEventById = async (id: number) => {
	return await sql`select * from events where id = ${id}`;
};

export const createEvent = async (
	user_id: number,
	title: string,
	description: string,
	date: string,
	time: string,
	location: string,
) => {
	return await sql`insert into events (user_id, title, description, date, time, location) values (${user_id}, ${title}, ${description}, ${date}, ${time}, ${location})`;
};

export const updateEvent = async (
	id: number,
	user_id: number,
	title: string,
	description: string,
	date: string,
	time: string,
	location: string,
) => {
	return await sql`update events set user_id = ${user_id}, title = ${title}, description = ${description}, date = ${date}, time = ${time}, location = ${location} where id = ${id}`;
};

export const deleteEvent = async (id: number) => {
	return await sql`delete from events where id = ${id}`;
};
