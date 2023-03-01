import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken'

export const resolveJwtToken = async (token) => {
    try {
      const decoded = await jwt.verify(token, process.env.SECRET_TOKEN);
      if (decoded.employeeId) {
        return decoded.employeeId;
      } else throw new GraphQLError('User is not authenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      }})
    } catch (err) {
      throw new GraphQLError('User is not authenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      }})
    }
  };