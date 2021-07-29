import { Book, PrismaClient, User } from "@prisma/client";
const prisma = new PrismaClient();

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
    }
};

export default resolvers;