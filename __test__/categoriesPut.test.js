const request = require('supertest');
const app = require('../app');

const connection = require('../database/connection')
const dbBuild = require('../database/config/_build')

beforeEach(() => dbBuild());
afterAll(() => connection.end());



describe('categories  GET api/v1/categories', function () {
    it('put no data', () => {
        return request(app)
            .put('/api/v1/categories/1')
            .expect(422)
            .expect('Content-Type', /json/);
    });
    it('update nonfound entity', () => {
        return request(app)
            .put('/api/v1/categories/185')
            .send({name: "data"})
            .expect(404)
            .expect('Content-Type', /json/);
    });

});