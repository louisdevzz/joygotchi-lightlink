import { MongoClient } from "mongodb";

const URI = process.env.MONGODB_URI
const options = {}

if(!URI) throw new Error('please add your MongoDB URI .env')
let client = new MongoClient(URI,options)
let clientPromise = client.connect();

export default clientPromise;