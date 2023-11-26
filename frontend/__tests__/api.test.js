// TODO

/* const axios = require('axios');
const express = require('express');
const cors = require('cors');
const {describe, expect, test, afterAll} = require('@jest/globals');

const API_BASE_URL = 'http://localhost:8080/api';

const app = express();
app.use(cors());

const server = app.listen(8080, () => {
  console.log('Server is running on port 8080');
});

describe('Quarkus REST API Tests', () => {
  test('POST Add User endpoint', async () => {
    const response = await axios.post(
      `${API_BASE_URL}/users/register`,
    );
    expect(response.status).toBe(201);
  });

  test('GET CSV endpoint', async () => {
    const response = await axios.get(
      `${API_BASE_URL}/rooms/<some_room_id>/download/csv`,
    );
    expect(response.status).toBe(200);
  });

  test('POST Idea endpoint', async () => {
    const ideaData = {
      content: '<some_content>',
      roomId: '<some_room_id>',
      memberId: '<some_room_member_id>',
    };

    const response = await axios.post(`${API_BASE_URL}/ideas/`, ideaData);
    expect(response.status).toBe(201);
  });

  test('GET Rooms endpoint', async () => {
    const response = await axios.get(`${API_BASE_URL}/rooms/list`);
    expect(response.status).toBe(200);
  });

  test('POST Add Room endpoint', async () => {
    const roomData = {
      type: 'brainwritingroom',
    };

    const response = await axios.post(`${API_BASE_URL}/rooms/create`, roomData);
    expect(response.status).toBe(201);
  });

  test('GET Users endpoint', async () => {
    const response = await axios.get(`${API_BASE_URL}/users/list`);
    expect(response.status).toBe(200);
  });

  test('POST Add Participation endpoint', async () => {
    const participationData = {
      roomType: 'brainwritingroom',
      roomId: '<some_room_id>',
      memberId: '<some_room_member_id>',
    };

    const response = await axios.post(
      `${API_BASE_URL}/participations/participate`,
      participationData,
    );
    expect(response.status).toBe(201);
  });

  test('DELETE Remove Participations endpoint', async () => {
    const participationData = {
      roomType: 'brainwritingroom',
      roomId: '<some_room_id>',
      memberId: '<some_room_member_id>',
      sessionId: '<some_session_id>',
    };

    const response = await axios.delete(
      `${API_BASE_URL}/participations/remove`,
      {data: participationData},
    );
    expect(response.status).toBe(204);
  });

  test('DELETE Delete Participation endpoint', async () => {
    const participationData = {
      roomType: 'brainwritingroom',
      roomId: '<some_room_id>',
      memberId: '<some_room_member_id>',
    };

    const response = await axios.delete(
      `${API_BASE_URL}/participations/remove`,
      {data: participationData},
    );
    expect(response.status).toBe(204);
  });

  test('GET Participations endpoint', async () => {
    const response = await axios.get(`${API_BASE_URL}/participations/list`);
    expect(response.status).toBe(200);
  });

  test('GET Ideas by Room ID endpoint', async () => {
    const roomId = '<some_room_id>';
    const response = await axios.get(`${API_BASE_URL}/ideas/${roomId}`);
    expect(response.status).toBe(200);
  });

  afterAll(() => {
    server.close();
  });
});
 */
