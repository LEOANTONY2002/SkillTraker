import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import dotenv from "dotenv";
import { mail } from "./mail/index.js";
import { schema } from "./src/schema.js";

dotenv.config();

const apolloServer = new ApolloServer({
  schema,
});

const port = process.env.PORT || 4001;

startStandaloneServer(apolloServer, {
  listen: { port },
}).then(() => {
  console.log(`Server started`)
  // mail()
});
