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
const httpm = require("typed-rest-client/HttpClient");
const hm = require("typed-rest-client/Handlers");
const fs = require("fs");
const path = require("path");
let sampleFilePath = path.join(__dirname, 'testoutput.txt');
describe('Http Tests', function () {
    let _http;
    let _httpbin;
    before(() => {
        _http = new httpm.HttpClient('typed-test-client-tests');
    });
    after(() => {
    });
    it('constructs', () => {
        this.timeout(1000);
        let http = new httpm.HttpClient('typed-test-client-tests');
        assert(http, 'http client should not be null');
    });
    // responses from httpbin return something like:
    // {
    //     "args": {}, 
    //     "headers": {
    //       "Connection": "close", 
    //       "Host": "httpbin.org", 
    //       "User-Agent": "typed-test-client-tests"
    //     }, 
    //     "origin": "173.95.152.44", 
    //     "url": "https://httpbin.org/get"
    //  }  
    it('does basic http get request', () => __awaiter(this, void 0, void 0, function* () {
        let res = yield _http.get('http://httpbin.org/get');
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
        assert(obj.url === "http://httpbin.org/get");
    }));
    it('does basic https get request', () => __awaiter(this, void 0, void 0, function* () {
        let res = yield _http.get('https://httpbin.org/get');
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
        assert(obj.url === "https://httpbin.org/get");
    }));
    it('does basic http get request with basic auth', () => __awaiter(this, void 0, void 0, function* () {
        let bh = new hm.BasicCredentialHandler('johndoe', 'password');
        let http = new httpm.HttpClient('typed-rest-client-tests', [bh]);
        let res = yield http.get('http://httpbin.org/get');
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
        let auth = obj.headers.Authorization;
        let creds = Buffer.from(auth.substring('Basic '.length), 'base64').toString();
        assert(creds === 'johndoe:password', "should be the username and password");
        assert(obj.url === "http://httpbin.org/get");
    }));
    it('does basic http get request with pat token auth', () => __awaiter(this, void 0, void 0, function* () {
        let token = 'scbfb44vxzku5l4xgc3qfazn3lpk4awflfryc76esaiq7aypcbhs';
        let ph = new hm.PersonalAccessTokenCredentialHandler(token);
        let http = new httpm.HttpClient('typed-rest-client-tests', [ph]);
        let res = yield http.get('http://httpbin.org/get');
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
        let auth = obj.headers.Authorization;
        let creds = Buffer.from(auth.substring('Basic '.length), 'base64').toString();
        assert(creds === 'PAT:' + token, "creds should be the token");
        assert(obj.url === "http://httpbin.org/get");
    }));
    it('pipes a get request', () => {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let file = fs.createWriteStream(sampleFilePath);
            (yield _http.get('https://httpbin.org/get')).message.pipe(file).on('close', () => {
                let body = fs.readFileSync(sampleFilePath).toString();
                let obj = JSON.parse(body);
                assert(obj.url === "https://httpbin.org/get", "response from piped stream should have url");
                resolve();
            });
        }));
    });
    it('does basic get request with redirects', () => __awaiter(this, void 0, void 0, function* () {
        let res = yield _http.get("https://httpbin.org/redirect-to?url=" + encodeURIComponent("https://httpbin.org/get"));
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
        assert(obj.url === "https://httpbin.org/get");
    }));
    it('does basic get request with redirects (303)', () => __awaiter(this, void 0, void 0, function* () {
        let res = yield _http.get("https://httpbin.org/redirect-to?url=" + encodeURIComponent("https://httpbin.org/get") + '&status_code=303');
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
        assert(obj.url === "https://httpbin.org/get");
    }));
    it('returns 404 for not found get request on redirect', () => __awaiter(this, void 0, void 0, function* () {
        let res = yield _http.get("https://httpbin.org/redirect-to?url=" + encodeURIComponent("http://httpbin.org/status/404") + '&status_code=303');
        assert(res.message.statusCode == 404, "status code should be 404");
        let body = yield res.readBody();
    }));
    it('does not follow redirects if disabled', () => __awaiter(this, void 0, void 0, function* () {
        let http = new httpm.HttpClient('typed-test-client-tests', null, { allowRedirects: false });
        let res = yield http.get("https://httpbin.org/redirect-to?url=" + encodeURIComponent("https://httpbin.org/get"));
        assert(res.message.statusCode == 302, "status code should be 302");
        let body = yield res.readBody();
    }));
    it('does basic head request', () => __awaiter(this, void 0, void 0, function* () {
        let res = yield _http.head('http://httpbin.org/get');
        assert(res.message.statusCode == 200, "status code should be 200");
    }));
    it('does basic http delete request', () => __awaiter(this, void 0, void 0, function* () {
        let res = yield _http.del('http://httpbin.org/delete');
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
    }));
    it('does basic http post request', () => __awaiter(this, void 0, void 0, function* () {
        let b = 'Hello World!';
        let res = yield _http.post('http://httpbin.org/post', b);
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
        assert(obj.data === b);
        assert(obj.url === "http://httpbin.org/post");
    }));
    it('does basic http patch request', () => __awaiter(this, void 0, void 0, function* () {
        let b = 'Hello World!';
        let res = yield _http.patch('http://httpbin.org/patch', b);
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
        assert(obj.data === b);
        assert(obj.url === "http://httpbin.org/patch");
    }));
    it('does basic http options request', () => __awaiter(this, void 0, void 0, function* () {
        let res = yield _http.options('http://httpbin.org');
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
    }));
    it('returns 404 for not found get request', () => __awaiter(this, void 0, void 0, function* () {
        let res = yield _http.get('http://httpbin.org/status/404');
        assert(res.message.statusCode == 404, "status code should be 404");
        let body = yield res.readBody();
    }));
});
describe('Http Tests with keepAlive', function () {
    let _http;
    before(() => {
        _http = new httpm.HttpClient('typed-test-client-tests', [], { keepAlive: true });
    });
    after(() => {
    });
    it('does basic http get request with keepAlive true', () => __awaiter(this, void 0, void 0, function* () {
        let res = yield _http.get('http://httpbin.org/get');
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
        assert(obj.url === "http://httpbin.org/get");
    }));
    it('does basic head request with keepAlive true', () => __awaiter(this, void 0, void 0, function* () {
        let res = yield _http.head('http://httpbin.org/get');
        assert(res.message.statusCode == 200, "status code should be 200");
    }));
    it('does basic http delete request with keepAlive true', () => __awaiter(this, void 0, void 0, function* () {
        let res = yield _http.del('http://httpbin.org/delete');
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
    }));
    it('does basic http post request with keepAlive true', () => __awaiter(this, void 0, void 0, function* () {
        let b = 'Hello World!';
        let res = yield _http.post('http://httpbin.org/post', b);
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
        assert(obj.data === b);
        assert(obj.url === "http://httpbin.org/post");
    }));
    it('does basic http patch request with keepAlive true', () => __awaiter(this, void 0, void 0, function* () {
        let b = 'Hello World!';
        let res = yield _http.patch('http://httpbin.org/patch', b);
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
        assert(obj.data === b);
        assert(obj.url === "http://httpbin.org/patch");
    }));
    it('does basic http options request with keepAlive true', () => __awaiter(this, void 0, void 0, function* () {
        let res = yield _http.options('http://httpbin.org');
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
    }));
});
