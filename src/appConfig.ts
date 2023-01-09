import express, { Router } from "express"
import bodyParser from 'body-parser';

type RouterProps = {path:string, router:Router}[]
const configureApp = (routerProps:RouterProps) => {
  const app = express();
  app.set("json spaces",2);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  routerProps.forEach(({path,router}) => {
    app.use(path,router);
  });
  return app;
}

export { configureApp }
