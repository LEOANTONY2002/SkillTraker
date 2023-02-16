import { GraphQLError } from "graphql";

const formatGraphQLErrors = (error) => {
  // @ts-ignore
  const errorDetails = error.originalError?.response?.data;

  try {
    if (errorDetails) return errorDetails;
  } catch (e) {}

  if (error.message) return error.message;

  return null;
};

export default formatGraphQLErrors;
