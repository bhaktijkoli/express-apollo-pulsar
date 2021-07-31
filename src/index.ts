import express from 'express';
import { config } from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';

import typeDefs from './schema';
import resolvers from './resolvers';
config()

async function startServer() {
    const port = Number(process.env.SERVER_PORT);

    const app = express();
    const httpServer = createServer(app);
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    const server = new ApolloServer({ schema });

    const subscriptionServer = SubscriptionServer.create({
        schema,
        execute,
        subscribe,
    }, {
        server: httpServer,
        path: server.graphqlPath,
    });
    ['SIGINT', 'SIGTERM'].forEach(signal => {
        process.on(signal, () => subscriptionServer.close());
    });

    await server.start();
    server.applyMiddleware({ app });

    await new Promise<void>((resolve: () => void) => httpServer.listen({ port }, resolve));
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
    console.log(`🚀 Subscription endpoint ready at ws://localhost:${port}${server.graphqlPath}`);
    return { server, app };
}

startServer();