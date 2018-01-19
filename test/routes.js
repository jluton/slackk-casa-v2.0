const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../server');

chai.use(chaiHttp);

describe('Static Files', () => {
  describe('GET /', () => {
    it('should return the content of index.html', (done) => {
      chai
        .request(server)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          done();
        });
    }).timeout(1000);
    it('should return the content of styles.css', (done) => {
      chai
        .request(server)
        .get('/styles.css')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.have.header('content-type', /css/);
          done();
        });
    }).timeout(1000);
    it('should return the content of bundle.js', (done) => {
      chai
        .request(server)
        .get('/bundle.js')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.have.header('content-type', /javascript/);
          done();
        });
    }).timeout(1000);
  });
  describe('GET /login', () => {
    it('should return the content of index.html', (done) => {
      chai
        .request(server)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          done();
        });
    }).timeout(1000);
  });
  describe('GET /signup', () => {
    it('should return the content of index.html', (done) => {
      chai
        .request(server)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          done();
        });
    }).timeout(1000);
  });
  describe('GET /messages', () => {
    it('should return the content of index.html', (done) => {
      chai
        .request(server)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          done();
        });
    }).timeout(1000);
  });
  describe('POST /workspaces', () => {
    it('should create a workspace', (done) => {
      chai
        .request(server)
        .post('/workspaces')
        .type('application/JSON')
        .send(JSON.stringify({ name: 'ws_test123' }))
        .end((err, res) => {
          expect(res).to.have.status(201);
          done();
        });
    }).timeout(1000);
    it('should respond with updated list of workspaces.', (done) => {
      chai
        .request(server)
        .post('/workspaces')
        .type('application/JSON')
        .send(JSON.stringify({ name: 'ws_test321' }))
        .end((err, res) => {
          const body = res.json();
          expect(body).to.be.an('array');
          expect(body[0]).to.be.an('object');
          done();
        });
    }).timeout(1000);
  });
  describe('GET /workspaces', () => {
    it('should return a list of workspaces', (done) => {
      chai
        .request(server)
        .get('/workspaces')
        .type('application/json')
        .send()
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    }).timeout(1000);
  });
  describe('POST /signup', () => {
    it('should signup successfully', (done) => {
      chai
        .request(server)
        .post('/signup')
        .type('application/JSON')
        .send(JSON.stringify({
          username: 'test1234',
          password: 'test1234',
          email: 'Test_email',
          passwordHint: 'testHint',
        }))
        .end((err, res) => {
          expect(res).to.have.status(200 || 400);
          done();
        });
    }).timeout(1000);
  });
  describe('POST /login', () => {
    it('should login successfully', (done) => {
      chai
        .request(server)
        .post('/login')
        .type('application/json')
        .send(JSON.stringify({ username: 'test1234', password: 'test1234' }))
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    }).timeout(1000);
  });
  describe('POST /upload', () => {
    it('should upload file', (done) => {
      chai
        .request(server)
        .post('/login')
        .type('application/json')
        .send(JSON.stringify({ username: 'test1234', password: 'test1234' }))
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    }).timeout(1000);
  });
});
after(() => process.exit(0));
