"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response = {
    success: (res, data) => {
        return res.status(200).json({
            data: data || [],
        });
    },
    created: (res, data) => {
        return res.status(201).json({
            data: data || [],
        });
    }
};
exports.default = response;
//# sourceMappingURL=responce.js.map