import { CodeSnippetData } from "../src/types";

export const dataList:CodeSnippetData[] = [
    {
        id: "3e87770e95f2ec48c5b94bff18212322",
        created_date: "2023-01-08T09:14:16.829Z",
        title: "挨拶するコード",
        code:`console.log("Hello,World")`
    },
    {
        id: "3e87770e95f2ec48c5b94bff18212323",
        created_date: "2023-01-09T09:14:16.829Z",
        title: "TypeScriptの配列の要素をユニークにする",
        code:`const duplicatedArray = ["a","a","a","hoge","ze","a"];
        const uniqueAry = [...new Set(duplicatedArray)]`
    }
]