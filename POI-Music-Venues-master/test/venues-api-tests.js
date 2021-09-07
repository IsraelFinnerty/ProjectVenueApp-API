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
/*
  test('get venue details', async function () {

  get categories

  get locations
 */

});