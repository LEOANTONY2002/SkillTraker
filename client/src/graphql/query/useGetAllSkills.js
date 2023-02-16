import { gql, useQuery } from "@apollo/client";

const GET_ALL_SKILLS = gql`
        query AllCOS {
            allCOS {
                id
                skillId
                skill {
                    id
                name
                }
                category {
                name
                }
                employeeSkills {
                id
                level
                employee {
                    name
                    email
                    role
                }
                certificate {
                    name
                    publisher
                    expiry
                }
                }
            }
        }
    `;


export const useGetAllSkills = () => {
    const { loading, data, error } = useQuery(GET_ALL_SKILLS);
    let skills = data?.allCOS
    return { loading, skills, error }
}