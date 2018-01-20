const { expect, be } = require('chai');
const { Client } = require('pg');
const db = require('../database');

describe('Database', () => {
  describe('client.connect', () => {
    it('should connect to the database', (done) => {
      const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
      });
      client.connect((err) => {
        expect(err).to.not.be.an('error');
        client.end();
        done();
      });
    }).timeout(1000);
  });
  describe('initializeDB', () => {
    it('should create a workspaces table', (done) => {
      db.initializeDB().then(db.client.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'",
        (err, data) => {
          let tables = [];
          data.rows.forEach(table => tables.push(table.table_name));
          expect(tables).to.include.members(['workspaces']);
          done();
        },
      ));
    }).timeout(1000);
    it('should create a users table', (done) => {
      db.initializeDB().then(db.client.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'",
        (err, data) => {
          let tables = [];
          data.rows.forEach(table => tables.push(table.table_name));
          expect(tables).to.include.members(['users']);
          done();
        },
      ));
    }).timeout(1000);
  });
  describe('createWorkspace', () => {
    it('should add an entry into the workspaces table', (done) => {
      db
        .createWorkspace('testspace2', 'ws_testspace2')
        .then(() => db.client.query('SELECT * FROM workspaces WHERE name = $1', ['testspace2']))
        .then((data) => {
          expect(data.rows[0].id).to.be.a('number');
          expect(data.rows[0].name).to.equal('testspace2');
          expect(data.rows[0].db_name).to.equal('ws_testspace2');
          done();
        });
    }).timeout(1000);
  });
  describe('getWorkspaces', () => {
    it('should get workspaces from the table', (done) => {
      db.getWorkspaces().then((data) => {
        expect(data).to.be.an('array');
        expect(data[0].id).to.be.a('number');
        expect(data[0].name).to.be.a('string');
        expect(data[0].db_name).to.be.a('string');
        done();
      });
    }).timeout(1000);
  });
  describe('postMessage', () => {
    it('should post a message to a workspace', (done) => {
      db.postMessage('test message', 'test user', 1).then((data) => {
        expect(data.rows[0].id).to.be.a('number');
        expect(data.rows[0].text).to.equal('test message');
        expect(data.rows[0].username).to.equal('test user');
        done();
      });
    }).timeout(1000);
  });
  describe('getMessages', () => {
    it('should get messages from a workspace', (done) => {
      db.getMessages(1).then((data) => {
        expect(data).to.be.an('array');
        expect(data[0].id).to.be.a('number');
        expect(data[0].text).to.be.a('string');
        expect(data[0].username).to.be.a('string');
        expect(data[0].createdAt).to.be.a('date');
        done();
      });
    }).timeout(1000);
  });
  describe('createUser', () => {
    it('should create a user with login and password', (done) => {
      db.createUser('test', 'test', 'test@test.com').then((data) => {
        expect(data.username).to.equal('test');
        expect(data.password).to.equal('test');
        done();
      });
    }).timeout(1000);
  });
  describe('getUser', () => {
    it('should get a user\'s login info', (done) => {
      db.getUser('test').then((data) => {
        expect(data.password).to.equal('test');
        done();
      });
    }).timeout(1000);
  });

  describe('joinWorkspace and isInWorkspace', () => {
    it('join and leave workspaces', (done) => {
      db.isInWorkspace('test', 0).then((data) => {
        expect(data).to.equal(false);
      })
        .then(() => db.joinWorkspace('test', 0, 'add'))
        .then(() => db.isInWorkspace('test', 0))
        .then((data) => {
          expect(data).to.equal(true);
        })
        .then(() => db.getMembers(0))
        .then(data => expect(data.indexOf('test')).to.not.equal(-1))
        .then(() => db.joinWorkspace('test', 0, 'drop'))
        .then(() => db.isInWorkspace('test', 0))
        .then((data) => {
          expect(data).to.equal(false);
        })
        .then(() => db.getMembers(0))
        .then(data => {
          expect(data.indexOf('test')).to.equal(-1)
          done();
        });
  }).timeout(4000);
});

});
