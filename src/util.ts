import { MongoClient, UpdateFilter } from 'mongodb';
import crypto from "node:crypto";
export const createCollectionManager = (url:string,dbName:string,collectionName:string) => {
    const client = new MongoClient(url)
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    return collection;
}

export const filterProperty = <T extends Record<string,unknown>>(obj:T,filterKey: keyof T) => {
    return Object.keys(obj).reduce((newObject,key) => {
        if(key === filterKey) {
            return newObject
        }
        return {...newObject,key:obj[key]}
    },{} as Omit<T,typeof filterKey>)
}

export const generateId = (length:number = 16) => crypto.randomBytes(length).toString("hex");

export const createCurrentISODate = () => new Date().toISOString();

export const filterUndefined = <T extends Record<string,unknown>>(obj:T) => {
    return Object.keys(obj).reduce((newObj,key) => {
        if(!obj[key]) {
            return newObj
        }
        return {...newObj,[key]:obj[key]}
    },{} as Record<string,unknown>)
}