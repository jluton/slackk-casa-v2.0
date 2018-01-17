const { expect } = require('chai');
const auth = require('../server/auth');
const db = require('../database');

describe('Auth', () => {
  describe('auth.addUser', () => {
    it('should add a user to the database', (done) => {
      auth
        .addUser('testUser', 'testPassword', 'test@test.com')
        .then(() => db.getUser('testUser'))
        .then((data) => {
          expect(data.password).to.be.a('string');
          done();
        });
    }).timeout(1000);
    it("should encrypt the user's password in the database", (done) => {
      db.getUser('testUser').then((data) => {
        expect(data.password).to.not.equal('testPassword');
        done();
      });
    }).timeout(1000);
  });
  describe('auth.checkUser', () => {
    it('should respond true if username and password are correct', (done) => {
      auth.checkUser('testUser', 'testPassword').then((result) => {
        expect(result).to.be.true;
        done();
      });
    }).timeout(1000);
    it('should respond false if username or password are incorrect', (done) => {
      auth.checkUser('testUser', 'testPasswordd').then((result) => {
        expect(result).to.be.false;
        done();
      });
    }).timeout(1000);
    it('This test test should fail', (done) => {
      expect(1).to.equal(2);
      done();
    });
  });
});
