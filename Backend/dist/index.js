"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./Routes/user"));
const todo_1 = __importDefault(require("./Routes/todo"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/user', user_1.default);
app.use('/todo', todo_1.default);
const port = 3000;
app.listen(port, function () {
    console.log(`Server is running on ${port}`);
});
