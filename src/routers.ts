import { Router,Request,Response,NextFunction } from "express"
import { Collection, Document } from "mongodb"
import { createCurrentISODate, filterUndefined, generateId } from "./util"
import { body, validationResult,CustomValidator } from 'express-validator';

const errors = ["Invalid value"] as const;
type ErrorMsg = typeof errors[number];
// This allows you to reuse the validator
const isStringOrUndefined: CustomValidator = (value) => {
  if (typeof value !== "string" && value !== undefined) {
    throw new Error(`invalid value: ${value}`)
  }
  return true;
}

const checkPropertyLength = (req:Request,res:Response,next:NextFunction) => {
    const {body} = req;
    if(Object.keys(body).length === 0) {
        res.status(400).json({messsage: "missing required properties title or code"});
        return;
    }
    next();
}

const updateDoc = (req:Request,res:Response,next:NextFunction) => {
    // reqのbodyを書き換える
    const {title,code} = req.body;
    req.body = {
        updateDoc:{$set:filterUndefined({title,code})}
    }
    next()
}

const getSnippetRouter = (client: Collection<Document>) => {
  const router = Router()
  router.get("/", async (req, res) => {
    const { title } = req.query
    if (title) {
      const cursor = client.find({ title: new RegExp(String(title)) })
      const result = await cursor.toArray()
      if (result.length === 0) {
        res.status(404).json({ message: `not found title: ${title}` })
        return
      }
      res.status(200).json(result)
      return
    }
    const cursor = client.find({})
    const result = await cursor.toArray()
    res.status(200).json(result)
  })
  router.get("/:id", async (req, res) => {
    const { id } = req.params
    const cursor = client.find({ id: new RegExp(String(id)) })
    const result = await cursor.toArray()
    if (result.length === 0) {
      res.status(404).json({ message: `not found. id: ${id}` })
      return
    }
    res.status(200).json(result[0])
  })
  router.post("/new", async (req, res) => {
    const { title, code } = req.body
    if (!title) {
      res.status(404).json({ message: `invalid title: ${title}` })
      return
    }
    if (!code) {
      res.status(404).json({ message: `invalid code: ${code}` })
    }
    try {
      const operationResult = await client.insertOne({
        id: generateId(),
        title,
        code,
        created_date: createCurrentISODate(),
      })
      res.status(201).json({})
      return
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: "internal server error" })
    }
  })
  // 文字列かundefinedかであってほしい
  router.patch(
    "/:id/edit",
    checkPropertyLength,
    body("title").custom(isStringOrUndefined),
    body("code").custom(isStringOrUndefined),
    async (req, res,next) => {
        const id = req.params?.["id"]
        const cursor = client.find({ id: new RegExp(String(id)) })
        try {
            const doc = await cursor.toArray()
            if (doc.length === 0) {
              res.status(404).json({ message: `not found. id: ${id}` })
              return
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({message: "internal server error"});
            return;
        }
        next();
    },
    updateDoc,
    async (req, res) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        res.status(400).json({errors:errors.array()})
        return;
      }
      try {
          const {updateDoc} = req.body;
          const id = req.params?.["id"]
          const {modifiedCount} = await client.updateOne({ id }, updateDoc,{upsert:true});
          if(!modifiedCount) {
            res.status(500).json({message: "internal server error"});
            return;
          }
          res.status(200).json({...updateDoc.$set})
      } catch (e) {
        console.error(e);
        res.status(500).json({message: "internal server error"});
      }
    }
  )
  return router
}

export { getSnippetRouter }
