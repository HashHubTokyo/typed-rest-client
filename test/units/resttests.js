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
const nock = require("nock");
const restm = require("typed-rest-client/RestClient");
const util = require("typed-rest-client/Util");
describe('Rest Tests', function () {
    let _rest;
    let _restBin;
    let _restMic;
    before(() => {
        _rest = new restm.RestClient('typed-rest-client-tests');
        _restBin = new restm.RestClient('typed-rest-client-tests', 'https://httpbin.org');
        _restMic = new restm.RestClient('typed-rest-client-tests', 'http://microsoft.com');
    });
    after(() => {
    });
    afterEach(() => {
        nock.cleanAll();
    });
    it('constructs', () => {
        this.timeout(1000);
        let rest = new restm.RestClient('typed-rest-client-tests');
        assert(rest, 'rest client should not be null');
    });
    it('gets a resource', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .get('/')
            .reply(200, {
            url: 'http://microsoft.com',
            data: null,
            json: null
        });
        let restRes = yield _rest.get('http://microsoft.com');
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'http://microsoft.com');
    }));
    it('gets a resource with baseUrl', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .get('/')
            .reply(200, {
            url: 'http://microsoft.com',
            data: null,
            json: null
        });
        let restRes = yield _restMic.get('');
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'http://microsoft.com');
    }));
    it('gets a resource and correctly deserializes its Date property', () => __awaiter(this, void 0, void 0, function* () {
        //Arrange
        const dateObject = new Date(2018, 9, 24, 10, 54, 11, 1);
        nock('http://microsoft.com')
            .get('/date')
            .reply(200, {
            json: { dateProperty: dateObject.toDateString() }
        });
        //Act
        const restRes = yield _rest.get('http://microsoft.com/date', { deserializeDates: true });
        //Assert
        assert(restRes.result);
        const dateProperty = restRes.result.json.dateProperty;
        assert(dateProperty.getTime, 'dateProperty should have a getTime method');
        assert.equal(dateProperty.getFullYear(), 2018);
        assert.equal(dateProperty.getMonth(), 9);
        assert.equal(dateProperty.getDate(), 24);
    }));
    it('gets a resource and doesn\'t deserialize its non-Date property', () => __awaiter(this, void 0, void 0, function* () {
        //Arrange
        const nonDateObject = 'stringObject';
        nock('http://microsoft.com')
            .get('/date')
            .reply(200, {
            json: { nonDateProperty: nonDateObject }
        });
        //Act
        const restRes = yield _rest.get('http://microsoft.com/date', { deserializeDates: true });
        //Assert
        assert(restRes.result);
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert.equal(typeof (restRes.result.json.nonDateProperty), 'string');
        assert.equal(restRes.result.json.nonDateProperty, 'stringObject');
    }));
    it('creates a resource', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .post('/')
            .reply(200, function (uri, requestBody) {
            let body = JSON.parse(requestBody);
            return {
                url: 'http://microsoft.com/post',
                data: null,
                json: body.name
            };
        });
        let res = { name: 'foo' };
        let restRes = yield _rest.create('http://microsoft.com', res);
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'http://microsoft.com/post');
        assert(restRes.result && restRes.result.json === 'foo');
    }));
    it('creates a resource with a baseUrl', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .post('/')
            .reply(200, function (uri, requestBody) {
            let body = JSON.parse(requestBody);
            return {
                url: 'http://microsoft.com/post',
                data: null,
                json: body.name
            };
        });
        let res = { name: 'foo' };
        let restRes = yield _restMic.create('', res);
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'http://microsoft.com/post');
        assert(restRes.result && restRes.result.json === 'foo');
    }));
    it('replaces a resource', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .put('/')
            .reply(200, function (uri, requestBody) {
            let body = JSON.parse(requestBody);
            return {
                url: 'http://microsoft.com/put',
                data: null,
                json: body.name
            };
        });
        let res = { name: 'foo' };
        let restRes = yield _rest.replace('http://microsoft.com', res);
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'http://microsoft.com/put');
        assert(restRes.result && restRes.result.json === 'foo');
    }));
    it('replaces a resource with a baseUrl', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .put('/')
            .reply(200, function (uri, requestBody) {
            let body = JSON.parse(requestBody);
            return {
                url: 'http://microsoft.com/put',
                data: null,
                json: body.name
            };
        });
        let res = { name: 'foo' };
        let restRes = yield _restMic.replace('', res);
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'http://microsoft.com/put');
        assert(restRes.result && restRes.result.json === 'foo');
    }));
    it('updates a resource', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .put('/')
            .reply(200, function (uri, requestBody) {
            let body = JSON.parse(requestBody);
            return {
                url: 'http://microsoft.com/put',
                data: null,
                json: body.name
            };
        });
        let res = { name: 'foo' };
        let restRes = yield _rest.replace('http://microsoft.com', res);
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'http://microsoft.com/put');
        assert(restRes.result && restRes.result.json === 'foo');
    }));
    it('updates a resource with a baseUrl', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .put('/')
            .reply(200, function (uri, requestBody) {
            let body = JSON.parse(requestBody);
            return {
                url: 'http://microsoft.com/put',
                data: null,
                json: body.name
            };
        });
        let res = { name: 'foo' };
        let restRes = yield _restMic.replace('', res);
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'http://microsoft.com/put');
        assert(restRes.result && restRes.result.json === 'foo');
    }));
    it('deletes a resource', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .delete('/')
            .reply(200, {
            url: 'http://microsoft.com/delete',
            data: null,
            json: null
        });
        let restRes = yield _rest.del('http://microsoft.com');
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'http://microsoft.com/delete');
    }));
    it('deletes a resource with a baseUrl', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .delete('/')
            .reply(200, {
            url: 'http://microsoft.com/delete',
            data: null,
            json: null
        });
        let restRes = yield _restMic.del('');
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'http://microsoft.com/delete');
    }));
    it('does an options request', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .options('/')
            .reply(200, {
            url: 'http://microsoft.com/options',
            data: null,
            json: null
        });
        let restRes = yield _rest.options('http://microsoft.com');
        assert(restRes.statusCode == 200, "statusCode should be 200");
    }));
    it('does an options request with baseUrl', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .options('/')
            .reply(200, {
            url: 'http://microsoft.com/options',
            data: null,
            json: null
        });
        let restRes = yield _restMic.options('');
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
        nock('http://microsoft.com')
            .get('/status/404')
            .reply(404);
        let restRes;
        try {
            restRes = yield _rest.get('http://microsoft.com/status/404');
        }
        catch (err) {
            console.log(err);
            assert(false, "Request should succeed, should not throw");
        }
        assert(restRes.statusCode == 404, "statusCode should be 404");
        assert(restRes.result === null, "object should be null");
    }));
    //
    // Unauthorized (401)
    // should throw and attach statusCode to the Error object
    // err.message is message proerty of resourceful error object or if not supplied, a generic error message
    //
    it('gets and handles unauthorized (401)', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .get('/status/401')
            .reply(401, { 'message': 'something awful happened', 'statusCode': 401 });
        try {
            let restRes = yield _rest.get('http://microsoft.com/status/401');
            assert(false, "should throw");
        }
        catch (err) {
            assert(err['statusCode'] == 401, "statusCode should be 401");
            assert(err.result && err.result['message'] === 'something awful happened', "should have error message with the response");
        }
    }));
    //
    // Internal Server Error
    // should throw and attach statusCode to the Error object
    // err.message is message proerty of resourceful error object or if not supplied, a generic error message
    //
    it('gets and handles a server error (500)', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .get('/status/500')
            .reply(500, { 'message': 'something awful happened', 'statusCode': 500 });
        try {
            let restRes = yield _rest.get('http://microsoft.com/status/500');
            assert(false, "should throw");
        }
        catch (err) {
            assert(err['statusCode'] == 500, "statusCode should be 500");
            assert(err.result && err.result['message'] === 'something awful happened', "should have error message with the response");
        }
    }));
    //--------------------------------------------------------
    // Path in baseUrl tests
    //--------------------------------------------------------
    it('maintains the path from the base url with no slashes', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .get('/anything/anythingextra')
            .reply(200, {
            url: 'http://microsoft.com/anything/anythingextra',
            data: null,
            json: null
        });
        // Arrange
        let rest = new restm.RestClient('typed-rest-client-tests', 'http://microsoft.com/anything');
        // Act
        let restRes = yield rest.get('anythingextra');
        // Assert
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'http://microsoft.com/anything/anythingextra');
    }));
    it('maintains the path from the base url with double slashes', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .get('/anything/anythingextra')
            .reply(200, {
            url: 'http://microsoft.com/anything/anythingextra',
            data: null,
            json: null
        });
        // Arrange
        let rest = new restm.RestClient('typed-rest-client-tests', 'http://microsoft.com/anything/');
        // Act
        let restRes = yield rest.get('anythingextra');
        // Assert
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'http://microsoft.com/anything/anythingextra');
    }));
    it('maintains the path from the base url with multiple parts', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .get('/anything/extrapart/anythingextra')
            .reply(200, {
            url: 'http://microsoft.com/anything/extrapart/anythingextra',
            data: null,
            json: null
        });
        // Arrange
        let rest = new restm.RestClient('typed-rest-client-tests', 'http://microsoft.com/anything/extrapart');
        // Act
        let restRes = yield rest.get('anythingextra');
        // Assert
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'http://microsoft.com/anything/extrapart/anythingextra');
    }));
    it('maintains the path from the base url where request has multiple parts', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .get('/anything/anythingextra/moreparts')
            .reply(200, {
            url: 'http://microsoft.com/anything/anythingextra/moreparts',
            data: null,
            json: null
        });
        // Arrange
        let rest = new restm.RestClient('typed-rest-client-tests', 'http://microsoft.com/anything');
        // Act
        let restRes = yield rest.get('anythingextra/moreparts');
        // Assert
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'http://microsoft.com/anything/anythingextra/moreparts');
    }));
    it('maintains the path from the base url where both have multiple parts', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .get('/anything/multiple/anythingextra/moreparts')
            .reply(200, {
            url: 'http://microsoft.com/anything/multiple/anythingextra/moreparts',
            data: null,
            json: null
        });
        // Arrange
        let rest = new restm.RestClient('typed-rest-client-tests', 'http://microsoft.com/anything/multiple');
        // Act
        let restRes = yield rest.get('anythingextra/moreparts');
        // Assert
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'http://microsoft.com/anything/multiple/anythingextra/moreparts');
    }));
    it('maintains the path from the base url where request has query parameters', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .get('/anything/multiple/anythingextra/moreparts')
            .query({
            foo: 'bar',
            baz: 'top'
        })
            .reply(200, {
            url: 'http://microsoft.com/anything/multiple/anythingextra/moreparts?foo=bar&baz=top',
            data: null,
            json: null,
            args: { foo: 'bar', baz: 'top' }
        });
        // Arrange
        let rest = new restm.RestClient('typed-rest-client-tests', 'http://microsoft.com/anything/multiple');
        // Act
        let restRes = yield rest.get('anythingextra/moreparts?foo=bar&baz=top');
        // Assert
        assert(restRes.statusCode == 200, "statusCode should be 200");
        assert(restRes.result && restRes.result.url === 'http://microsoft.com/anything/multiple/anythingextra/moreparts?foo=bar&baz=top');
        assert(restRes.result && restRes.result.args.foo === 'bar');
        assert(restRes.result && restRes.result.args.baz === 'top');
    }));
    //
    // getUrl path tests
    //
    it('resolves a just host resource and no baseUrl', () => __awaiter(this, void 0, void 0, function* () {
        let res = util.getUrl('http://microsoft.com');
        assert(res === 'http://microsoft.com', "should be http://microsoft.com");
    }));
    it('resolves a empty resource with baseUrl', () => __awaiter(this, void 0, void 0, function* () {
        let res = util.getUrl('', 'http://microsoft.com');
        assert(res === 'http://microsoft.com', "should be http://microsoft.com");
    }));
    it('resolves a null resource with baseUrl', () => __awaiter(this, void 0, void 0, function* () {
        let res = util.getUrl(null, 'http://microsoft.com');
        assert(res === 'http://microsoft.com', "should be http://microsoft.com");
    }));
    it('resolves a full resource and no baseUrl', () => __awaiter(this, void 0, void 0, function* () {
        let res = util.getUrl('http://microsoft.com/get?x=y&a=b');
        assert(res === 'http://microsoft.com/get?x=y&a=b', `should be http://microsoft.com/get?x=y&a=b but is ${res}`);
    }));
    it('resolves a rooted path resource with host baseUrl', () => __awaiter(this, void 0, void 0, function* () {
        let res = util.getUrl('/get/foo', 'http://microsoft.com');
        assert(res === 'http://microsoft.com/get/foo', `should be http://microsoft.com/get/foo but is ${res}`);
    }));
    it('resolves a relative path resource with host baseUrl', () => __awaiter(this, void 0, void 0, function* () {
        let res = util.getUrl('get/foo', 'http://microsoft.com');
        assert(res === 'http://microsoft.com/get/foo', `should be http://microsoft.com/get/foo but is ${res}`);
    }));
    it('resolves a rooted path resource with pathed baseUrl', () => __awaiter(this, void 0, void 0, function* () {
        let res = util.getUrl('/get/foo', 'http://microsoft.com/bar');
        assert(res === 'http://microsoft.com/get/foo', "should be http://microsoft.com/get/foo");
    }));
    it('resolves a relative path resource with pathed baseUrl', () => __awaiter(this, void 0, void 0, function* () {
        let res = util.getUrl('get/foo', 'http://microsoft.com/bar');
        assert(res === 'http://microsoft.com/bar/get/foo', `should be http://microsoft.com/bar/get/foo but is ${res}`);
    }));
});
