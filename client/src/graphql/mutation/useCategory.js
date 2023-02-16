import { gql, useMutation } from "@apollo/client";

export const ADD_CATEGORY = gql`
    mutation Mutation($name: String!, $id: String) {
        addCategory(name: $name, id: $id) {
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


export const DELETE_CATEGORY = gql`
    mutation Mutation($id: String!) {
        deleteCategory(id: $id) {
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


export const useAddCategory = () => {
    const [addCategory, { loading, data, error }] = useMutation(ADD_CATEGORY);
    return { addCategory, loading, data, error }
}


export const useDeleteCategory = () => {
    const [deleteCategory, { loading, data, error }] = useMutation(DELETE_CATEGORY);
    return { deleteCategory, loading, data, error }
}
