import {
  extendType,
  objectType,
  stringArg,
  nonNull,
  list,
  arg,
  inputObjectType,
  booleanArg,
  subscriptionType,
} from "nexus";
import { prismaErr } from "../prismaError.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { PubSub } from "graphql-subscriptions";
import { mailToPasswordChange } from "../../../mail/index.js";
import { GraphQLError } from "graphql";

const prisma = new PrismaClient();
const pubsub = new PubSub();

pubsub.publish("SYNC", {
  sync: {},
});

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
  },
});

export const sub = subscriptionType({
  definition(t) {
    t.string("jwt", {
      subscribe() {
        return (async function* () {
          const accessToken = jwt.sign(
            { email: "args.email" },
            process.env.SECRET_TOKEN,
            { expiresIn: "24h" }
          );
          yield accessToken;
        })();
      },
      resolve(eventData) {
        return eventData;
      },
    });
  },
});

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
                certificate: { include: { publisher: true } },
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
                certificate: { include: { publisher: true } },
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
                certificate: { include: { publisher: true } },
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

export const getEmployee = extendType({
  type: "Query",
  definition(t) {
    t.field("employee", {
      type: "Employee",
      args: {
        email: nonNull(stringArg()),
      },
      async resolve(_root, args, ctx) {
        return await prisma.employee
          .findUnique({
            where: {
              email: args.email,
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

export const allAdmins = extendType({
  type: "Query",
  definition(t) {
    t.list.field("allAdmins", {
      type: "Employee",
      async resolve() {
        return await prisma.employee.findMany({
          where: {
            isAdmin: true,
          },
        });
      },
    });
  },
});

export const manageAdmin = extendType({
  type: "Mutation",
  definition(t) {
    t.list.field("manageAdmin", {
      type: "Employee",
      args: {
        email: nonNull(stringArg()),
        isAdmin: nonNull(booleanArg()),
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
              isAdmin: true,
            },
          })
          .catch(prismaErr);
      },
    });
  },
});

export const lastSync = extendType({
  type: "Query",
  definition(t) {
    t.field("lastSync", {
      type: "Sync",
      async resolve() {
        return await prisma.sync.findFirst({
          orderBy: {
            id: "desc",
          },
        });
      },
    });
  },
});

export const syncEmployeesData = extendType({
  type: "Mutation",
  definition(t) {
    t.list.field("syncEmployeesData", {
      type: "Employee",
      async resolve() {
        let currentDateTime = new Date();

        const { data } = await axios.get(
          "https://44d4dec71a54a30986f0ea0a5ddf944ae84a58ec:x@api.bamboohr.com/api/gateway.php/changecx/v1/employees/directory"
        );
        const options = {
          ignoreAttributes: true,
        };

        const parser = new XMLParser(options);
        let employees = parser.parse(data);

        console.log(employees);

        await employees?.directory?.employees?.employee?.map(
          async (e, index) => {
            const password = uuidv4();
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            e?.field[6] === "leo.antony@changecx.com" &&
              mailToPasswordChange(
                "leo.antony@changecx.com",
                e?.field[0],
                password
              );

            // let emp = await prisma.employee.findUnique({ where: {email: e?.field[6]}, include: {employeeSkills: {include: {employee: true}}}})
            // if (emp) {
            //   if (emp.employeeSkills?.length === 0) {
            //     await prisma.employee.delete({where: {id: emp?.id}})
            //   }
            // }
            // console.log("UPDATE", index);
            await prisma.employee
              .upsert({
                where: {
                  email: e?.field[6],
                },
                update: {
                  name: e?.field[0],
                  displayName: e?.field[0],
                  jobTitle: e?.field[4],
                  mobileNumber: e?.field[5].toString(),
                  department: e?.field[7],
                  location: e?.field[8],
                  division: e?.field[9],
                  manager: e?.field[12],
                  photo: e?.field[14],
                },
                create: {
                  email: e?.field[6],
                  password: hash,
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
                  isNewEmployee: true,
                },
              })
              .catch(prismaErr);
            // console.log("UPDATED", index);
          }
        );

        await mailToPasswordChange(
          "leo.antony@changecx.com",
          createdEmployee?.name,
          "password"
        );

        console.log("SYNC");
        await prisma.sync.create({
          data: {
            lastSync: currentDateTime,
          },
        });

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

export const activateAccount = extendType({
  type: "Mutation",
  definition(t) {
    t.field("activateAccount", {
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

        let existingEmployee = employees?.directory?.employees?.employee?.find(
          (e) => e?.field[6] === args.email
        );

        if (existingEmployee) {
          const registeredEmployee = await prisma.employee.findUnique({
            where: {
              email: args.email,
            },
          });

          if (!registeredEmployee || registeredEmployee?.isNewEmployee) {
            const password = uuidv4();
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            const employee = await prisma.employee
              .upsert({
                where: {
                  email: args.email,
                },
                update: {
                  password: hash,
                },
                create: {
                  email: args.email,
                  password: hash,
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
                  isNewEmployee: true,
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
              .catch(prismaErr);
            await mailToPasswordChange(
              existingEmployee?.field[6],
              existingEmployee?.field[0],
              password
            );
            return employee;
          } else {
            throw new Error("Account has already been activeted!");
          }
        } else {
          throw new Error("Email is not valid organization ID");
        }
      },
    });
  },
});

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

        let bambooEmployee =
          await employees?.directory?.employees?.employee?.find(
            (e) => e?.field[6] === args.email
          );

        if (bambooEmployee) {
          await prisma.employee
            .upsert({
              where: {
                email: bambooEmployee?.field[6],
              },
              update: {
                name: bambooEmployee?.field[0],
                displayName: bambooEmployee?.field[0],
                jobTitle: bambooEmployee?.field[4],
                mobileNumber: bambooEmployee?.field[5].toString(),
                department: bambooEmployee?.field[7],
                location: bambooEmployee?.field[8],
                division: bambooEmployee?.field[9],
                manager: bambooEmployee?.field[12],
                photo: bambooEmployee?.field[14],
              },
              create: {
                email: bambooEmployee?.field[6],
                name: bambooEmployee?.field[0],
                password: "",
                displayName: bambooEmployee?.field[0],
                jobTitle: bambooEmployee?.field[4],
                mobileNumber: bambooEmployee?.field[5].toString(),
                department: bambooEmployee?.field[7],
                location: bambooEmployee?.field[8],
                division: bambooEmployee?.field[9],
                manager: bambooEmployee?.field[12],
                photo: bambooEmployee?.field[14],
                isAdmin: false,
                isNewEmployee: true,
              },
            })
            .catch(prismaErr);

          return await prisma.employee.findUnique({
            where: {
              email: args.email,
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
                      category: true,
                      skill: true,
                    },
                  },
                },
              },
            },
          });
        } else throw new Error("Use correct organisational email!");
      },
    });
  },
});

export const employeeLoginWithPassword = extendType({
  type: "Mutation",
  definition(t) {
    t.field("employeeLoginWithPassword", {
      type: "Employee",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_root, args) {
        const employee = await prisma.employee
          .findUnique({
            where: {
              email: args.email,
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
          .catch(prismaErr);

        if (employee) {
          const pwVerify = await bcrypt.compare(
            args.password,
            employee.password
          );

          if (pwVerify) {
            const accessToken = jwt.sign(
              { employeeId: employee?.id },
              process.env.SECRET_TOKEN,
              { expiresIn: "24h" }
            );

            return {
              ...employee,
              accessToken,
            };
          } else throw new Error("Invalid credentials!");
        } else throw new Error("Email does not exist!");
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
        id: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(root, args) {
        let pw = args?.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(pw, salt);
        return await prisma.employee.update({
          where: {
            id: args.id,
          },
          data: {
            password: hash,
            isNewEmployee: false,
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
        });
      },
    });
  },
});

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
        jobTitle: stringArg(),
      },
      async resolve(_root, args, ctx) {
        const existingEmployee = await prisma.employee.findUnique({
          where: {
            email: args.email,
          },
        });

        if (!existingEmployee) {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(args.password, salt);

          const dbEmployee = await prisma.employee
            .create({
              data: {
                name: args.name,
                email: args.email,
                password: hash,
                photo: args.photo,
                jobTitle: args.jobTitle,
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

          if (dbEmployee) {
            const accessToken = jwt.sign(
              { email: args.email },
              process.env.SECRET_TOKEN,
              { expiresIn: "24h" }
            );

            return {
              ...dbEmployee,
              accessToken,
            };
          }
        } else throw new Error("Employee already exists!");
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
          .catch(prismaErr);
      },
    });
  },
});

export const deleteEmployee = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteEmployee", {
      type: "Employee",
      args: {
        id: nonNull(stringArg()),
      },
      async resolve(_root, args, ctx) {
        return await prisma.employee
          .delete({
            where: {
              id: args.id,
            },
          })
          .catch(prismaErr);
      },
    });
  },
});

export const deleteAllEmployees = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteAllEmployees", {
      type: "Employee",
      async resolve(_root, args, ctx) {
        return await prisma.employee.deleteMany({}).catch(prismaErr);
      },
    });
  },
});

// const password = uuidv4();
// const salt = await bcrypt.genSalt(10);
// const hash = await bcrypt.hash(password, salt);

// await prisma.employee
//   .upsert({
//     where: {
//       email: e?.field[6],
//     },
//     update: {
//       name: e?.field[0],
//       displayName: e?.field[0],
//       jobTitle: e?.field[4],
//       mobileNumber: e?.field[5].toString(),
//       department: e?.field[7],
//       location: e?.field[8],
//       division: e?.field[9],
//       manager: e?.field[12],
//       photo: e?.field[14],
//     },
//     create: {
//       email: e?.field[6],
//       password: hash,
//       name: e?.field[0],
//       displayName: e?.field[0],
//       jobTitle: e?.field[4],
//       mobileNumber: e?.field[5].toString(),
//       department: e?.field[7],
//       location: e?.field[8],
//       division: e?.field[9],
//       manager: e?.field[12],
//       photo: e?.field[14],
//       isAdmin: false,
//       isNewEmployee: true
//     }
//   }).catch(prismaErr)

// const employee = await prisma.employee.findUnique({where: {email: e?.field[6]}})
// if (employee) {
//   console.log("UPDATE", index)
//     await prisma.employee.update({
//     where: {
//       email: e?.field[6],
//     },
//     data: {
//       name: e?.field[0],
//       displayName: e?.field[0],
//       jobTitle: e?.field[4],
//       mobileNumber: e?.field[5].toString(),
//       department: e?.field[7],
//       location: e?.field[8],
//       division: e?.field[9],
//       manager: e?.field[12],
//       photo: e?.field[14],
//     },
//   }).catch(prismaErr)
//   console.log("UPDATED", index)
// } else {
//   console.log("CREATE", index)
//   const password = uuidv4();
//   const salt = await bcrypt.genSalt(10);
//   const hash = await bcrypt.hash(password, salt);
//   const createdEmployee = await prisma.employee.create({
//     data: {
//       email: e?.field[6],
//       password: hash,
//       name: e?.field[0],
//       displayName: e?.field[0],
//       jobTitle: e?.field[4],
//       mobileNumber: e?.field[5].toString(),
//       department: e?.field[7],
//       location: e?.field[8],
//       division: e?.field[9],
//       manager: e?.field[12],
//       photo: e?.field[14],
//       isAdmin: false,
//       isNewEmployee: true
//     },
//   })
//   // await mailToPasswordChange("leo.antony@changecx.com", createdEmployee?.name, password)
// }
