import request from 'supertest';
import app from '../server.js';

describe('API Routes Test', () => {
    //  Test root route
    it('GET / should return 200 and welcome message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('API Working');
    });

    //  Test course listing route
    it('GET /api/course/all should return courses', async () => {
        const res = await request(app).get('/api/course/all');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success');
        expect(Array.isArray(res.body.courses)).toBe(true);
    });

    //  Invalid route should return 404 or appropriate error
    it('GET /nonexistent should return 404 or custom error', async () => {
        const res = await request(app).get('/nonexistent');
        expect([404, 400, 500]).toContain(res.statusCode); // Adjust based on your error handler
    });


    //  Access AI tag extractor with sample input
    it('POST /api/ai/extract-tags with valid input should return tags', async () => {
        const res = await request(app)
            .post('/api/ai/extract-tags')
            .send({ input: 'learn React and MongoDB' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success');
    });

    // . Get a course with invalid ID
    it('GET /api/course/invalid-id should fail', async () => {
        const res = await request(app).get('/api/course/invalid-id');
        expect(res.statusCode).toBe(200); // or 400/404 if you handle invalid IDs properly
        expect(res.body.success).toBe(false);
    });


    // 9. Submit a course fact request
    it('POST /api/ai/course-fact with topic should return a fact', async () => {
        const res = await request(app)
            .post('/api/ai/course-fact')
            .send({ topic: 'JavaScript' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('fact');
    });


});
