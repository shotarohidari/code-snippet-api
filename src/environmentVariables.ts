import {config} from "dotenv";
config();

const MONGO_URI = process.env.MONGO_URI || ""
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || ""
const MONGO_COLLECTION_NAME = process.env.MONGO_COLLECTION_NAME || ""
const PORT = process.env.PORT || ""
if (!MONGO_URI) throw new Error("MONGOURIがセットされていません")
if (!MONGO_DB_NAME) throw new Error("MONGO_DB_NAMEがセットされていません")
if (!MONGO_COLLECTION_NAME) throw new Error("MONGO_COLLECTION_NAMEがセットされていません")
if(!PORT) throw new Error("PORTがセットされていません");

export {MONGO_URI,MONGO_DB_NAME,MONGO_COLLECTION_NAME,PORT};