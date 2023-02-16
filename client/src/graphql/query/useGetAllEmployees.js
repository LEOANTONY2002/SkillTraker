import { gql, useQuery } from "@apollo/client";

const GET_ALL_EMPLOYEES = gql`
        query Employees {
            employees {
                id
                name
                email
                photo
                role
                isManager
                employeeSkills {
                certificate {
                    id
                    name
                    publisher
                    expiry
                    photo
                    employeeSkillId
                    updateLog
                    createdAt
                    updatedAt
                }
                createdAt
                id
                level
                skillId
                updatedAt
                skill {
                    id
                    createdAt
                    categoryId
                    skillId
                    updatedAt
                    skill {
                    id
                    name
                    createdAt
                    updatedAt
                    }
                    category {
                    id
                    name
                    createdAt
                    updatedAt
                    }
                }
                }
                createdAt
                updatedAt
            }
        }
    `;


export const useGetAllEmployees = () => {
    const { loading, data, error } = useQuery(GET_ALL_EMPLOYEES);
    let employees = data?.employees
    return { loading, employees, error }
}