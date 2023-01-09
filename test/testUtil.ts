// 条件付き型が欲しいな。

type HTTPMETHOD = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

// type BasicOption = {headers?:Headers}
// type POSTOption = BasicOption & {body: string};
// type MethodOption<T extends HTTPMETHOD> = T extends "POST" | "PATCH" | "PUT" ? POSTOption : BasicOption;

type BasicOption = {
    headers?:HeadersInit
}
type GETOption = {
    method:"GET"
} & BasicOption
type POSTOption = {
    method:"POST" | "PATCH" | "PUT",
    body?:string
} & BasicOption

type RequestOption = GETOption | POSTOption;

export const createFeatcher = (endpoint:string) => {
    return async (path:string,option:RequestOption = {method: "GET"}) => {
        try {
            const res = await fetch(`${endpoint}${path}`,option);
            const {status} = res;
            const data = await res.json();
            return {status, data}
        } catch {
            const res = await fetch(`${endpoint}${path}`,option);
            const data = await res.text();
            console.log({data});
            throw new Error("エラー");
        }
    }
}

const fetcher = createFeatcher("fff");