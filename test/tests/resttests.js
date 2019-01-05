"use strict";
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const restm = require("typed-rest-client/RestClient");
const util = require("typed-rest-client/Util");
describe('Rest Tests', function () {
    let _rest;
    let _restBin;
    before(() => {
        _rest = new restm.RestClient('typed-rest-client-tests');
        _restBin = new restm.RestClient('typed-rest-client-tests', 'https://httpbin.org');
    });
    after(() => {
    });
    it('constructs', () => {
        this.timeout(1000);
        let rest = new restm.RestClient('typed-test-client-tests');
        assert(rest, 'rest client should not be null');
    });
    it('gets a resource', () => __awaiter(this, void 0, void 0, function* () {
        this.timeout(3000);
        let restRes = yield _rest.get('https://httpbin.org/get');
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'https://httpbin.org/get');
    }));
    it('gets a resource with baseUrl', () => __awaiter(this, void 0, void 0, function* () {
        let restRes = yield _restBin.get('get');
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'https://httpbin.org/get');
    }));
    it('creates a resource', () => __awaiter(this, void 0, void 0, function* () {
        let res = { name: 'foo' };
        let restRes = yield _rest.create('https://httpbin.org/post', res);
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'https://httpbin.org/post');
        assert(restRes.result && restRes.result.json.name === 'foo');
    }));
    it('creates a resource with a baseUrl', () => __awaiter(this, void 0, void 0, function* () {
        let res = { name: 'foo' };
        let restRes = yield _restBin.create('post', res);
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'https://httpbin.org/post');
        assert(restRes.result && restRes.result.json.name === 'foo');
    }));
    it('replaces a resource', () => __awaiter(this, void 0, void 0, function* () {
        this.timeout(3000);
        let res = { name: 'foo' };
        let restRes = yield _rest.replace('https://httpbin.org/put', res);
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'https://httpbin.org/put');
        assert(restRes.result && restRes.result.json.name === 'foo');
    }));
    it('replaces a resource with a baseUrl', () => __awaiter(this, void 0, void 0, function* () {
        let res = { name: 'foo' };
        let restRes = yield _restBin.replace('put', res);
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'https://httpbin.org/put');
        assert(restRes.result && restRes.result.json.name === 'foo');
    }));
    it('updates a resource', () => __awaiter(this, void 0, void 0, function* () {
        let res = { name: 'foo' };
        let restRes = yield _rest.update('https://httpbin.org/patch', res);
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'https://httpbin.org/patch');
        assert(restRes.result && restRes.result.json.name === 'foo');
    }));
    it('updates a resource with a baseUrl', () => __awaiter(this, void 0, void 0, function* () {
        let res = { name: 'foo' };
        let restRes = yield _restBin.update('patch', res);
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'https://httpbin.org/patch');
        assert(restRes.result && restRes.result.json.name === 'foo');
    }));
    it('deletes a resource', () => __awaiter(this, void 0, void 0, function* () {
        let restRes = yield _rest.del('https://httpbin.org/delete');
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'https://httpbin.org/delete');
    }));
    it('deletes a resource with a baseUrl', () => __awaiter(this, void 0, void 0, function* () {
        let restRes = yield _restBin.del('delete');
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'https://httpbin.org/delete');
    }));
    it('does an options request', () => __awaiter(this, void 0, void 0, function* () {
        let restRes = yield _rest.options('https://httpbin.org');
        assert(restRes.statusCode == 200, "statusCode should be 200");
    }));
    it('does an options request with baseUrl', () => __awaiter(this, void 0, void 0, function* () {
        let restRes = yield _restBin.options('');
        assert(restRes.statusCode == 200, "statusCode should be 200");
    }));
    //----------------------------------------------
    // Get Error Cases
    //----------------------------------------------
    //
    // Resource not found (404)
    // should return a null resource, 404 status, and should not throw
    //
    it('gets a non-existant resource (404)', () => __awaiter(this, void 0, void 0, function* () {
        this.timeout(3000);
        try {
            let restRes = yield _rest.get('https://httpbin.org/status/404');
            assert(restRes.statusCode == 404, "statusCode should be 404");
            assert(restRes.result === null, "object should be null");
        }
        catch (err) {
            assert(false, "should not throw");
        }
    }));
    //
    // Unauthorized (401)
    // should throw and attach statusCode to the Error object
    // err.message is message proerty of resourceful error object or if not supplied, a generic error message
    //
    it('gets and handles unauthorized (401)', () => __awaiter(this, void 0, void 0, function* () {
        try {
            let restRes = yield _rest.get('https://httpbin.org/status/401');
            assert(false, "should throw");
        }
        catch (err) {
            assert(err['statusCode'] == 401, "statusCode should be 401");
            assert(err.message && err.message.length > 0, "should have error message");
        }
    }));
    //
    // Internal Server Error
    // should throw and attach statusCode to the Error object
    // err.message is message proerty of resourceful error object or if not supplied, a generic error message
    //
    it('gets and handles a server error (500)', () => __awaiter(this, void 0, void 0, function* () {
        try {
            let restRes = yield _rest.get('https://httpbin.org/status/500');
            assert(false, "should throw");
        }
        catch (err) {
            assert(err['statusCode'] == 500, "statusCode should be 500");
            assert(err.message && err.message.length > 0, "should have error message");
        }
    }));
    //--------------------------------------------------------
    // Path in baseUrl tests
    //--------------------------------------------------------
    it('maintains the path from the base url', () => __awaiter(this, void 0, void 0, function* () {
        this.timeout(3000);
        // Arrange
        let rest = new restm.RestClient('typed-rest-client-tests', 'https://httpbin.org/anything');
        // Act
        let restRes = yield rest.get('anythingextra');
        // Assert
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'https://httpbin.org/anything/anythingextra');
    }));
    it('maintains the path from the base url with no slashes', () => __awaiter(this, void 0, void 0, function* () {
        // Arrange
        let rest = new restm.RestClient('typed-rest-client-tests', 'https://httpbin.org/anything');
        // Act
        let restRes = yield rest.get('anythingextra');
        // Assert
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'https://httpbin.org/anything/anythingextra');
    }));
    it('maintains the path from the base url with double slashes', () => __awaiter(this, void 0, void 0, function* () {
        // Arrange
        let rest = new restm.RestClient('typed-rest-client-tests', 'https://httpbin.org/anything/');
        // Act
        let restRes = yield rest.get('anythingextra');
        // Assert
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'https://httpbin.org/anything/anythingextra');
    }));
    it('maintains the path from the base url with multiple parts', () => __awaiter(this, void 0, void 0, function* () {
        // Arrange
        let rest = new restm.RestClient('typed-rest-client-tests', 'https://httpbin.org/anything/extrapart');
        // Act
        let restRes = yield rest.get('anythingextra');
        // Assert
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'https://httpbin.org/anything/extrapart/anythingextra');
    }));
    it('maintains the path from the base url where request has multiple parts', () => __awaiter(this, void 0, void 0, function* () {
        // Arrange
        let rest = new restm.RestClient('typed-rest-client-tests', 'https://httpbin.org/anything');
        // Act
        let restRes = yield rest.get('anythingextra/moreparts');
        // Assert
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'https://httpbin.org/anything/anythingextra/moreparts');
    }));
    it('maintains the path from the base url where both have multiple parts', () => __awaiter(this, void 0, void 0, function* () {
        // Arrange
        let rest = new restm.RestClient('typed-rest-client-tests', 'https://httpbin.org/anything/multiple');
        // Act
        let restRes = yield rest.get('anythingextra/moreparts');
        // Assert
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'https://httpbin.org/anything/multiple/anythingextra/moreparts');
    }));
    it('maintains the path from the base url where request has query parameters', () => __awaiter(this, void 0, void 0, function* () {
        // Arrange
        this.timeout(3000);
        let rest = new restm.RestClient('typed-rest-client-tests', 'https://httpbin.org/anything/multiple');
        // Act
        let restRes = yield rest.get('anythingextra/moreparts?foo=bar&baz=top');
        // Assert
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'https://httpbin.org/anything/multiple/anythingextra/moreparts?foo=bar&baz=top');
        assert(restRes.result && restRes.result.args.foo === 'bar');
        assert(restRes.result && restRes.result.args.baz === 'top');
    }));
    it('preserves trailing slashes in URLs', () => __awaiter(this, void 0, void 0, function* () {
        const res = util.getUrl('get/foo/', 'http://httpbin.org/bar');
        assert.equal(res, 'http://httpbin.org/bar/get/foo/');
    }));
});
