"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerDataSchema = void 0;
const zod_1 = require("zod");
exports.PlayerDataSchema = zod_1.z.object({
    id: zod_1.z.number(),
    playerName: zod_1.z.string(),
    phoneNumber: zod_1.z.string(),
    isInvited: zod_1.z.boolean().optional(),
    isAttending: zod_1.z.boolean().optional(),
});
