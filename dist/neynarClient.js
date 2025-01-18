"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodejs_sdk_1 = require("@neynar/nodejs-sdk");
var config_1 = require("./config");
var config = new nodejs_sdk_1.Configuration({
    apiKey: config_1.NEYNAR_API_KEY,
});
var neynarClient = new nodejs_sdk_1.NeynarAPIClient(config);
exports.default = neynarClient;
//# sourceMappingURL=neynarClient.js.map