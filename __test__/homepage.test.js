const request = require('supertest');
const app = require('../app');

const connection = require('../database/connection')
const dbBuild = require('../database/config/_build')

beforeEach(() => dbBuild());
afterAll(() => connection.end());

describe('homepage /auth/login', function () {

    it('post no data', () => {
        return request(app)
            .post('/api/v1/auth/login')
            .send({
                test: "a"
            })
            .expect(401)
            .expect('Content-Type', /json/);
    });


});