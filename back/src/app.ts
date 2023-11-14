import { createClient } from '@supabase/supabase-js'
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import dotenv from "dotenv";


dotenv.config();
const app = express();

const supabaseUrl = 'https://nmxyqirvwoiefdrlliri.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
