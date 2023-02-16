import { gql, useMutation } from "@apollo/client";

const GET_EMPLOYEE = gql`
        mutation Mutation($email: String!, $password: String!){
            employeeLogin(email: $email, password :$password) {
                email
                name
                photo
                role
                id
                employeeSkills {
                    id
                    employeeId
                    level
                    skill {
                        skill {
                        name
                        id
                        }
                        category {
                        name
                        id
                        }
                    }
                    certificate {
                        id
                        name
                        photo
                        publisher
                        expiry
                        createdAt
                        updatedAt
                    }
                }
            }
        }
    `;


export const useLogin = () => {
    const [login, { loading, data, error }] = useMutation(GET_EMPLOYEE);
    return { login, loading, data, error }
}