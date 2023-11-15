import { createClient } from '@supabase/supabase-js'
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./route"

dotenv.config();

const app = express();

app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


export const supabaseUrl = 'https://nmxyqirvwoiefdrlliri.supabase.co'
// export const supabaseKey = process.env.SUPABASE_KEY
export const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5teHlxaXJ2d29pZWZkcmxsaXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM3NjA0OTUsImV4cCI6MjAwOTMzNjQ5NX0.X1-4DmC8LZAyjHNA-GwP-kxuGqoZUo4yRR8agbmqXl4"
export const supabase = createClient(supabaseUrl, supabaseKey)

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });

app.use("/", route)
export default app
  

