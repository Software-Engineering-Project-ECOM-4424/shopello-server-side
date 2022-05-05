const request = require('supertest');
const app = require('../app');

const connection = require('../database/connection')
const dbBuild = require('../database/config/_build')

beforeEach(() => dbBuild());
afterAll(() => connection.end());




describe('Create new Customer /auth/signup', function () {
    it('post no data', () => {
        return request(app)
            .post('/api/v1/auth/signup')
            .send({
                test: "a"
            })
            .expect(422)
            .expect('Content-Type', /json/);
    });
    it('post just email  run', () => {
        return request(app)
            .post('/api/v1/auth/signup')
            .send({
                email: "test@test.con",
            })
            .expect(422)
            .expect('Content-Type', /json/);
    });
    it('post short password  run', () => {
        return request(app)
            .post('/api/v1/auth/signup')
            .send({
                email: "test@test.con",
                username: "Osama",
                password: "fasd"
            })
            .expect(422)
    });
    it('post existed user  run', () => {
        return request(app)
            .post('/api/v1/auth/signup')
            .send({
                email: "osama@test.com",
                username: "Osama",
                password: "qwerasdQ!1@#"
            })
            .expect(409)
    });
    it('post valid signup  run', () => {
        return request(app)
            .post('/api/v1/auth/signup')
            .send({
                email: "test@gmail.com",
                username: "Osama",
                password: "qwerasdQ!1@#"
            })
            .expect(201)
    });
});

