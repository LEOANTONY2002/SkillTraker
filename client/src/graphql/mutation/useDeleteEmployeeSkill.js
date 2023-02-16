import { gql, useMutation } from "@apollo/client";

const DELETE_EMPLOYEE_SKILL = gql`
        mutation DeleteEmployeeSkill($employeeId: String!, $eskillId: String!) {
            deleteEmployeeSkill(employeeId: $employeeId, eskillId: $eskillId) {
                email
                id
                isManager
                name
                photo
                role
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


export const useDeleteEmployeeSkill = () => {
    const [esDelete, { loading, data, error }] = useMutation(DELETE_EMPLOYEE_SKILL);
    return { esDelete, loading, data, error }
}