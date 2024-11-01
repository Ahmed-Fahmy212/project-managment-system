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
const client_1 = __importDefault(require("../../../prisma/client"));
const BadRequestException_1 = require("../../exceptions/BadRequestException");
const responce_1 = __importDefault(require("../../util/responce"));
const projects = {
    getProjects: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const projects = yield client_1.default.project.findMany();
        return responce_1.default.success(res, projects);
    }),
    createProject: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, description, startDate, endDate } = req.body;
        if (!name || !description || !startDate || !endDate) {
            throw new BadRequestException_1.BadRequestException(`Missing required fields ${name ? "" : "name"} ${description ? "" : "description"} ${startDate ? "" : "startDate"} ${endDate ? "" : "endDate"}`);
        }
        const newProject = yield client_1.default.project.create({
            data: {
                name,
                description,
                startDate,
                endDate,
            },
        });
        responce_1.default.created(res, newProject);
    })
};
exports.default = projects;
