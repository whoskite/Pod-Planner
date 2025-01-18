"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeJob = exports.updateScheduledGM = exports.setScheduledGMs = exports.getScheduledGMs = exports.scheduledJobs = void 0;
// Store for scheduled jobs
exports.scheduledJobs = new Map();
// In-memory storage for scheduled GMs
var scheduledGMsStore = [];
var getScheduledGMs = function () { return scheduledGMsStore; };
exports.getScheduledGMs = getScheduledGMs;
var setScheduledGMs = function (gms) {
    scheduledGMsStore = gms;
};
exports.setScheduledGMs = setScheduledGMs;
var updateScheduledGM = function (id, status) {
    scheduledGMsStore = scheduledGMsStore.map(function (gm) {
        return gm.id === id ? __assign(__assign({}, gm), { status: status }) : gm;
    });
    // Clean up completed or failed jobs
    if (status === 'completed' || status === 'failed') {
        var job = exports.scheduledJobs.get(id);
        if (job) {
            job.stop();
            exports.scheduledJobs.delete(id);
        }
    }
};
exports.updateScheduledGM = updateScheduledGM;
var storeJob = function (id, job) {
    exports.scheduledJobs.set(id, job);
};
exports.storeJob = storeJob;
//# sourceMappingURL=store.js.map