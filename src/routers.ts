import { Router } from "express"
import { Collection, Document } from 'mongodb';
import { createCurrentISODate, generateId } from "./util";

// データベースに接続する処理が必要だ。
const getSnippetRouter = (client:Collection<Document>) => {
    const router = Router()
    router.get("/", async (req, res) => {
      const { title } = req.query
      if (title) {
        // dataListからデータ取得
        const cursor = client.find({title: new RegExp(String(title))});
        const result = await cursor.toArray();
        if(result.length === 0) {
            res.status(404).json({ message: `not found title: ${title}` })
            return;
        }
        res.status(200).json(result);
        return;
      }
      // 一覧データの取得
      const cursor = client.find({});
      const result = await cursor.toArray();
      res.status(200).json(result)
    })
    router.get("/:id", async (req, res) => {
      const { id } = req.params
      const cursor = client.find({id: new RegExp(String(id))});
      const result = await cursor.toArray();
      if(result.length === 0) {
          res.status(404).json({ message: `not found. id: ${id}` })
          return;
      }
      // mongoDBでIDで絞り込み
      res.status(200).json(result[0]);
    })
    router.post("/new", async (req, res) => {
        console.log("in new");
        const {title,code} = req.body;
        console.log({title,code});
        if(!title) {
            console.log("no title");
            res.status(404).json({message: `invalid title: ${title}`});
            return;
        }
        if(!code) {
            console.log("no code");
            res.status(404).json({message: `invalid code: ${code}`});
        }
        try {
            console.log("will insert");
            const operationResult = await client.insertOne({
                id: generateId(),
                title,
                code,
                created_date: createCurrentISODate()
            });
            console.log({operationResult});
            res.status(201).json({});
            return;
        } catch(e) {
            console.error(e);
            res.status(500).json({message: "internal server error"});
        }
    })
    return router
}

export {getSnippetRouter}