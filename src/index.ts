import express from 'express';
import { config } from 'dotenv';
config()

const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to API!');
})

app.listen(process.env.SERVER_PORT, () => {
    console.log(`The application is listening on port ${process.env.SERVER_PORT}!`);
})