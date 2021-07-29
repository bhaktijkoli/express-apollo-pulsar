const resolvers = {
    Query: {
        hello(): String {
            return "Hello from GraphQL";
        },
    }
};

export default resolvers;