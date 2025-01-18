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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishCastImmediately = exports.scheduleCustomGm = exports.scheduleGm = exports.postGm = exports.getApprovedSigner = exports.MESSAGE = void 0;
var config_1 = require("./config");
var neynarClient_1 = __importDefault(require("./neynarClient"));
var accounts_1 = require("viem/accounts");
var viemClient_1 = require("./viemClient");
var keyGateway_1 = require("./abi/keyGateway");
var viem_1 = require("viem");
var SignedKeyRequestMetadata_1 = require("./abi/SignedKeyRequestMetadata");
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var nodejs_sdk_1 = require("@neynar/nodejs-sdk");
var api_1 = require("@neynar/nodejs-sdk/build/api");
var node_cron_1 = __importDefault(require("node-cron"));
var store_1 = require("./store");
// A constant message for greeting or logging.
exports.MESSAGE = "gm \uD83E\uDE90";
/**
 * Appends the signer_uuid to the .env file.
 * @param signer_uuid - Approved signer UUID of the user.
 */
var appendSignerUuidAndUsernameToEnv = function (signer_uuid) {
    // Resolving the path to the .env file.
    var envPath = path.resolve(__dirname, "../.env");
    // Reading the .env file.
    fs.readFile(envPath, "utf8", function (err, data) {
        if (err) {
            console.error("Error reading .env file:", err);
            return;
        }
        // Appending the SIGNER_UUID to the file content.
        var newContent = data + "\nSIGNER_UUID=".concat(signer_uuid);
        // Writing the updated content back to the .env file.
        fs.writeFile(envPath, newContent, "utf8", function (err) {
            if (err) {
                console.error("Error writing to .env file:", err);
                return;
            }
            console.log("SIGNER_UUID appended to .env file.\nPlease run `yarn start` to continue.\n");
        });
    });
};
/**
 * Generates an approved signer for the user.
 */
var getApprovedSigner = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, signerPublicKey, signer_uuid, SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN, SIGNED_KEY_REQUEST_TYPE, account, farcasterDeveloper, deadline, signature, metadata, developerKeyGatewayNonce, KEY_GATEWAY_EIP_712_DOMAIN, ADD_TYPE, res, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 10, , 11]);
                if (!config_1.FARCASTER_BOT_MNEMONIC) {
                    throw new Error('FARCASTER_BOT_MNEMONIC is required');
                }
                return [4 /*yield*/, neynarClient_1.default.createSigner()];
            case 1:
                _a = _b.sent(), signerPublicKey = _a.public_key, signer_uuid = _a.signer_uuid;
                SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
                    name: "Farcaster SignedKeyRequestValidator", // EIP-712 domain data for the SignedKeyRequestValidator.
                    version: "1",
                    chainId: 10,
                    verifyingContract: "0x00000000fc700472606ed4fa22623acf62c60553",
                };
                SIGNED_KEY_REQUEST_TYPE = [
                    { name: "requestFid", type: "uint256" },
                    { name: "key", type: "bytes" },
                    { name: "deadline", type: "uint256" },
                ];
                account = (0, accounts_1.mnemonicToAccount)(config_1.FARCASTER_BOT_MNEMONIC);
                return [4 /*yield*/, neynarClient_1.default.lookupUserByCustodyAddress({
                        custodyAddress: account.address,
                    })];
            case 2:
                farcasterDeveloper = (_b.sent()).user;
                console.log("\u2705 Detected user with fid ".concat(farcasterDeveloper.fid, " and custody address: ").concat(farcasterDeveloper.custody_address));
                deadline = Math.floor(Date.now() / 1000) + 86400;
                return [4 /*yield*/, account.signTypedData({
                        domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
                        types: {
                            SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
                        },
                        primaryType: "SignedKeyRequest",
                        message: {
                            requestFid: BigInt(farcasterDeveloper.fid),
                            key: signerPublicKey,
                            deadline: BigInt(deadline),
                        },
                    })];
            case 3:
                signature = _b.sent();
                metadata = (0, viem_1.encodeAbiParameters)(SignedKeyRequestMetadata_1.SignedKeyRequestMetadataABI.inputs, [
                    {
                        requestFid: BigInt(farcasterDeveloper.fid),
                        requestSigner: account.address,
                        signature: signature,
                        deadline: BigInt(deadline),
                    },
                ]);
                return [4 /*yield*/, viemClient_1.viemPublicClient.readContract({
                        address: "0x00000000fc56947c7e7183f8ca4b62398caadf0b", // gateway address
                        abi: keyGateway_1.keyGatewayAbi,
                        functionName: "nonces",
                        args: [farcasterDeveloper.custody_address],
                    })];
            case 4:
                developerKeyGatewayNonce = _b.sent();
                KEY_GATEWAY_EIP_712_DOMAIN = {
                    name: "Farcaster KeyGateway",
                    version: "1",
                    chainId: 10,
                    verifyingContract: "0x00000000fc56947c7e7183f8ca4b62398caadf0b",
                };
                ADD_TYPE = [
                    { name: "owner", type: "address" },
                    { name: "keyType", type: "uint32" },
                    { name: "key", type: "bytes" },
                    { name: "metadataType", type: "uint8" },
                    { name: "metadata", type: "bytes" },
                    { name: "nonce", type: "uint256" },
                    { name: "deadline", type: "uint256" },
                ];
                return [4 /*yield*/, account.signTypedData({
                        domain: KEY_GATEWAY_EIP_712_DOMAIN,
                        types: {
                            Add: ADD_TYPE,
                        },
                        primaryType: "Add",
                        message: {
                            owner: account.address,
                            keyType: 1,
                            key: signerPublicKey,
                            metadataType: 1,
                            metadata: metadata,
                            nonce: BigInt(developerKeyGatewayNonce),
                            deadline: BigInt(deadline),
                        },
                    })];
            case 5:
                signature = _b.sent();
                // Logging instructions and values for the user to perform on-chain transactions.
                console.log("✅ Generated signer", "\n");
                console.log("In order to get an approved signer you need to do an on-chain transaction on OP mainnet. \nGo to Farcaster KeyGateway optimism explorer\nhttps://optimistic.etherscan.io/address/0x00000000fc56947c7e7183f8ca4b62398caadf0b#writeContract \n");
                console.log("Connect to Web3.\n\nNavigate to `addFor` function and add following values inside the respective placeholders.\n");
                console.log("fidOwner (address) :=> ", farcasterDeveloper.custody_address, "\n -");
                console.log("keyType (uint32) :=> ", 1, "\n -");
                console.log("key (bytes) :=> ", signerPublicKey, "\n -");
                console.log("metadataType (uint8) :=> ", 1, "\n -");
                console.log("metadata (bytes) :=> ", metadata, "\n -");
                console.log("deadline (uint256) :=> ", deadline, "\n -");
                console.log("sig (bytes) :=> ", signature, "\n -\n");
                console.log("We are polling for the signer to be approved. It will be approved once the onchain transaction is confirmed.");
                console.log("Checking for the status of signer...");
                _b.label = 6;
            case 6:
                if (!true) return [3 /*break*/, 9];
                return [4 /*yield*/, neynarClient_1.default.lookupSigner({ signerUuid: signer_uuid })];
            case 7:
                res = _b.sent();
                if (res && res.status === api_1.SignerStatusEnum.Approved) {
                    console.log("✅ Approved signer", signer_uuid);
                    return [3 /*break*/, 9];
                }
                console.log("Waiting for signer to be approved...");
                return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 5000); })];
            case 8:
                _b.sent();
                return [3 /*break*/, 6];
            case 9:
                console.log("✅ Transaction confirmed\n");
                console.log("✅ Approved signer", signer_uuid, "\n");
                // Once approved, appending the signer UUID to the .env file.
                appendSignerUuidAndUsernameToEnv(signer_uuid);
                return [3 /*break*/, 11];
            case 10:
                err_1 = _b.sent();
                if ((0, nodejs_sdk_1.isApiErrorResponse)(err_1)) {
                    console.error('API Error:', err_1.response.data);
                }
                else {
                    console.error('Error:', (err_1 === null || err_1 === void 0 ? void 0 : err_1.message) || err_1);
                }
                throw err_1; // Re-throw to handle at caller level
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.getApprovedSigner = getApprovedSigner;
var publishCast = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!config_1.SIGNER_UUID) {
                    throw new Error('SIGNER_UUID is required for publishing casts');
                }
                return [4 /*yield*/, neynarClient_1.default.publishCast({ signerUuid: config_1.SIGNER_UUID, text: msg })];
            case 1:
                _a.sent();
                console.log("Cast published successfully");
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                if ((0, nodejs_sdk_1.isApiErrorResponse)(err_2)) {
                    console.error('API Error:', err_2.response.data);
                }
                else {
                    console.error('Error:', (err_2 === null || err_2 === void 0 ? void 0 : err_2.message) || err_2);
                }
                throw err_2; // Re-throw to handle at caller level
            case 3: return [2 /*return*/];
        }
    });
}); };
var postGm = function (customMessage) { return __awaiter(void 0, void 0, void 0, function () {
    var message, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!config_1.SIGNER_UUID) {
                    throw new Error('SIGNER_UUID is required for publishing casts');
                }
                message = customMessage || exports.MESSAGE;
                return [4 /*yield*/, neynarClient_1.default.publishCast({ signerUuid: config_1.SIGNER_UUID, text: message })];
            case 1:
                _a.sent();
                console.log("GM posted successfully:", message);
                return [2 /*return*/, true];
            case 2:
                error_1 = _a.sent();
                console.error('Failed to post GM:', error_1);
                throw error_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.postGm = postGm;
var scheduleGm = function () {
    if (!config_1.SIGNER_UUID) {
        throw new Error('SIGNER_UUID is required for scheduling GMs');
    }
    // Initial welcome message
    (0, exports.postGm)("gm! I'm here to brighten your day with daily cheer. Look forward to a warm 'gm' everyday!");
    var _a = (config_1.PUBLISH_CAST_TIME || '09:00').split(':'), hour = _a[0], minute = _a[1];
    // Schedule the cron job
    node_cron_1.default.schedule("".concat(minute, " ").concat(hour, " * * *"), function () {
        publishCast(exports.MESSAGE);
    }, {
        scheduled: true,
        timezone: config_1.TIME_ZONE || 'UTC',
    });
    console.log("Cron job scheduled at ".concat(config_1.PUBLISH_CAST_TIME || '09:00', " ").concat(config_1.TIME_ZONE || 'UTC', ", please don't restart your system before the scheduled time."));
};
exports.scheduleGm = scheduleGm;
var scheduleCustomGm = function (scheduledGM) {
    var message = scheduledGM.message, scheduleTime = scheduledGM.scheduleTime, timezone = scheduledGM.timezone, id = scheduledGM.id;
    try {
        if (!config_1.SIGNER_UUID) {
            throw new Error('SIGNER_UUID is required for scheduling GMs');
        }
        // Convert schedule time to the target timezone
        var targetDate = new Date(scheduleTime);
        var now = new Date();
        // Convert both dates to UTC for comparison
        var targetUTC = new Date(targetDate.toLocaleString('en-US', { timeZone: timezone }));
        var nowUTC = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
        if (targetUTC < nowUTC) {
            throw new Error('Cannot schedule GMs in the past');
        }
        // Create cron expression with validation
        var minutes = targetDate.getMinutes();
        var hours = targetDate.getHours();
        var dayOfMonth = targetDate.getDate();
        var month = targetDate.getMonth() + 1;
        if (isNaN(minutes) || isNaN(hours) || isNaN(dayOfMonth) || isNaN(month)) {
            throw new Error('Invalid date components');
        }
        var cronExpression = "".concat(minutes, " ").concat(hours, " ").concat(dayOfMonth, " ").concat(month, " *");
        console.log('Cron expression:', cronExpression);
        console.log('Scheduling for:', targetDate.toLocaleString('en-US', { timeZone: timezone }));
        var job_1 = node_cron_1.default.schedule(cronExpression, function () { return __awaiter(void 0, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, publishCast(message)];
                    case 1:
                        _a.sent();
                        console.log('Successfully sent scheduled GM:', message);
                        (0, store_1.updateScheduledGM)(id, 'completed');
                        job_1.stop();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Failed to send scheduled GM:', error_2);
                        (0, store_1.updateScheduledGM)(id, 'failed');
                        job_1.stop();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }, {
            scheduled: true,
            timezone: timezone
        });
        job_1.start();
        (0, store_1.storeJob)(id, job_1);
        console.log('Job scheduled successfully');
        return job_1;
    }
    catch (error) {
        console.error('Error creating cron job:', error);
        (0, store_1.updateScheduledGM)(id, 'failed');
        return null;
    }
};
exports.scheduleCustomGm = scheduleCustomGm;
var publishCastImmediately = function (message) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, (0, exports.postGm)(message)];
    });
}); };
exports.publishCastImmediately = publishCastImmediately;
//# sourceMappingURL=utils.js.map