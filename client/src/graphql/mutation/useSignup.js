import { gql, useMutation } from "@apollo/client";

const LOGIN = gql`
        mutation AddEmployee($name: String!, $email: String!, $password: String!) {
            addEmployee(name: $name, email: $email, password: $password) {
                id
                name
                email
                photo
                role
                isManager
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
                createdAt
                updatedAt
            }
            }   
    `;


export const useSignup= () => {
    const [signup, { loading, data, error }] = useMutation(LOGIN);
    return { signup, loading, data, error }
}