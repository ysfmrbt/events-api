import postgres from 'postgres'
import dotenv from 'dotenv'
dotenv.config()
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env
PGPASSWORD = decodeURIComponent(PGPASSWORD as string)

console.info(`PGHOST: ${PGHOST}`)
console.info(`PGDATABASE: ${PGDATABASE}`)
console.info(`PGUSER: ${PGUSER}`)
console.info(`PGPASSWORD: ${PGPASSWORD}`)

const sql = postgres({
    host: PGHOST,
    database: PGDATABASE,
    username: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: 'require',
    connection: {
        options: `project=${ENDPOINT_ID}`
    }
})

export async function getPgVersion() {
    const result = await sql`select version()`
    console.log(result)
}

export default sql