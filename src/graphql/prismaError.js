import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/index.js";

export const prismaErr = (err) => {
  if (err instanceof PrismaClientKnownRequestError) {
    throw new Error(err.message);
  }
  if (err instanceof PrismaClientUnknownRequestError) {
    throw new Error(err.message);
  }
  return Promise.reject("Invalid Connection");
};
