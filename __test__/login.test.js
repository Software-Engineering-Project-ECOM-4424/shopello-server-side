const request = require('supertest');
const app = require('../app');

const connection = require('../database/connection')
const dbBuild = require('../database/config/_build')

beforeEach(() => dbBuild());
afterAll(() => connection.end());

describe('login /auth/login', function () {
    it('post no data', () => {
        return request(app)
            .post('/api/v1/auth/login')
            .send({
                test: "a"
            })
            .expect(401)
            .expect('Content-Type', /json/);
    });
    it('post short password', () => {
        return request(app)
            .post('/api/v1/auth/login')
            .send({
                email: "osama@test.com",
                password: "asdf"
            })
            .expect(401)
            .expect('Content-Type', /json/);
    });
     it('post false email', () => {
        return request(app)
            .post('/api/v1/auth/login')
            .send({
                email: "osama",
                password: "asdfaasdfasdf2344!@#SD"
            })
            .expect(401)
            .expect('Content-Type', /json/);
    });
    it('post false password', () => {
        return request(app)
            .post('/api/v1/auth/login')
            .send({
                email: "osama@test.com",
                password: "qwerasdQ!1@#23r"
            })
            .expect(401)
            .expect('Content-Type', /json/);
    });
    it('post correct login', () => {
        return request(app)
            .post('/api/v1/auth/login')
            .send({
                email: "osama@test.com",
                password: "qwerasdQ!1@#"
            })
            .expect(200)
            .expect('Content-Type', /json/);
    });
});