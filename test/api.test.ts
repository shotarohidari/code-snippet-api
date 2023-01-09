import { describe, expect, beforeAll, afterAll, it } from "@jest/globals"
import { Collection, Document, MongoClient } from "mongodb"
import { MongoMemoryServer } from "mongodb-memory-server"
import { configureApp } from "../src/appConfig"
import { dataList } from "./mockData"
import { getSnippetRouter } from "../src/routers"
import { createFeatcher } from "./testUtil"
import { createCollectionManager } from "../src/util"
import { CodeSnippetData } from "../src/types"
const PORT = 9876

const _fetch = createFeatcher(`http://localhost:${PORT}`)

describe("APIのテスト", () => {
  let con: MongoClient
  let mongoServer: MongoMemoryServer
  let col: Collection<Document>
  let dbName: string
  const collectionName = "Snippets"
  let uri: string
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    uri = mongoServer.getUri()
    con = await MongoClient.connect(uri, {})
    dbName = mongoServer.instanceInfo!.dbName
    const db = con.db(dbName)
    col = db.collection(collectionName)
    await col.insertMany(dataList)
    const client = createCollectionManager(uri, dbName, collectionName)
    const app = configureApp([
      { path: "/snippets", router: getSnippetRouter(client) },
    ])
    server = app.listen(PORT)
  })

  afterAll(async () => {
    if (con) {
      await con.close()
    }
    if (mongoServer) {
      await mongoServer.stop()
    }
    server.close()
  })
  let server: any
  describe("正常系", () => {
    describe("GET", () => {
      it("データの一覧が取得できる", async () => {
        const { data: resultList } = await _fetch("/snippets")
        ;(resultList as CodeSnippetData[]).forEach(
          (data: CodeSnippetData, idx) => {
            expect(data.title).toBe(dataList[idx].title)
          }
        )
      })
      it("idで日時、コードの内容を取得できる", async () => {
        const id = "3e87770e95f2ec48c5b94bff18212322"
        const { data } = await _fetch(`/snippets/${id}`)
        expect(data.id).toBe(id)
      })
      it("タイトルで絞り込みが行える", async () => {
        const encodedPath = `/snippets?title=${encodeURIComponent(
          "TypeScript"
        )}`
        const { data } = await _fetch(encodedPath)
        expect(/TypeScript/.test(data[0].title)).toBe(true)
      })
    })
    describe("POST", () => {
      it("データの投稿ができる", async () => {
        const body: Omit<CodeSnippetData, "id" | "created_date"> = {
          title: "HTTPメソッドを型リテラルで定義",
          code: `type HTTPMETHOD = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";`,
        }
        const { status } = await _fetch("/snippets/new", {
          method: "POST",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" }
        })
        expect(status).toBe(201);
      });
    });
  })
  describe("異常系", () => {
    it("存在しないidのデータは取得できない", async () => {
      const id = "3e87770e95f2ec48c5b94bff1821er322"
      const { data, status } = await _fetch(`/snippets/${id}`)
      expect(data).toEqual({ message: `not found. id: ${id}` })
    })
    it("存在しないタイトルでの絞り込みは行えない", async () => {
      const title = "JavaScript"
      const encodedPath = `/snippets?title=${encodeURIComponent(title)}`
      const { data } = await _fetch(encodedPath)
      expect(data).toEqual({ message: `not found title: ${title}` })
    });
    it("タイトルが空だと投稿できない", async () => {
        const body: Omit<CodeSnippetData, "id" | "created_date"> = {
          title: "",
          code: `type HTTPMETHOD = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";`,
        }
        const { status } = await _fetch("/snippets/new", {
          method: "POST",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" }
        })
        expect(status).toBe(404);
    });
  })
})
