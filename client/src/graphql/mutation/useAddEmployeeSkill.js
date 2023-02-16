import { gql, useMutation } from "@apollo/client";

const ADD_EMPLOYEE_SKILL = gql`
        mutation AddEmployeeSkill($employeeId: String!, $coskillId: String!, $level: String!) {
            addEmployeeSkill(employeeId: $employeeId, coskillId: $coskillId, level: $level) {
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


export const useAddEmployeeSkill = () => {
    const [esAdd, { loading, data, error }] = useMutation(ADD_EMPLOYEE_SKILL);
    return { esAdd, loading, data, error }
}