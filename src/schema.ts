import { gql } from 'apollo-server-express';

const typeDefs = gql`
    type User {
        id: ID
        name: String
        email: String
        createdAt: String
        updatedAt: String
        books: [Book]!
    }
    type Book {
        id: ID
        name: String
        author: User!
    }
    type Query {
        books: [Book]!
        users: [User]!
        hello: String!
    }
`;

export default typeDefs