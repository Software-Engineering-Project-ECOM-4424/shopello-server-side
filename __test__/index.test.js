const request = require('supertest');
const app = require('../app');

describe('index', function () {
    it('GET /test  run', () => {
        return request(app)
            .get('/test')
            .expect(200)
            .expect('Content-Type', /json/);
    }); 
});
