const request = require('supertest');
const app = require('../app');

const connection = require('../database/connection')
const dbBuild = require('../database/config/_build')

beforeEach(() => dbBuild());
afterAll(() => connection.end());



describe('categories  GET api/v1/categories', function () {
    it('get data', () => {
        return request(app)
            .get('/api/v1/categories')
            .expect(200)
            .expect('Content-Type', /json/);
    });
});