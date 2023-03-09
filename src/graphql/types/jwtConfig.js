import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken'

export const resolveJwtToken = async (token) => {
    try {
      console.log(token);
      const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
      console.log("DECODED", decoded);
      if (decoded?.employeeId) {
        return decoded?.employeeId;
      } else throw new GraphQLError('User is not authenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      }})
    } catch (err) {
      console.log(err);
      throw new GraphQLError('User is not authenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      }})
    }
  };