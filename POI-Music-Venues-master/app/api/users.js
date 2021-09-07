'use strict';

const User = require('../models/user');
const Boom = require('@hapi/boom');

const Users = {

  find: {
    auth: false,
    handler: async function(request, h) {
      const users = await User.find();
      return users;
    }
  },

  findOne: {
    auth: false,
    handler: async function(request, h) {
      try {
        const user = await User.findOne({ _id: request.params.id });
        if (!user) {
          return Boom.notFound('No User with this id');
        }
        return user;
      } catch (err) {
        return Boom.notFound('No User with this id');
      }
    }
  },


  create: {
    auth: false,
    handler: async function(request, h) {
      const newUser = new User(request.payload);
      const user = await newUser.save();
      if (user) {
        return h.response(user).code(201);
      }
      return Boom.badImplementation('error creating candidate');
    }
  },

  deleteAll: {
    auth: false,
    handler: async function(request, h) {
      await User.deleteMany({});
      return { success: true };
    }
  },

  deleteOne: {
    auth: false,
    handler: async function(request, h) {
      const user = await User.deleteOne({ _id: request.params.id });
      if (user) {
        return { success: true };
      }
      return Boom.notFound('id not found');
    }
  },

  makeAdmin: {
    auth: false,
    handler: async function(request, h) {
      try {
        const user = await User.findOne({_id: request.params.id});
        if (user) {
          user.admin = true;
          user.save();
          return user;
        }
        return Boom.notFound(' user id not found');
      } catch (err) {
        return Boom.badImplementation('error fetching ');
      }
    }
  },


  removeAdmin: {
    auth: false,
    handler: async function(request, h) {
      try {
        const user = await User.findOne({_id: request.params.id});
        if (user) {
          user.admin = false;
          user.save();
          return user;
        }
        return Boom.notFound(' user id not found');
      } catch (err) {
        return Boom.badImplementation('error fetching ');
      }
    }
  },

  lastLogin: {
    auth: false,
    handler: async function(request, h) {
      try {
        const user = await User.findOne({_id: request.params.id});
        if (user) {
          return {"lastLogin" : user.lastLogin};
        }
        return Boom.notFound(' user id not found');
      } catch (err) {
        return Boom.badImplementation('error fetching ');
      }
    }
  }


};


module.exports = Users;