import { Book, PrismaClient, User } from "@prisma/client";
import { PubSub, withFilter } from 'graphql-subscriptions';
const prisma = new PrismaClient();
const pubsub = new PubSub();

const resolvers = {
    Query: {
        hello(): String {
            return "Hello from GraphQL";
        },
        async users(): Promise<User[]> {
            return await prisma.user.findMany({});
        },
        async books(): Promise<Book[]> {
            return await prisma.book.findMany({});
        }
    },
    Book: {
        async author(book: Book): Promise<User | null> {
            return await prisma.user.findUnique({ where: { id: String(book.userId) } });
        }
    },
    User: {
        async books(user: User): Promise<Book[]> {
            return await prisma.book.findMany({ where: { userId: user.id } })
        }
    },
    Mutation: {
        async addUser(_: any, args: { name: string, email: string }): Promise<User> {
            const user = await prisma.user.create({
                data: {
                    name: args.name,
                    email: args.email
                }
            })
            pubsub.publish('USER_CREATED', {
                userCreated: user
            });
            return user;
        }
    },
    Subscription: {
        userCreated: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('USER_CREATED'),
                (payload, variables) => {
                    return (payload.userCreated.email === variables.email);
                },
            )
        }
    }
};

export default resolvers;