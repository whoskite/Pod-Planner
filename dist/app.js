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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var utils_1 = require("./utils");
var config_1 = require("./config");
var uuid_1 = require("uuid");
var store_1 = require("./store");
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3000;
// CORS configuration
var corsOptions = {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
};
// Apply CORS first, before any routes
app.use((0, cors_1.default)(corsOptions));
// Then apply other middleware
app.use(express_1.default.json());
// Add this before other routes for debugging
app.use(function (req, res, next) {
    console.log("".concat(req.method, " ").concat(req.path));
    next();
});
// Routes start here...
app.get('/', function (req, res) {
    res.json({ status: 'GM Bot API is running' });
});
// API Routes
app.get('/api/status', function (req, res) {
    var now = new Date();
    var _a = (config_1.PUBLISH_CAST_TIME || '09:00').split(':').map(Number), hours = _a[0], minutes = _a[1];
    // Calculate next scheduled time
    var nextSchedule = new Date();
    nextSchedule.setHours(hours);
    nextSchedule.setMinutes(minutes);
    nextSchedule.setSeconds(0);
    if (nextSchedule <= now) {
        nextSchedule.setDate(nextSchedule.getDate() + 1);
    }
    res.json({
        status: 'running',
        publishTime: config_1.PUBLISH_CAST_TIME || '09:00',
        timezone: config_1.TIME_ZONE || 'UTC',
        nextScheduledTime: nextSchedule.toLocaleString('en-US', {
            timeZone: config_1.TIME_ZONE || 'UTC'
        })
    });
});
app.get('/api/scheduled-gms', function (req, res) {
    res.json((0, store_1.getScheduledGMs)());
});
app.post('/api/scheduled-gms', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, message, scheduleTime, timezone, scheduleDate, now, isImmediate, newGM_1, currentGMs_1, job, newGM, currentGMs, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, message = _a.message, scheduleTime = _a.scheduleTime, timezone = _a.timezone;
                console.log('Received schedule request:', { message: message, scheduleTime: scheduleTime, timezone: timezone });
                if (!message || !scheduleTime || !timezone) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Missing required fields',
                            received: { message: message, scheduleTime: scheduleTime, timezone: timezone }
                        })];
                }
                scheduleDate = new Date(scheduleTime);
                now = new Date();
                isImmediate = scheduleDate.getTime() <= now.getTime();
                if (!isImmediate) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, utils_1.postGm)(message)];
            case 1:
                _b.sent();
                newGM_1 = {
                    id: (0, uuid_1.v4)(),
                    message: message,
                    scheduleTime: now.toISOString(),
                    timezone: timezone,
                    status: 'completed'
                };
                currentGMs_1 = (0, store_1.getScheduledGMs)();
                (0, store_1.setScheduledGMs)(__spreadArray(__spreadArray([], currentGMs_1, true), [newGM_1], false));
                return [2 /*return*/, res.status(201).json(newGM_1)];
            case 2:
                job = (0, utils_1.scheduleCustomGm)({
                    id: (0, uuid_1.v4)(),
                    message: message,
                    scheduleTime: scheduleTime,
                    timezone: timezone,
                    status: 'pending'
                });
                if (!job) {
                    throw new Error('Failed to create scheduled job');
                }
                newGM = {
                    id: (0, uuid_1.v4)(),
                    message: message,
                    scheduleTime: scheduleTime,
                    timezone: timezone,
                    status: 'pending'
                };
                currentGMs = (0, store_1.getScheduledGMs)();
                (0, store_1.setScheduledGMs)(__spreadArray(__spreadArray([], currentGMs, true), [newGM], false));
                res.status(201).json(newGM);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.error('Error scheduling GM:', error_1);
                res.status(500).json({
                    error: 'Failed to schedule GM',
                    details: error_1 instanceof Error ? error_1.message : 'Unknown error'
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post('/api/scheduled-gms/delete', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id_1, currentGMs, gmToDelete, job;
    return __generator(this, function (_a) {
        console.log('Delete request received:', req.body);
        try {
            id_1 = req.body.id;
            if (!id_1) {
                return [2 /*return*/, res.status(400).json({ error: 'Missing GM ID' })];
            }
            currentGMs = (0, store_1.getScheduledGMs)();
            gmToDelete = currentGMs.find(function (gm) { return gm.id === id_1; });
            if (!gmToDelete) {
                return [2 /*return*/, res.status(404).json({ error: 'GM not found' })];
            }
            // Only stop the job if it's pending
            if (gmToDelete.status === 'pending') {
                job = store_1.scheduledJobs.get(id_1);
                if (job) {
                    job.stop();
                    store_1.scheduledJobs.delete(id_1);
                }
            }
            // Remove from the list regardless of status
            (0, store_1.setScheduledGMs)(currentGMs.filter(function (gm) { return gm.id !== id_1; }));
            console.log('GM deleted successfully:', gmToDelete);
            res.json({
                success: true,
                message: 'GM deleted successfully',
                deletedGM: gmToDelete
            });
        }
        catch (error) {
            console.error('Error deleting scheduled GM:', error);
            res.status(500).json({
                error: 'Failed to delete scheduled GM',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
        return [2 /*return*/];
    });
}); });
// Add a catch-all route handler for debugging
app.use(function (req, res) {
    console.log('404 Not Found:', req.method, req.path);
    res.status(404).json({ error: 'Not Found' });
});
// Schedule the GM cron job
(0, utils_1.scheduleGm)();
// Start the server
app.listen(PORT, function () {
    console.log("Server is running on http://localhost:".concat(PORT));
});
//# sourceMappingURL=app.js.map