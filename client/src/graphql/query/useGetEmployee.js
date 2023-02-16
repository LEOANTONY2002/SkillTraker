import { gql, useLazyQuery } from "@apollo/client";

const GET_EMPLOYEE = gql`
        query Employee($email: String!) {
            employee(email: $email) {
                email
                name
                photo
                role
                id
                employeeSkills {
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


export const useGetEmployee = () => {
    const [getEmployee, { loading, data, error }] = useLazyQuery(GET_EMPLOYEE);
    return { getEmployee, loading, data, error }
}