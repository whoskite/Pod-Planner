"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIME_ZONE = exports.PUBLISH_CAST_TIME = exports.NEYNAR_API_KEY = exports.SIGNER_UUID = exports.FARCASTER_BOT_MNEMONIC = void 0;
var dotenv = __importStar(require("dotenv"));
var path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv.config({ path: path_1.default.resolve(__dirname, '../.env') });
exports.FARCASTER_BOT_MNEMONIC = (_a = process.env, _a.FARCASTER_BOT_MNEMONIC), exports.SIGNER_UUID = _a.SIGNER_UUID, exports.NEYNAR_API_KEY = _a.NEYNAR_API_KEY, exports.PUBLISH_CAST_TIME = (_b = _a.PUBLISH_CAST_TIME, _b === void 0 ? '09:00' : _b), exports.TIME_ZONE = (_c = _a.TIME_ZONE, _c === void 0 ? 'UTC' : _c);
if (!exports.FARCASTER_BOT_MNEMONIC) {
    throw new Error('FARCASTER_BOT_MNEMONIC is required');
}
if (!exports.SIGNER_UUID) {
    throw new Error('SIGNER_UUID is required');
}
if (!exports.NEYNAR_API_KEY) {
    throw new Error('NEYNAR_API_KEY is required');
}
//# sourceMappingURL=config.js.map