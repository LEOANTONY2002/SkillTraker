import {
  extendType,
  objectType,
  stringArg,
  nonNull,
  list,
  arg,
  inputObjectType,
  booleanArg,
} from "nexus";
import { prismaErr } from "../prismaError.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";

const prisma = new PrismaClient();

export const Employee = objectType({
  name: "Employee",
  definition(t) {
    t.string("id");
    t.string("name");
    t.string("email");
    t.string("photo");
    t.list.field("employeeSkills", { type: "EmployeeSkills" });
    t.string("accessToken");
    t.field("createdAt", { type: "DateTime" });
    t.field("updatedAt", { type: "DateTime" });
    t.string("displayName");
    t.string("jobTitle");
    t.string("mobileNumber");
    t.string("department");
    t.string("location");
    t.string("division");
    t.string("manager");
    t.boolean("isAdmin");
    t.boolean("isNewEmployee");
  },
});

export const Sync = objectType({
  name: "Sync",
  definition(t) {
    t.string("id");
    t.field("lastSync", { type: "DateTime" });
    t.field("createdAt", { type: "DateTime" });
    t.field("updatedAt", { type: "DateTime" });
  }
})

export const allEmployees = extendType({
  type: "Query",
  definition(t) {
    t.list.field("employees", {
      type: "Employee",
      async resolve(_root, ctx) {
        return await prisma.employee.findMany({
          include: {
            employeeSkills: {
              include: {
                certificate: {
                  include: {
                    publisher: true,
                  },
                },
                skill: {
                  include: {
                    category: true,
                    skill: true,
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

export const searchEmployee = extendType({
  type: "Query",
  definition(t) {
    t.list.field("searchEmployee", {
      type: "Employee",
      args: {
        word: nonNull(stringArg()),
      },
      async resolve(_root, args, ctx) {
        return await prisma.employee.findMany({
          where: {
            OR: [
              {
                email: {
                  contains: args.word,
                  mode: "insensitive",
                },
                name: {
                  contains: args.word,
                  mode: "insensitive",
                },
              },
            ],
          },
          include: {
            employeeSkills: {
              include: {
                certificate: {include: {publisher: true}},                 
                skill: {
                  include: {
                    category: true,
                    skill: true,
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

export const searchEmployeeBySkill = extendType({
  type: "Query",
  definition(t) {
    t.list.field("searchEmployeeBySkill", {
      type: "Employee",
      args: {
        word: nonNull(stringArg()),
      },
      async resolve(_root, args) {
        return await prisma.employee.findMany({
          where: {
            employeeSkills: {
              some: {
                skill: {
                  skill: {
                    name: {
                      contains: args.word,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          },
          include: {
            employeeSkills: {
              include: {
                certificate: {include: {publisher: true}},                 
                skill: {
                  include: {
                    category: true,
                    skill: true,
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

export const searchEmployeeByCategory = extendType({
  type: "Query",
  definition(t) {
    t.list.field("searchEmployeeByCategory", {
      type: "Employee",
      args: {
        word: nonNull(stringArg()),
      },
      async resolve(_root, args) {
        return await prisma.employee.findMany({
          where: {
            employeeSkills: {
              some: {
                skill: {
                  category: {
                    name: {
                      contains: args.word,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          },
          include: {
            employeeSkills: {
              include: {
                certificate: {include: {publisher: true}},               
                skill: {
                  include: {
                    category: true,
                    skill: true,
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

// export const getEmployee = extendType({
//   type: "Query",
//   definition(t) {
//     t.field("employee", {
//       type: "Employee",
//       args: {
//         email: nonNull(stringArg()),
//       },
//       async resolve(_root, args, ctx) {
//         return await prisma.employee
//           .findUnique({
//             where: {
//               email: args.email,
//             },
//             include: {
//               employeeSkills: {
//                 include: {
//                   certificate: {include: {publisher: true}},                 
//                   skill: {
//                     include: {
//                       skill: true,
//                       category: true,
//                     },
//                   },
//                 },
//               },
//             },
//           })
//           .catch(prismaErr);
//       },
//     });
//   },
// });

export const allAdmins = extendType({
  type: "Query",
  definition(t) {
    t.list.field("allAdmins", {
      type: "Employee",
      async resolve() {
        return await prisma.employee.findMany({
          where: {
            isAdmin: true
          }
        })
      }
    })
  }
})

export const manageAdmin = extendType({
  type: "Mutation",
  definition(t) {
    t.list.field("manageAdmin", {
      type: "Employee",
      args: {
        email: nonNull(stringArg()),
        isAdmin: nonNull(booleanArg())
      },
      async resolve(_root, args, ctx) {
        await prisma.employee
          .update({
            where: {
              email: args.email,
            },
            data: {
              isAdmin: args.isAdmin,
            },
          })
          .catch(prismaErr);

        return await prisma.employee
          .findMany({
            where: {
              isAdmin: true
            }
          })
          .catch(prismaErr);
      },
    });
  },
})

export const lastSync = extendType({
  type: "Query",
  definition(t) {
    t.field("lastSync", {
      type: "Sync",
      async resolve() {
        return await prisma.sync.findFirst({
          orderBy: {
            id: 'asc'
          }
        })
      }
    })
  }
})

export const syncEmployeesData = extendType({
  type: "Mutation",
  definition(t) {
    t.list.field("syncEmployeesData", {
      type: "Employee",
      async resolve() {
        let currentDateTime = new Date()

        const { data } = await axios.get(
          "https://44d4dec71a54a30986f0ea0a5ddf944ae84a58ec:x@api.bamboohr.com/api/gateway.php/changecx/v1/employees/directory"
        );
        const options = {
          ignoreAttributes: true,
        };

        const parser = new XMLParser(options);
        let employees = parser.parse(data);

        employees?.directory?.employees?.employee?.map(
          async (e) => {
            await prisma.employee
              .upsert({
                where: {
                  email: e?.field[6],
                },
                update: {
                  // password: "",
                  name: e?.field[0],
                  displayName: e?.field[0],
                  jobTitle: e?.field[4],
                  mobileNumber: e?.field[5].toString(),
                  department: e?.field[7],
                  location: e?.field[8],
                  division: e?.field[9],
                  manager: e?.field[12],
                  photo: e?.field[14],
                  // isAdmin: false,
                  isNewEmployee: false
                },
                create: {
                  email: e?.field[6],
                  password: "",
                  name: e?.field[0],
                  displayName: e?.field[0],
                  jobTitle: e?.field[4],
                  mobileNumber: e?.field[5].toString(),
                  department: e?.field[7],
                  location: e?.field[8],
                  division: e?.field[9],
                  manager: e?.field[12],
                  photo: e?.field[14],
                  isAdmin: false,
                  isNewEmployee: true
                }
              })
            }
        );

        await prisma.sync.create({
          data: {
            lastSync: currentDateTime
          }
        })

        return await prisma.employee.findMany({
          include: {
            employeeSkills: {
              include: {
                certificate: {
                  include: {
                    publisher: true,
                  },
                },
                skill: {
                  include: {
                    category: true,
                    skill: true,
                  },
                },
              },
            },
          },
        });
      }
    })
  }
})

export const employeeLogin = extendType({
  type: "Mutation",
  definition(t) {
    t.field("employeeLogin", {
      type: "Employee",
      args: {
        email: nonNull(stringArg()),
      },
      async resolve(_root, args, ctx) {

        const { data } = await axios.get(
          "https://44d4dec71a54a30986f0ea0a5ddf944ae84a58ec:x@api.bamboohr.com/api/gateway.php/changecx/v1/employees/directory"
        );
        const options = {
          ignoreAttributes: true,
        };

        const parser = new XMLParser(options);
        let employees = parser.parse(data);

        let existingEmployee =
          employees?.directory?.employees?.employee?.find(
            (e) => e?.field[6] === args.email
          );

        if (existingEmployee) {
          console.log(existingEmployee);
          const accessToken = jwt.sign(
            { email: args.email },
            process.env.SECRET_TOKEN,
            { expiresIn: "10m" }
          );
          console.log(accessToken);
          const employee = await prisma.employee
          .upsert({
            where: {
              email: args.email,
            },
            update: {
              password: "",
              name: existingEmployee?.field[0],
              displayName: existingEmployee?.field[0],
              jobTitle: existingEmployee?.field[4],
              mobileNumber: existingEmployee?.field[5].toString(),
              department: existingEmployee?.field[7],
              location: existingEmployee?.field[8],
              division: existingEmployee?.field[9],
              manager: existingEmployee?.field[12],
              photo: existingEmployee?.field[14],
              isNewEmployee: true
            },
            create: {
              email: args.email,
              password: "",
              name: existingEmployee?.field[0],
              displayName: existingEmployee?.field[0],
              jobTitle: existingEmployee?.field[4],
              mobileNumber: existingEmployee?.field[5].toString(),
              department: existingEmployee?.field[7],
              location: existingEmployee?.field[8],
              division: existingEmployee?.field[9],
              manager: existingEmployee?.field[12],
              photo: existingEmployee?.field[14],
              isAdmin: false,
              isNewEmployee: true
            },
            include: {
              employeeSkills: {
                include: {
                  certificate: {
                    include: {
                      publisher: true,
                    },
                  },
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
          // .catch(prismaErr);

          console.log(employee);

          return {
            ...employee,
            accessToken,
          };

        }
        
        // const pwVerify = await bcrypt.compare(args.password, employee.password);

      },
    });
  },
});

export const employeePasswordReset = extendType({
  type: "Mutation",
  definition(t) {
    t.field("employeePasswordReset", {
      type: "Employee",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(args) {
        return await prisma.employee.update({
          where: {
            email: args.email
          },
          data: {
            password: args.password
          }
        })
      }
    })
  }
})

export const addEmployee = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addEmployee", {
      type: "Employee",
      args: {
        name: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        photo: stringArg(),
        role: stringArg(),
        isManager: booleanArg(),
      },
      async resolve(_root, args, ctx) {
        const existingEmployee = await prisma.employee.findUnique({
          where: {
            email: args.email,
          },
        });

        if (!existingEmployee) {
          // const salt = await bcrypt.genSalt(10);
          // const hash = await bcrypt.hash(args.password, salt);

          const dbEmployee = await prisma.employee
            .create({
              data: {
                name: args.name,
                email: args.email,
                password: args.password,
                photo: args.photo,
                role: args.role,
                isManager: args.isManager ?? false,
              },
              include: {
                employeeSkills: {
                  include: {
                    certificate: {include: {publisher: true}},                 
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

          if (dbEmployee) {
            const { data } = await axios.get(
              "https://44d4dec71a54a30986f0ea0a5ddf944ae84a58ec:x@api.bamboohr.com/api/gateway.php/changecx/v1/employees/directory"
            );
            const options = {
              ignoreAttributes: true,
            };

            const parser = new XMLParser(options);
            let employees = parser.parse(data);

            let existingEmployee =
              employees?.directory?.employees?.employee?.find(
                (e) => e?.field[6] === args.email
              );

            if (existingEmployee) {
              const accessToken = jwt.sign(
                { email: args.email },
                process.env.SECRET_TOKEN,
                { expiresIn: "10m" }
              );

              let employee = {
                ...dbEmployee,
                displayName: existingEmployee?.field[0],
                jobTitle: existingEmployee?.field[4],
                mobileNumber: existingEmployee?.field[5],
                department: existingEmployee?.field[7],
                location: existingEmployee?.field[8],
                division: existingEmployee?.field[9],
                manager: existingEmployee?.field[12],
                photo: existingEmployee?.field[14],
              };

              return {
                ...employee,
                accessToken,
              };
            }
            // else return "Invalid Credentials";
          }
        }
        return {};
      },
    });
  },
});

export const editEmployee = extendType({
  type: "Mutation",
  definition(t) {
    t.field("editEmployee", {
      type: "Employee",
      args: {
        id: nonNull(stringArg()),
        name: nonNull(stringArg()),
        email: nonNull(stringArg()),
        photo: stringArg(),
      },
      async resolve(_root, args, ctx) {
        await prisma.employee
          .update({
            where: {
              id: args.id,
            },
            data: {
              name: args.name ?? "",
              photo: args.photo,
            },
          })
          .catch(prismaErr);

        return await prisma.employee
          .findUnique({
            where: {
              id: args.id,
            },
            include: {
              employeeSkills: {
                include: {
                  certificate: {
                    include: {
                      publisher: true
                    }
                  },
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

// export const deleteEmployee = extendType({
//   type: "Mutation",
//   definition(t) {
//     t.field("deleteEmployee", {
//       type: "Employee",
//       args: {
//         id: nonNull(stringArg()),
//       },
//       async resolve(_root, args, ctx) {
//         return await prisma.employee
//           .delete({
//             where: {
//               id: args.id,
//             },
//           })
//           .catch(prismaErr);
//       },
//     });
//   },
// });
