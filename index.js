import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import dotenv from "dotenv";
import { schema } from "./src/schema.js";

dotenv.config();

const apolloServer = new ApolloServer({
  schema,
});
const port = process.env.PORT || 4001;
startStandaloneServer(apolloServer, {
  listen: { port },
}).then((engine) => console.log(`Server ready at: ${engine?.url}`));






// import { ApolloServer } from "@apollo/server";
// import dotenv from "dotenv";
// import { createServer } from "http";
// import { WebSocketServer } from "ws";
// import { useServer } from 'graphql-ws/lib/use/ws';
// import express from 'express'
// import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
// import { schema } from "./src/schema.js";
// import bodyParser from "body-parser";
// import cors from "cors"
// import { expressMiddleware } from '@apollo/server/express4';

// dotenv.config();

// const app = express()
// app.use(cors())
// const httpServer = createServer(app);
// const wsServer = new WebSocketServer({
//   server: httpServer,
//   path: '/graphql',
// });
// const serverCleanup = useServer({ schema }, wsServer);
// const apolloServer = new ApolloServer({
//   schema,
//   plugins: [
//     ApolloServerPluginDrainHttpServer({ httpServer }),
//     {
//       async serverWillStart() {
//         return {
//           async drainServer() {
//             await serverCleanup.dispose();
//           },
//         };
//       },
//     },
//   ]
// });

// await apolloServer.start();
// app.use('/graphql', cors(), bodyParser.json(), expressMiddleware(apolloServer));

// const port = process.env.PORT || 4001;

// httpServer.listen(port, () => {
//   console.log("Server Started")
// })


