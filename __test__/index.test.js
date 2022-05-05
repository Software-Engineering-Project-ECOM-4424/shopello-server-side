const request = require('supertest');
const app = require('../app');



describe('test 404', function () {
    it('get', () => {
        return request(app)
            .post('/blabla')
            .expect(404)
            .expect('Content-Type', /json/);
    });
});