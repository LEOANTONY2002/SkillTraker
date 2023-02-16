import { gql, useLazyQuery } from "@apollo/client";

const GET_EMPLOYEE_SKILLS = gql`
        query EmployeeSkill($employeeId: String!) {
            employeeSkill(employeeId: $employeeId) {
                id
                employee {
                id
                name
                email
                photo
                role
                isManager
                }
                skill {
                skill {
                    id
                    name
                }
                category {
                    id
                    name
                }
                categoryId
                }
                level
                skillId
                employeeId
            }
            
            }
    `;


export const useGetAllSkills = () => {
    const [employeeSkills, { loading, data, error }] = useLazyQuery(GET_EMPLOYEE_SKILLS);
    employeeSkills = data?.employeeSkills
    return { loading, employeeSkills, error }
}