import { PrismaClient, User } from '@prisma/client'
import faker from 'faker';
import sample from 'lodash.sample';
const prisma = new PrismaClient()
const MAX_USERS = 10;
const MAX_BOOKS = 100;


async function start() {
    const users: User[] = [];
    for (let i = 0; i < MAX_USERS; i++) {
        users.push(await prisma.user.create({
            data: {
                name: faker.name.findName(),
                email: faker.internet.email(),
            }
        }))
    }
    for (let i = 0; i < MAX_BOOKS; i++) {
        await prisma.book.create({
            data: {
                name: faker.commerce.productName(),
                userId: sample(users)?.id
            }
        })
    }
    console.log(`Created ${MAX_USERS} users and ${MAX_BOOKS} books.`);
    process.exit();
}

start();