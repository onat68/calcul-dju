"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = exports.supabaseKey = exports.supabaseUrl = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const route_1 = __importDefault(require("./route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("combined"));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
exports.supabaseUrl = 'https://nmxyqirvwoiefdrlliri.supabase.co';
// export const supabaseKey = process.env.SUPABASE_KEY
exports.supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5teHlxaXJ2d29pZWZkcmxsaXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM3NjA0OTUsImV4cCI6MjAwOTMzNjQ5NX0.X1-4DmC8LZAyjHNA-GwP-kxuGqoZUo4yRR8agbmqXl4";
exports.supabase = (0, supabase_js_1.createClient)(exports.supabaseUrl, exports.supabaseKey);
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});
app.use("/", route_1.default);
exports.default = app;
