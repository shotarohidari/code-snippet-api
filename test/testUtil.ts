type BasicOption = {
  headers?: HeadersInit
}
type GETOption = {
  method: "GET"
} & BasicOption
type POSTOption = {
  method: "POST" | "PATCH" | "PUT"
  body?: Record<string, unknown>
} & BasicOption

type RequestOption = GETOption | POSTOption

export const createFeatcher = (endpoint: string) => {
  return async (
    path: string,
    option: RequestOption = { method: "GET" }
  ) => {
    try {
      const res = await fetch(
        `${endpoint}${path}`,
        option.method === "GET"
          ? { ...option }
          : {
              ...option,
              body: JSON.stringify(option.body),
              headers: { "Content-Type": "application/json" },
            }
      )
      const { status } = res
      const data = await res.json();
      return { status, data }
    } catch (e){
      console.error(e);
      throw new Error("エラー")
    }
  }
}

const fetcher = createFeatcher("fff")
