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
const httpm = require("typed-rest-client/HttpClient");
const hm = require("typed-rest-client/Handlers");
const fs = require("fs");
const path = require("path");
let sampleFilePath = path.join(__dirname, 'testoutput.txt');
describe('Http Tests', function () {
    let _http;
    before(() => {
        _http = new httpm.HttpClient('typed-test-client-tests');
    });
    after(() => {
    });
    afterEach(() => {
        nock.cleanAll();
    });
    it('constructs', () => {
        this.timeout(1000);
        let http = new httpm.HttpClient('typed-test-client-tests');
        assert(http, 'http client should not be null');
    });
    it('check invalid cert options', () => __awaiter(this, void 0, void 0, function* () {
        try {
            const param = { cert: { ca: 'dummy', caFile: 'dummy' } };
            new httpm.HttpClient('typed-test-client-tests', [], param);
            assert(false, 'Should be raised an exception.');
        }
        catch (e) {
            /* ok */
        }
        try {
            const param = { cert: { cert: 'dummy', certFile: 'dummy' } };
            new httpm.HttpClient('typed-test-client-tests', [], param);
            assert(false, 'Should be raised an exception.');
        }
        catch (e) {
            /* ok */
        }
        try {
            const param = { cert: { key: 'dummy', keyFile: 'dummy' } };
            new httpm.HttpClient('typed-test-client-tests', [], param);
            assert(false, 'Should be raised an exception.');
        }
        catch (e) {
            /* ok */
        }
    }));
    it('does basic http get request', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .get('/')
            .reply(200, {
            source: "nock"
        });
        let res = yield _http.get('http://microsoft.com');
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
        assert(obj.source === "nock", "http get request should be intercepted by nock");
    }));
    it('does basic http get request with basic auth', () => __awaiter(this, void 0, void 0, function* () {
        //Set nock for correct credentials
        nock('http://microsoft.com')
            .get('/')
            .basicAuth({
            user: 'johndoe',
            pass: 'password'
        })
            .reply(200, {
            success: true,
            source: "nock"
        });
        //Set nock for request without credentials or with incorrect credentials
        nock('http://microsoft.com')
            .get('/')
            .reply(200, {
            success: false,
            source: "nock"
        });
        let bh = new hm.BasicCredentialHandler('johndoe', 'password');
        let http = new httpm.HttpClient('typed-rest-client-tests', [bh]);
        let res = yield http.get('http://microsoft.com');
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
        assert(obj.source === "nock", "http get request should be intercepted by nock");
        assert(obj.success, "Authentication should succeed");
    }));
    it('does basic http get request with pat token auth', () => __awaiter(this, void 0, void 0, function* () {
        let token = 'scbfb44vxzku5l4xgc3qfazn3lpk4awflfryc76esaiq7aypcbhs';
        let pat = new Buffer('PAT:' + token).toString('base64');
        //Set nock for correct credentials
        nock('http://microsoft.com', {
            reqheaders: {
                'Authorization': 'Basic ' + pat,
                'X-TFS-FedAuthRedirect': 'Suppress'
            }
        })
            .get('/')
            .reply(200, {
            success: true,
            source: "nock"
        });
        //Set nock for request without credentials or with incorrect credentials
        nock('http://microsoft.com')
            .get('/')
            .reply(200, {
            success: false,
            source: "nock"
        });
        let ph = new hm.PersonalAccessTokenCredentialHandler(token);
        let http = new httpm.HttpClient('typed-rest-client-tests', [ph]);
        let res = yield http.get('http://microsoft.com');
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
        assert(obj.source === "nock", "http get request should be intercepted by nock");
        assert(obj.success, "Authentication should succeed");
    }));
    it('pipes a get request', () => {
        nock('http://microsoft.com')
            .get('/')
            .reply(200, {
            url: "http://microsoft.com"
        });
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let file = fs.createWriteStream(sampleFilePath);
            (yield _http.get('http://microsoft.com')).message.pipe(file).on('close', () => {
                let body = fs.readFileSync(sampleFilePath).toString();
                let obj = JSON.parse(body);
                assert(obj.url === "http://microsoft.com", "response from piped stream should have url");
                resolve();
            });
        }));
    });
    it('does basic get request with redirects', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .get('/redirect-to')
            .reply(301, undefined, {
            location: 'http://microsoft.com'
        });
        nock('http://microsoft.com')
            .get('/')
            .reply(200, {
            source: "nock"
        });
        let res = yield _http.get('http://microsoft.com/redirect-to');
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
        assert(obj.source === "nock", "request should redirect to mocked page");
    }));
    it('does basic get request with redirects (303)', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .get('/redirect-to')
            .reply(303, undefined, {
            location: 'http://microsoft.com'
        });
        nock('http://microsoft.com')
            .get('/')
            .reply(200, {
            source: "nock"
        });
        let res = yield _http.get('http://microsoft.com/redirect-to');
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
        assert(obj.source === "nock", "request should redirect to mocked page");
    }));
    it('returns 404 for not found get request on redirect', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .get('/redirect-to')
            .reply(301, undefined, {
            location: 'http://badmicrosoft.com'
        });
        nock('http://badmicrosoft.com')
            .get('/')
            .reply(404, {
            source: "nock"
        });
        let res = yield _http.get('http://microsoft.com/redirect-to');
        assert(res.message.statusCode == 404, "status code should be 404");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
        assert(obj.source === "nock", "request should redirect to mocked missing");
    }));
    it('does not follow redirects if disabled', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .get('/redirect-to')
            .reply(302, undefined, {
            location: 'http://microsoft.com'
        });
        nock('http://microsoft.com')
            .get('/')
            .reply(200, {
            source: "nock"
        });
        let http = new httpm.HttpClient('typed-test-client-tests', null, { allowRedirects: false });
        let res = yield http.get('http://microsoft.com/redirect-to');
        assert(res.message.statusCode == 302, "status code should be 302");
        let body = yield res.readBody();
    }));
    it('does basic head request', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .head('/')
            .reply(200, {
            source: "nock"
        });
        let res = yield _http.head('http://microsoft.com');
        assert(res.message.statusCode == 200, "status code should be 200");
    }));
    it('does basic http delete request', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .delete('/')
            .reply(200, {
            source: "nock"
        });
        let res = yield _http.del('http://microsoft.com');
        assert(res.message.statusCode == 200, "status code should be 200");
    }));
    it('does basic http post request', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .post('/')
            .reply(200, function (uri, requestBody) {
            return { data: requestBody };
        });
        let b = 'Hello World!';
        let res = yield _http.post('http://microsoft.com', b);
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
        assert(obj.data === b);
    }));
    it('does basic http patch request', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .patch('/')
            .reply(200, function (uri, requestBody) {
            return { data: requestBody };
        });
        let b = 'Hello World!';
        let res = yield _http.patch('http://microsoft.com', b);
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
        assert(obj.data === b);
    }));
    it('does basic http options request', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .options('/')
            .reply(200);
        let res = yield _http.options('http://microsoft.com');
        assert(res.message.statusCode == 200, "status code should be 200");
    }));
    it('returns 404 for not found get request', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://badmicrosoft.com')
            .get('/')
            .reply(404);
        let res = yield _http.get('http://badmicrosoft.com');
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
        nock('http://microsoft.com')
            .get('/')
            .reply(200, {
            source: "nock"
        });
        let res = yield _http.get('http://microsoft.com');
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
        assert(obj.source === "nock", "http get request should be intercepted by nock");
    }));
    it('does basic head request with keepAlive true', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .head('/')
            .reply(200, {
            source: "nock"
        });
        let res = yield _http.head('http://microsoft.com');
        assert(res.message.statusCode == 200, "status code should be 200");
    }));
    it('does basic http delete request with keepAlive true', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .delete('/')
            .reply(200, {
            source: "nock"
        });
        let res = yield _http.del('http://microsoft.com');
        assert(res.message.statusCode == 200, "status code should be 200");
    }));
    it('does basic http post request with keepAlive true', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .post('/')
            .reply(200, function (uri, requestBody) {
            return { data: requestBody };
        });
        let b = 'Hello World!';
        let res = yield _http.post('http://microsoft.com', b);
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
        assert(obj.data === b);
    }));
    it('does basic http patch request with keepAlive true', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .patch('/')
            .reply(200, function (uri, requestBody) {
            return { data: requestBody };
        });
        let b = 'Hello World!';
        let res = yield _http.patch('http://microsoft.com', b);
        assert(res.message.statusCode == 200, "status code should be 200");
        let body = yield res.readBody();
        let obj = JSON.parse(body);
        assert(obj.data === b);
    }));
    it('does basic http options request with keepAlive true', () => __awaiter(this, void 0, void 0, function* () {
        nock('http://microsoft.com')
            .options('/')
            .reply(200);
        let res = yield _http.options('http://microsoft.com');
        assert(res.message.statusCode == 200, "status code should be 200");
    }));
});
