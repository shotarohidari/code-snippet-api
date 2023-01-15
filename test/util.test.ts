import { filterUndefined } from "../src/util";

describe("filterUndefined", () => {
    test('値がundefinedのプロパティを除去できる', () => { 
        const input = {title: "値がundefinedのオブジェクトを取り除くコード",code:undefined};
        expect(filterUndefined(input)).toEqual({title:"値がundefinedのオブジェクトを取り除くコード"})
     });
    test("undefinedの値がない場合は入力の値そのまま返す", () => {
        const input = {title: "コンソール上で挨拶するコード",code:"console.log(\"Hello, World\")"};
        expect(filterUndefined(input)).toEqual(input)
    })
});