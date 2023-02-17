import { extendType, nonNull, objectType, stringArg } from "nexus";
import { prismaErr } from "../prismaError.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const Skills = objectType({
  name: "Skills",
  definition(t) {
    t.string("id");
    t.string("name");
    t.list.field("categories", {
      type: "CategoriesOnSkills",
    });
    t.field("createdAt", { type: "DateTime" });
    t.field("updatedAt", { type: "DateTime" });
  },
});

export const allSkills = extendType({
  type: "Query",
  definition(t) {
    t.list.field("skills", {
      type: "Skills",
      async resolve(_root, args) {
        return await prisma.skills.findMany({
          include: {
            categories: {
              include: {
                skill: true,
                category: true,
              },
            },
          },
        });
      },
    });
  },
});

export const getSkill = extendType({
  type: "Query",
  definition(t) {
    t.field("skill", {
      type: "Skills",
      args: {
        id: nonNull(stringArg()),
      },
      async resolve(_root, args) {
        return await prisma.skills
          .findUniqueOrThrow({
            where: {
              id: args.id,
            },
          })
          .catch(prismaErr);
      },
    });
  },
});

export const editSkill = extendType({
  type: "Mutation",
  definition(t) {
    t.list.field("editSkill", {
      type: "CategoriesOnSkills",
      args: {
        id: nonNull(stringArg()),
        name: nonNull(stringArg()),
        categoryId: nonNull(stringArg()),
        skillId: nonNull(stringArg()),
      },
      async resolve(_root, args, ctx) {
        await prisma.skills
          .update({
            where: {
              id: args.skillId,
            },
            data: {
              name: args.name,
            },
          })
          .catch(prismaErr);

        await prisma.categoriesOnSkills.update({
          where: {
            id: args.id,
          },
          data: {
            skillId: args.skillId,
            categoryId: args.categoryId,
          },
        });

        return await prisma.categoriesOnSkills
          .findMany({
            include: {
              skill: true,
              category: true,
              employeeSkills: {
                include: {
                  certificate: {include: {publisher: true}},                 
                  employee: true,
                  skill: {
                    include: {
                      category: true,
                      skill: true,
                    },
                  },
                },
              },
            },
          })
          .catch(prismaErr);
      },
    });
  },
});
