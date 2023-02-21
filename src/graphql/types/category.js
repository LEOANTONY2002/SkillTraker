import { extendType, nonNull, objectType, stringArg } from "nexus";
import { prismaErr } from "../prismaError.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const Categories = objectType({
  name: "Categories",
  definition(t) {
    t.string("id");
    t.string("name");
    t.list.field("skills", { type: "CategoriesOnSkills" });
    t.field("createdAt", { type: "DateTime" });
    t.field("updatedAt", { type: "DateTime" });
  },
});

export const allCategories = extendType({
  type: "Query",
  definition(t) {
    t.list.field("categories", {
      type: "Categories",
      async resolve(_root, args) {
        return await prisma.categories.findMany({
          orderBy: {
            skills: {
              _count: 'desc'
            }
          },
          include: {
            skills: {
              include: {
                category: true,
                skill: true,
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
            },
          },
        });
      },
    });
  },
});

export const getCategory = extendType({
  type: "Query",
  definition(t) {
    t.field("category", {
      type: "Categories",
      args: {
        id: nonNull(stringArg()),
      },
      async resolve(_root, args) {
        return await prisma.categories
          .findUnique({
            where: {
              id: args.id,
            },
            include: {
              skills: {
                include: {
                  category: true,
                  skill: true,
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
              },
            },
          })
          .catch(prismaErr);
      },
    });
  },
});

export const addCategory = extendType({
  type: "Mutation",
  definition(t) {
    t.list.field("addCategory", {
      type: "Categories",
      args: {
        id: stringArg(),
        name: nonNull(stringArg()),
      },
      async resolve(_root, args) {
        await prisma.categories
          .upsert({
            where: {
              id: args.id ?? "",
            },
            update: {
              name: args.name,
            },
            create: {
              name: args.name,
            },
          })
          .catch(prismaErr);

        return await prisma.categories.findMany({
          include: {
            skills: {
              include: {
                category: true,
                skill: true,
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
            },
          },
        });
      },
    });
  },
});

export const editCategory = extendType({
  type: "Mutation",
  definition(t) {
    t.field("editCategory", {
      type: "Categories",
      args: {
        id: nonNull(stringArg()),
        name: stringArg(),
      },
      async resolve(_root, args) {
        return await prisma.categories
          .update({
            where: {
              id: args.id ?? "",
            },
            data: {
              name: args.name ?? "",
            },
          })
          .catch(prismaErr);
      },
    });
  },
});

export const deleteCategory = extendType({
  type: "Mutation",
  definition(t) {
    t.list.field("deleteCategory", {
      type: "Categories",
      args: {
        id: nonNull(stringArg()),
      },
      async resolve(_root, args) {
        await prisma.categories
          .delete({
            where: {
              id: args.id,
            },
          })
          .catch(prismaErr);

        return await prisma.categories.findMany({
          include: {
            skills: {
              include: {
                category: true,
                skill: true,
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
            },
          },
        });
      },
    });
  },
});

export const searchCategory = extendType({
  type: "Query",
  definition(t) {
    t.list.field("searchCategory", {
      type: "Categories",
      args: {
        word: nonNull(stringArg()),
      },
      async resolve(_root, args) {
        return await prisma.categories
          .findMany({
            where: {
              name: {
                contains: args.word,
                mode: "insensitive",
              },
            },
            include: {
              skills: {
                include: {
                  category: true,
                  skill: true,
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
              },
            },
          })
          .catch(prismaErr);
      },
    });
  },
});
