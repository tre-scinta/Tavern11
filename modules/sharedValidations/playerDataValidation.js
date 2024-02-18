"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePlayerData = void 0;
const playerData_1 = require("../sharedSchemas/playerData");
const zod_1 = require("zod");
function validatePlayerData(req, res, next) {
    try {
        playerData_1.PlayerDataSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: error.errors });
        }
        else {
            // Handle unexpected errors differently
            res.status(500).json({ error: 'An unexpected error occurred.' });
        }
    }
}
exports.validatePlayerData = validatePlayerData;
