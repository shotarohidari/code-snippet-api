import { configureApp } from "./appConfig";
import { MONGO_COLLECTION_NAME, MONGO_DB_NAME, MONGO_URI, PORT } from "./environmentVariables";
import { getSnippetRouter } from "./routers";
import { createCollectionManager } from "./util";

const app = configureApp([
  {path:"/snippets",router:getSnippetRouter(createCollectionManager(MONGO_URI,MONGO_DB_NAME,MONGO_COLLECTION_NAME))}
]);

app.listen(PORT,() => {
  console.log(`http://localhost:${PORT} listening!`);
});

