import { arg, extendType, nonNull, objectType, stringArg } from "nexus";
import { PrismaClient } from "@prisma/client";
import { prismaErr } from "../prismaError.js";

const prisma = new PrismaClient();

export const CategoriesOnSkills = objectType({
  name: "CategoriesOnSkills",
  definition(t) {
    t.string("id");
    t.field("skill", { type: "Skills" });
    t.string("skillId");
    t.field("category", {
      type: "Categories",
    });
    t.string("categoryId");
    t.list.field("employeeSkills", { type: "EmployeeSkills" });
    t.field("createdAt", { type: "DateTime" });
    t.field("updatedAt", { type: "DateTime" });
  },
});

export const allCOS = extendType({
  type: "Query",
  definition(t) {
    t.list.field("allCOS", {
      type: "CategoriesOnSkills",
      async resolve(_root, args, ctx) {
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

export const cos = extendType({
  type: "Query",
  definition(t) {
    t.list.field("cos", {
      type: "CategoriesOnSkills",
      args: {
        skillId: nonNull(stringArg()),
      },
      async resolve(_root, args) {
        return await prisma.categoriesOnSkills.findMany({
          where: {
            skillId: args.skillId,
          },
          include: {
            skill: true,
            category: true,
          },
        });
      },
    });
  },
});

export const addSkill = extendType({
  type: "Mutation",
  definition(t) {
    t.list.field("addSkill", {
      type: "CategoriesOnSkills",
      args: {
        name: nonNull(stringArg()),
        categoryId: nonNull(stringArg()),
      },
      async resolve(_root, args) {
        await prisma.categoriesOnSkills
          .create({
            // where:{
            //   categoryId:
            // },
            data: {
              category: {
                connect: {
                  id: args.categoryId,
                },
              },
              skill: {
                connectOrCreate: {
                  where: {
                    name: args.name,
                  },
                  create: {
                    name: args.name,
                  },
                },
              },
            }
          })
          .catch(prismaErr);

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

export const deleteSkill = extendType({
  type: "Mutation",
  definition(t) {
    t.list.field("deleteSkill", {
      type: "CategoriesOnSkills",
      args: {
        id: nonNull(stringArg()),
        coskillId: nonNull(stringArg()),
      },
      async resolve(_root, args) {
        await prisma.categoriesOnSkills.delete({
          where: {
            id: args.coskillId,
          },
        });

        // await prisma.skills
        //   .delete({
        //     where: {
        //       id: args.id,
        //     },
        //   })
        //   .catch(prismaErr);

        return await prisma.categoriesOnSkills
          .findMany({
            include: {
              skill: true,
              category: true,
              employeeSkills: {
                include: {
                  certificate: {include: {publisher: true}
                    
},                 
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

export const searchSkill = extendType({
  type: "Query",
  definition(t) {
    t.list.field("searchSkill", {
      type: "CategoriesOnSkills",
      args: {
        word: nonNull(stringArg()),
      },
      async resolve(_root, args) {
        return await prisma.categoriesOnSkills
          .findMany({
            where: {
              skill: {
                name: {
                  contains: args.word,
                  mode: "insensitive",
                },
              },
            },
            include: {
              employeeSkills: {
                include: {
                  certificate: {include: {publisher: true}
                    
},                 
                  skill: true,
                  employee: true,
                },
              },
              category: true,
              skill: true,
            },
          })
          .catch(prismaErr);
      },
    });
  },
});
