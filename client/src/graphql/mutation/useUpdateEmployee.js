import { gql, useMutation } from "@apollo/client";

export const UPDATE_EMPLOYEE = gql`
        mutation Mutation($id: String!, $email: String!, $name: String!, $photo: String!){
            editEmployee(id: $id, email: $email, name: $name, photo: $photo) {
                id
                name
                email
                photo
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


export const useUpdateEmployees = () => {
    const [updateEmployee, { loading, data, error }] = useMutation(UPDATE_EMPLOYEE);
    return { updateEmployee, loading, data, error }
}