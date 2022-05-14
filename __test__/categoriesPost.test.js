const request = require('supertest');
const app = require('../app');

const connection = require('../database/connection')
const dbBuild = require('../database/config/_build')

beforeEach(() => dbBuild());
afterAll(() => connection.end());



describe('categories  GET api/v1/categories', function () {
    it('post no data', () => {
        return request(app)
            .post('/api/v1/categories')
            .expect(422)
            .expect('Content-Type', /json/);
    });
    it('post small name', () => {
        return request(app)
            .post('/api/v1/categories')
            .send({ name: "as" })
            .expect(422)
            .expect('Content-Type', /json/);
    });
    it('post correct name', () => {
        return request(app)
            .post('/api/v1/categories')
            .send({ name: "test" })
            .expect(201)
            .expect('Content-Type', /json/);
    });
});