const MONGO_URI = process.env.MONGO_URI
const DB_NAME = process.env.DB_NAME
const COLLECTION_NAME = process.env.COLLECTION_NAME
if (!MONGO_URI) throw new Error("URIがセットされていません")
if (!DB_NAME) throw new Error("DB_NAMEがセットされていません")
if (!COLLECTION_NAME) throw new Error("TABLE_NAMEがセットされていません")

export {MONGO_URI,DB_NAME,COLLECTION_NAME};