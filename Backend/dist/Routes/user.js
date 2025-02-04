"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
router.use((0, cookie_parser_1.default)());
router.use((0, cors_1.default)({
    credentials: true,
    origin: ["http://localhost:5500"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
router.post('/signup', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password, firstname, lastname } = req.body;
        try {
            const user = yield prisma.user.create({
                data: {
                    username,
                    password,
                    firstname,
                    lastname
                }
            });
            res.status(200).json(user);
        }
        catch (e) {
            console.error("Error:", e);
            res.status(500).json({ error: "Error Creating Profile" });
        }
    });
});
router.post('/sigin', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        try {
            const user = yield prisma.user.findFirst({
                where: {
                    username,
                    password
                }
            });
            if (!user) {
                res.status(500).send("Invalid Username/Password");
                return;
            }
            if (!JWT_SECRET) {
                throw new Error("JWT_SECRET is not defined in the environment variables");
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET);
            res.cookie("token", token, {
                httpOnly: true, // Ensure JavaScript on the frontend cannot access the cookie (security)
                // Set to true only if you're using HTTPS
                //sameSite: 'Strict',  // Restricts cross-site requests with the cookie
            });
            res.json({ message: "Logged in successfully", token });
        }
        catch (e) {
            res.status(500).json({ error: "Error Signing In" });
        }
    });
});
/*router.post('/logout', async function(req, res){
    res.clearCookie("token");
    res.json({
        message: "Logged Out"
    })
})*/
exports.default = router;
