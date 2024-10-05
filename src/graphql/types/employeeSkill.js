import { extendType, nonNull, objectType, stringArg } from "nexus";
import { PrismaClient } from "@prisma/client";
import { prismaErr } from "../prismaError.js";
import cosineSimilarity from "cosine-similarity";

const prisma = new PrismaClient();

export const EmployeeSkills = objectType({
  name: "EmployeeSkills",
  definition(t) {
    t.string("id");
    t.field("employee", { type: "Employee" });
    t.string("employeeId");
    t.field("skill", { type: "CategoriesOnSkills" });
    t.string("skillId");
    t.field("certificate", { type: "Certificates" });
    t.string("level");
    t.list.string("updateLog");
    t.field("createdAt", { type: "DateTime" });
    t.field("updatedAt", { type: "DateTime" });
  },
});

// export const allEmployeeSkills = extendType({
//   type: "Query",
//   definition(t) {
//     t.list.field("employeeSkills", {
//       type: "EmployeeSkills",
//       async resolve(_root, args, ctx) {
//         return await prisma.employeeSkills.findMany({
//           // include: {
//           //   certificate: {include: {publisher: true}},
//           //   skill: {
//           //     include: {
//           //       skill: true,
//           //       category: true,
//           //     },
//           //   },
//           // },
//         });
//       },
//     });
//   },
// });

// export const getEmployeeSkills = extendType({
//   type: "Query",
//   definition(t) {
//     t.list.field("employeeSkill", {
//       type: "EmployeeSkills",
//       args: {
//         employeeId: nonNull(stringArg()),
//       },
//       async resolve(_root, args) {
//         return await prisma.employeeSkills.findMany({
//           where: {
//             employeeId: args.employeeId,
//           },
//           include: {
//             certificate: {include: {publisher: true}},
//             skill: {
//               include: {
//                 skill: true,
//                 category: true,
//               },
//             },
//             employee: true,
//           },
//         });
//       },
//     });
//   },
// });

export const addEmployeeSkill = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addEmployeeSkill", {
      type: "Employee",
      args: {
        id: stringArg(),
        employeeId: nonNull(stringArg()),
        coskillId: nonNull(stringArg()),
        level: nonNull(stringArg()),
      },
      async resolve(_root, args, ctx) {
        try {
          await prisma.employeeSkills
            .upsert({
              where: {
                id: args.id ?? "",
              },
              create: {
                employeeId: args.employeeId,
                skillId: args.coskillId,
                level: args.level,
              },
              update: {
                employeeId: args.employeeId,
                skillId: args.coskillId,
                level: args.level,
              },
            })
            .catch(prismaErr);

          return await prisma.employee
            .findUniqueOrThrow({
              where: {
                id: args.employeeId,
              },
              include: {
                employeeSkills: {
                  include: {
                    certificate: { include: { publisher: true } },
                    skill: {
                      include: {
                        skill: true,
                        category: true,
                      },
                    },
                  },
                },
              },
            })
            .catch(prismaErr);
        } catch (err) {
          console.log(err);
        }
      },
    });
  },
});

export const deleteEmployeeSkills = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteEmployeeSkill", {
      type: "Employee",
      args: {
        employeeId: nonNull(stringArg()),
        eskillId: nonNull(stringArg()),
      },
      async resolve(_root, args) {
        await prisma.employeeSkills
          .delete({
            where: {
              id: args.eskillId,
            },
          })
          .catch(prismaErr);
        return await prisma.employee
          .findUniqueOrThrow({
            where: {
              id: args.employeeId,
            },
            include: {
              employeeSkills: {
                include: {
                  certificate: { include: { publisher: true } },
                  skill: {
                    include: {
                      skill: true,
                      category: true,
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

// export const recommendedSkills = extendType({
//   type: "Mutation",
//   definition(t) {
//     t.field("recommendedSkills", {
//       type: "JSON",
//       args: {
//         id: stringArg(),
//         employeeId: nonNull(stringArg()),
//         coskillId: nonNull(stringArg()),
//         level: nonNull(stringArg()),
//       },
//       async resolve(_root, args, ctx) {
//         try {
//           const allcos = await prisma.categoriesOnSkills
//             .findMany({
//               orderBy: {
//                 employeeSkills: {
//                   _count: "desc",
//                 },
//               },
//               include: {
//                 skill: true,
//                 category: true,
//               },
//             })
//             .catch(prismaErr);

//           await prisma.employeeSkills
//             .upsert({
//               where: {
//                 id: args.id ?? "",
//               },
//               create: {
//                 employeeId: args.employeeId,
//                 skillId: args.coskillId,
//                 level: args.level,
//               },
//               update: {
//                 employeeId: args.employeeId,
//                 skillId: args.coskillId,
//                 level: args.level,
//               },
//             })
//             .catch(prismaErr);

//           // function calculateCosineSimilarity(skillSet1, skillSet2) {
//           //   const vector1 = allSkills.map((skill) =>
//           //     skillSet1.includes(skill) ? 1 : 0
//           //   );
//           //   const vector2 = allSkills.map((skill) =>
//           //     skillSet2.includes(skill) ? 1 : 0
//           //   );
//           //   return cosineSimilarity(vector1, vector2);
//           // }

//           // function recommendSkills(employeeSkills, allSkills) {
//           //   const recommendations = allSkills
//           //     .filter((skill) => !employeeSkills.includes(skill))
//           //     .map((skill) => ({
//           //       skill,
//           //       similarity: calculateCosineSimilarity(employeeSkills, [skill]),
//           //     }))
//           //     .sort((a, b) => b.similarity - a.similarity);

//           //   return recommendations.map((rec) => rec.skill);
//           // }

//           // const recommendedSkills = await recommendSkills(
//           //   employeeSkills,
//           //   allSkills
//           // );
//           // console.log(recommendedSkills);

//           const updatedEmployee = await prisma.employee
//             .findUniqueOrThrow({
//               where: {
//                 id: args.employeeId,
//               },
//               include: {
//                 employeeSkills: {
//                   include: {
//                     certificate: { include: { publisher: true } },
//                     skill: {
//                       include: {
//                         skill: true,
//                         category: true,
//                       },
//                     },
//                   },
//                 },
//               },
//             })
//             .catch(prismaErr);

//           // const allSkills = allcos?.allCOS?.map((cos) => cos?.skill?.name);
//           // console.log("ALL", allSkills);

//           // const employeeSkills =
//           //   updatedEmployee?.data?.employee?.employeeSkills?.map(
//           //     (es) => es?.skill?.skill?.name
//           //   );
//           // console.log("ES", employeeSkills);

//           return {
//             ...updatedEmployee,
//           };
//         } catch (err) {
//           console.log(err);
//         }
//       },
//     });
//   },
// });
