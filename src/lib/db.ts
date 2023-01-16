import mysql from 'serverless-mysql';

const p: string = process.env.NEXT_PUBLIC_MYSQL_PORT as string;
const portNumber = +p;

console.log(process.env.NEXT_PUBLIC_MYSQL_HOST);

const db = mysql({
  config: {
    host: process.env.NEXT_PUBLIC_MYSQL_HOST,
    port: portNumber,
    database: process.env.NEXT_PUBLIC_MYSQL_DATABASE,
    user: process.env.NEXT_PUBLIC_MYSQL_USER,
    password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD,
  },
});

// @ts-ignore
export default async function executeQuery({ query, values }) {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    console.log(error);
    return { error };
  }
}
