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
require("express-async-errors");
const api_1 = __importDefault(require("./api"));
const errorHandlerMiddleware_1 = __importDefault(require("./middleware/errorHandlerMiddleware"));
const logger_1 = require("./util/logger");
// Configs
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: 'cross-origin' }));
//hanndle this 
app.use((0, morgan_1.default)((tokens, req, res) => {
    return [
        `${tokens.status(req, res)}`,
        `${tokens.method(req, res)}${tokens.url(req, res)}`,
        `${tokens['response-time'](req, res)} ms`,
    ].join(' | ');
}));
app.use(logger_1.WinstonLogger);
app.use(api_1.default);
app.get('*', (req, res) => {
    res.status(404).json({
        errors: {
            name: 'Not Found',
            message: 'Not Found Route',
        },
    });
});
// will add email alert
app.use((err, req, res, next) => {
    (0, errorHandlerMiddleware_1.default)(err, req, res, next);
});
const port = parseInt(process.env.PORT || "8000");
app.listen(port, () => {
    console.log(`\x1b[32mServer running on port ${port}\x1b[0m`);
    console.log(`\x1b[32mdatabase running on port : 5432\x1b[0m`);
});
//# sourceMappingURL=index.js.map