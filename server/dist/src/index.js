"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const api_1 = __importDefault(require("./api"));
const errorHandlerMiddleware_1 = __importDefault(require("./middleware/errorHandlerMiddleware"));
require("express-async-errors");
// Configs
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use((0, morgan_1.default)('common'));
app.use(api_1.default);
app.get('*', (req, res) => {
    res.status(404).json({
        errors: {
            name: 'Not Found',
            message: 'Not Found Route',
        },
    });
});
app.use(errorHandlerMiddleware_1.default);
const port = parseInt(process.env.PORT || "8000");
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`database running on port : 5432`);
});
