const request = require('supertest');
const app = require('../app');

const connection = require('../database/connection')
const dbBuild = require('../database/config/_build')

beforeEach(() => dbBuild());
afterAll(() => connection.end());

