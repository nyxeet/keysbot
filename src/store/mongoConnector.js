import { MongoClient, ServerApiVersion } from 'mongodb';
import 'dotenv/config';

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.b1g9r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let dbConnection;

export async function mongoConnect() {
  if (!dbConnection) {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    dbConnection = await client.db('wow'); // Замените на имя БД
  }
  console.log('Pinged your deployment. You successfully connected to MongoDB!');
  return dbConnection;
}

export function getDb() {
  if (!dbConnection) {
    throw new Error('Connection to mongodb does not exist');
  }
  return dbConnection;
}
