"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignedKeyRequestMetadataABI = void 0;
exports.SignedKeyRequestMetadataABI = {
    inputs: [
        {
            components: [
                {
                    internalType: "uint256",
                    name: "requestFid",
                    type: "uint256",
                },
                {
                    internalType: "address",
                    name: "requestSigner",
                    type: "address",
                },
                {
                    internalType: "bytes",
                    name: "signature",
                    type: "bytes",
                },
                {
                    internalType: "uint256",
                    name: "deadline",
                    type: "uint256",
                },
            ],
            internalType: "struct SignedKeyRequestValidator.SignedKeyRequestMetadata",
            name: "metadata",
            type: "tuple",
        },
    ],
    name: "encodeMetadata",
    outputs: [
        {
            internalType: "bytes",
            name: "",
            type: "bytes",
        },
    ],
    stateMutability: "pure",
    type: "function",
};
//# sourceMappingURL=SignedKeyRequestMetadata.js.map