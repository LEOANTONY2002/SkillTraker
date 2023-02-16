import { gql, useQuery } from "@apollo/client";

const GET_ALL_CATEGORIES = gql`
        query Categories {
            categories {
                id
                name
                skills {
                id
                skill {
                    name
                }
                employeeSkills {
                    id
                    level
                    employee {
                    name
                    email
                    }
                    certificate {
                    name
                    publisher
                    }
                }
                }
            }
        }
    `;


export const useGetAllCategories = () => {
    const { loading, data, error } = useQuery(GET_ALL_CATEGORIES);
    let categories = data?.categories
    return { loading, categories, error }
}