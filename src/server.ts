import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';

const app = express();
app.use(cors());
app.use(express.json());

app.listen(env.PORT || 5000, ()=>{
    console.log(`Itineris api working on PORT: ${process.env.PORT}`)
})