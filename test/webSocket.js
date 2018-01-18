const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { spy } = require('sinon');
const WebSocket = require('ws');
const { incomingMessageNotification } = require('./../client/src/helpers.js');

const server = require('../server');

let ws = null;
let ws2 = null;

const postMessage = function(ws) {
  ws.send(JSON.stringify({
    method: 'POSTMESSAGE',
    data: {
      text: 'test message',
      username: 'test user',
      workspaceId: 1,
    },
  }));
};

describe('WebSockets', () => {
  beforeEach((done) => {
    ws = new WebSocket(`ws://localhost:${process.env.PORT || 3000}`);
    ws.onopen = () => {
      done();
    };
  });
  afterEach((done) => {
    ws.terminate();
    done();
  });
  describe('GETMESSAGES', () => {
    it('should return a response object', (done) => {
      ws.send(JSON.stringify({
        method: 'GETMESSAGES',
        data: { workspaceId: 1 },
      }));
      ws.on('message', (data) => {
        let parsedData = JSON.parse(data);
        expect(parsedData).to.be.an('object');
        expect(parsedData.code).to.be.a('number');
        expect(parsedData.method).to.a('string');
        expect(parsedData.message).to.be.a('string');
        done();
      });
    }).timeout(1000);
    it('should return a list of messages', (done) => {
      ws.send(JSON.stringify({
        method: 'GETMESSAGES',
        data: { workspaceId: 1 },
      }));
      ws.on('message', (data) => {
        let parsedData = JSON.parse(data);
        expect(parsedData.data).to.be.an('array');
        done();
      });
    }).timeout(1000);
  });
  describe('POSTMESSAGE', () => {
    it('should return a response object', (done) => {
      postMessage(ws);
      ws.on('message', (data) => {
        let parsedData = JSON.parse(data);
        expect(parsedData.code).to.be.a('number');
        expect(parsedData.method).to.a('string');
        expect(parsedData.message).to.be.a('string');
        done();
      });
    }).timeout(1000);
    it('should return a message object', (done) => {
      postMessage(ws);
      ws.on('message', (data) => {
        let parsedData = JSON.parse(data);
        expect(parsedData.data).to.be.an('object');
        expect(parsedData.data.id).to.be.a('number');
        expect(parsedData.data.text).to.equal('test message');
        expect(parsedData.data.username).to.equal('test user');
        done();
      });
    }).timeout(1000);
  });
  describe('NEWMESSAGE', () => {
    beforeEach((done) => {
      ws2 = new WebSocket(`ws://localhost:${process.env.PORT || 3000}`);
      ws2.onopen = () => {
        done();
      };
    });
    afterEach((done) => {
      ws2.terminate();
      done();
    });
    it('should send a response object when a new message is received by the server', (done) => {
      postMessage(ws);
      ws2.on('message', (data) => {
        let parsedData = JSON.parse(data);
        expect(parsedData.code).to.be.a('number');
        expect(parsedData.method).to.a('string');
        expect(parsedData.message).to.be.a('string');
        done();
      });
    }).timeout(1000);
    it('should send a message object', (done) => {
      postMessage(ws);
      ws2.on('message', (data) => {
        let parsedData = JSON.parse(data);
        expect(parsedData.data.message.id).to.be.a('number');
        expect(parsedData.data.message.text).to.equal('test message');
        expect(parsedData.data.message.username).to.equal('test user');
        expect(parsedData.data.workspaceId).to.be.a('number');
        done();
      });
    }).timeout(1000);
    // it('should generate a notification upon message receipt', (done) => {
    //   const notificationSpy = spy(incomingMessageNotification);
    //   postMessage(ws);
    //   ws2.on('message', () => {
    //     expect(notificationSpy).to.have.been.called;
    //     done();
    //   });
    // }).timeout(1000);
  });
});

after(() => process.exit(0));

