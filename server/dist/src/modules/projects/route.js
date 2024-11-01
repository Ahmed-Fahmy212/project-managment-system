"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectController_1 = __importDefault(require("./projectController"));
const router = (0, express_1.Router)();
router.get("/", projectController_1.default.getProjects);
router.post("/", projectController_1.default.createProject);
exports.default = router;
