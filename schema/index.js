import { gql } from 'apollo-server'

const typeDefs = gql`
    scalar Date
    type Post{
        id: ID!
        userName: String!
        createdAt: Date!
        text: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount : Int!
        commentCount : Int!
    }
    type Comment{
        id: ID!
        userName: String!
        createdAt: Date!
        text: String!
    }
    type Like{
        id: ID!
        userName: String!
        createdAt: Date!
    }
    input User{
        id: ID
        fname: String!
        lname: String!
        userName: String!
        email: String!
        password: String!
    }
    type Response{
        err: Boolean!
        msg: String
        token: String
    }
    type Query{
        getPosts: [Post!]!
        getPostInfo(id: ID): Post!
    }
    type Mutation{
        registerUser(input: User!): Response!
        loginUser(email: String!, password: String!): Response!
        createPost(token: String!, text: String!): Response!
        deletePost(token: String!, id: ID!): Response!
        updatePost(token: String!, id: ID!, text: String!): Response!
        createComment(token: String!, id: ID!, text: String!): Response!
        deleteComment(token: String!, post_id: ID!, comment_id: ID!): Response!
        addLike(token: String!, id: ID!): Response!
        removeLike(token: String!, id: ID!): Response!
    }
`

module.exports = { typeDefs }