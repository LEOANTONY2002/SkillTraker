import { makeSchema } from "nexus";
import path, { join, dirname } from "path";
import { fileURLToPath } from 'url';
import * as types from "./graphql/types/index.js";
import pkg from 'graphql-iso-date';
const { GraphQLDateTime } = pkg;
export const DateTime = GraphQLDateTime;


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const schema = makeSchema({
  types: [types, DateTime],
  outputs: {
    schema: join(__dirname, "./graphql", "schema.graphql"),
  },
});
