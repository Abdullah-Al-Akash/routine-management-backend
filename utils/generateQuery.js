"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuery = void 0;
const generateQuery = (query) => {
    let filter = {};
    if ((query === null || query === void 0 ? void 0 : query.minPrice) !== undefined) {
        filter.price = { $gte: parseFloat(query === null || query === void 0 ? void 0 : query.minPrice) };
    }
    if ((query === null || query === void 0 ? void 0 : query.maxPrice) !== undefined) {
        filter.price = Object.assign(Object.assign({}, filter.price), { $lte: parseFloat(query.maxPrice) });
    }
    if ((query === null || query === void 0 ? void 0 : query.releaseDate) !== undefined) {
        filter = Object.assign(Object.assign({}, filter), { releaseDate: new Date(query === null || query === void 0 ? void 0 : query.releaseDate) });
    }
    if ((query === null || query === void 0 ? void 0 : query.brand) !== undefined) {
        filter = Object.assign(Object.assign({}, filter), { brand: query === null || query === void 0 ? void 0 : query.brand });
    }
    if ((query === null || query === void 0 ? void 0 : query.modelNumber) !== undefined) {
        filter = Object.assign(Object.assign({}, filter), { modelNumber: query === null || query === void 0 ? void 0 : query.modelNumber });
    }
    if ((query === null || query === void 0 ? void 0 : query.category) !== undefined) {
        filter = Object.assign(Object.assign({}, filter), { category: query === null || query === void 0 ? void 0 : query.category });
    }
    if ((query === null || query === void 0 ? void 0 : query.operatingSystem) !== undefined) {
        filter = Object.assign(Object.assign({}, filter), { operatingSystem: query === null || query === void 0 ? void 0 : query.operatingSystem });
    }
    if ((query === null || query === void 0 ? void 0 : query.connectivity) !== undefined) {
        filter = Object.assign(Object.assign({}, filter), { connectivity: query === null || query === void 0 ? void 0 : query.connectivity });
    }
    if ((query === null || query === void 0 ? void 0 : query.powerSource) !== undefined) {
        filter = Object.assign(Object.assign({}, filter), { powerSource: query === null || query === void 0 ? void 0 : query.powerSource });
    }
    if ((query === null || query === void 0 ? void 0 : query.cameraResolution) !== undefined) {
        filter = Object.assign(Object.assign({}, filter), { 'features.cameraResolution': parseInt(query === null || query === void 0 ? void 0 : query.cameraResolution) });
    }
    if ((query === null || query === void 0 ? void 0 : query.storage) !== undefined) {
        filter = Object.assign(Object.assign({}, filter), { 'features.storageCapacity': parseInt(query === null || query === void 0 ? void 0 : query.storage) });
    }
    return filter;
};
exports.generateQuery = generateQuery;
