import sql from "../neon";
import bcrypt from "bcrypt";
export const init = async () => {
	await sql`
    create table if not exists users (
        id serial primary key,
        first_name text,
        last_name text,
        email text unique,
        password text,
        phone text,
        age integer,
        role text default 'user'
    );
    `;
	await sql`insert into users (first_name, last_name, email, password, phone, age, role) values ('Youssef', 'Mrabet', 'yssfmrbt@gmail.com', ${await bcrypt.hash("admin123", 10)},'23691669', 24, 'admin') on conflict do nothing;`;
	await sql`
    create table if not exists events (
        id serial primary key,
        user_id integer references users(id),
        title text,
        description text,
        date date,
        time time,
        location text
    );
    `;
	await sql`create table if not exists tokens (token text primary key);`;
};
