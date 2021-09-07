'use strict';

const assert = require('chai').assert;
const POIService = require('./poi-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('User API tests', function () {

  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const POI = new POIService(fixtures.POI);
  setup(async function () {
    await POI.deleteAllUsers();
  });

  teardown(async function () {
    await POI.deleteAllUsers();
  });

  test('create a user', async function () {
    const returnedUser = await POI.createUser(newUser);
    assert(_.some([returnedUser], newUser), 'returned User must be a superset of new User');
    assert.isDefined(returnedUser._id);
  });


  test('get user', async function() {
    const u1 = await POI.createUser(newUser);
    const u2 = await POI.getUser(u1._id);
    assert.deepEqual(u1, u2);
  });

  test('get invalid user', async function () {
    const u1 = await POI.getUser('1234');
    assert.isNull(u1);
    const u2 = await POI.getUser('012345678901234567890123');
    assert.isNull(u2);
  });

  test('get all users empty', async function() {
    const allUsers = await POI.getUsers();
    assert.equal(allUsers.length, 0);
  });


  test('delete a user', async function() {
    let u = await POI.createUser(newUser);
    assert(u._id != null);
    await POI.deleteOneUser(u._id);
    u = await POI.getUser(u._id);
    assert(u == null);
  });

  test('get all users', async function() {
    for (let u of users) {
      await POI.createUser(u);
    }

    const allUsers = await POI.getUsers();
    assert.equal(allUsers.length, users.length);
  });

  test('get users detail', async function() {
    for (let u of users) {
      await POI.createUser(u);
    }

    const allUsers = await POI.getUsers();
    for (var i = 0; i < users.length; i++) {
      assert(_.some([allUsers[i]], users[i]), 'returnedUser must be a superset of newUser');
    }
  });


  test('make user admin', async function() {
    const returnedUser = await POI.createUser(newUser);
    returnedUser.admin = true;
    assert.equal(returnedUser.admin, true);

  });

});
