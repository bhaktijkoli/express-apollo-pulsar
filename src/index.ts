import express from 'express';
import { config } from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './schema';
import resolvers from './resolvers';
config()

async function startServer() {
    const port = Number(process.env.SERVER_PORT);
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();

    const app = express();
    server.applyMiddleware({ app });

    await new Promise<void>((resolve: () => void) => app.listen({ port }, resolve));
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
    return { server, app };
}

startServer();