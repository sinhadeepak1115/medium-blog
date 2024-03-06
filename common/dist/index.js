"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postInput = exports.signInput = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signInput = zod_1.default.object({
    username: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
    name: zod_1.default.string().optional()
});
exports.postInput = zod_1.default.object({
    title: zod_1.default.string().toUpperCase(),
    content: zod_1.default.string()
});
