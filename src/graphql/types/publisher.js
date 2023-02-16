import { PrismaClient } from "@prisma/client";
import { extendType, nonNull, objectType, stringArg } from "nexus";
import { prismaErr } from "../prismaError.js";

const prisma = new PrismaClient();

export const Publishers = objectType({
  name: "Publishers",
  definition(t) {
    t.string("id");
    t.string("name");
    t.field("createdAt", { type: "DateTime" });
    t.field("updatedAt", { type: "DateTime" });
    t.list.field("certificates", { type: "Certificates" });
  },
});

export const allPublishers = extendType({
  type: "Query",
  definition(t) {
    t.list.field("publishers", {
      type: "Publishers",
      async resolve(_root, args, ctx) {
        return await prisma.publishers.findMany();
      },
    });
  },
});

export const addPublisher = extendType({
  type: "Mutation",
  definition(t) {
    t.list.field("addPublisher", {
      type: "Publishers",
      args: {
        id: nonNull(stringArg()),
        name: nonNull(stringArg()),
      },
      async resolve(_root, args) {
        await prisma.publishers
          .upsert({
            where: {
              id: args.id,
            },
            update: {
              name: args.name,
            },
            create: {
              name: args.name,
            },
          })
          .catch(prismaErr);
        return await prisma.publishers.findMany();
      },
    });
  },
});

export const deletePublisher = extendType({
  type: "Mutation",
  definition(t) {
    t.list.field("deletePublisher", {
      type: "Publishers",
      args: {
        id: nonNull(stringArg()),
      },
      async resolve(_root, args, ctx) {
        await prisma.publishers
          .delete({
            where: {
              id: args.id,
            },
          })
          .catch(prismaErr);
        return await prisma.publishers.findMany();
      },
    });
  },
});
