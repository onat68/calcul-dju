"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const supabaseUrl = 'https://nmxyqirvwoiefdrlliri.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
