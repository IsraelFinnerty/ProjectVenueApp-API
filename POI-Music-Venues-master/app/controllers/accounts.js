'use strict';

const User = require('../models/user');
const Venue = require('../models/venues');
const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');          // For password hashing
const saltRounds = 10;                     //For password salting

const Accounts = {
    index: {
        auth: false,
        handler: function(request, h) {
            return h.view('main', { title: 'Welcome to Rhythm & Booze' });
        }
    },

    showSignup: {
        auth: false,
        handler: function(request, h) {
            return h.view('signup', { title: 'Sign up for a Rhythm & Booze account' });
        }
    },

    signup: {
        auth: false,
        validate: {
            payload: {
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string()
                    .email()
                    .required(),
                password: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('signup', {
                        title: 'Sign up error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function (request, h) {
            const payload = request.payload;
            const previousUser = await User.findByEmail(payload.email);
            try {
                if (!previousUser) {
                    const hash = await bcrypt.hash(payload.password, saltRounds);    // for hashing and salting
                    const newUser = new User({
                        firstName: payload.firstName,
                        lastName: payload.lastName,
                        email: payload.email,
                        password: hash,
                        lastLogin: new Date().toUTCString(),
                        admin: false
                    });
                    const user = await newUser.save();
                    request.cookieAuth.set({id: user.id});
                    return h.redirect('/home');
                } else {
                    const message = 'Email address is already in use!';
                    throw Boom.badData(message);
                }
            }
        catch (err) {
                return h.view('signup', { errors: [{ message: err.message }] });
            }
        }
    },


    showSettings: {
        handler: async function(request, h) {
            try {
                const id = request.auth.credentials.id;
                const user = await User.findById(id).lean();
                return h.view('settings', {title: 'Settings', user: user});
            }
        catch (err) {
                return h.view('login', { errors: [{ message: err.message }] });
        }
    }
    },

    settings: {
        validate: {
            payload: {
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string()
                    .email()
                    .required(),
                password: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('settings', {
                        title: 'Sign up error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            try {
                const userEdit = request.payload;
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                user.firstName = userEdit.firstName;
                user.lastName = userEdit.lastName;
                user.email = userEdit.email;
                user.password = userEdit.password;
                await user.save();
                return h.redirect('/settings');
            }
            catch (err) {
                return h.view('settings', { errors: [{ message: err.message }] });
            }
        }
    },


    showLogin: {
        auth: false,
        handler: function(request, h) {
            return h.view('login', { title: 'Login to Donations' });
        }
    },

    login: {
        auth: false,
        validate: {
            payload: {
                email: Joi.string()
                    .email()
                    .required(),
                password: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('login', {
                        title: 'Log in error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            const { email, password } = request.payload;
            try {
                let user = await User.findByEmail(email);
                if (!user) {
                    const message = 'Email address is not registered';
                    throw Boom.unauthorized(message);
                }
                else if(user.admin)
                {
                    user.comparePassword(password);
                    request.cookieAuth.set({id: user.id});
                    user.lastLogin = new Date().toUTCString();
                    await user.save();
                    let listUsers = await User.find().lean();
                    return h.redirect('/admin');
                }
                else {
                    user.comparePassword(password);
                    user.lastLogin = new Date().toUTCString();
                    await user.save();
                    request.cookieAuth.set({id: user.id});
                    return h.redirect('/home');
                }
            } catch (err) {
                return h.view('login', { errors: [{ message: err.message }] });
            }
        }
    },

    admin: {
        handler: async function (request, h) {
            let listUsers = await User.find().lean();
            let venues = await Venue.find().lean();
            let categories= venues.length;
            let venueCount=0;

            for (let i=0; i<venues.length; i++)
            {
              for (let j=0; j<venues[i].pois.length; j++)
              {
                  venueCount++;
              }
            }
            let usersNum = listUsers.length;
            let adminCount=0;
            for (let users of listUsers){
                if(users.admin){ adminCount++;}
            }

            return h.view('admin',
                {
                    title: 'Admin Dashboard',
                    listUsers: listUsers,
                    categories: categories,
                    usersNum: usersNum,
                    venueCount: venueCount,
                    adminCount: adminCount
                });
        }
    },

    deleteUser: {
        handler: async function(request, h) {
            const id = request.params.id;
            try {
                await User.deleteUser(id);
                return  h.redirect('/admin');
            }
            catch (err) {
                return h.redirect('/admin', { errors: [{ message: err.message }] });
            }
        }
    },


    adminUpdate: {
        handler: async function(request, h) {
            try {
                const id = request.params.id;
                const user = await User.findById(id).lean();
                return h.view('adminsettings', {title: 'Update User Settings', user: user});
            }
            catch (err) {
                return h.view('login', { errors: [{ message: err.message }] });
            }
        }
    },

    adminApplyUpdate: {
        validate: {
            payload: {
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string()
                    .email()
                    .required(),
                password: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('admin', {
                        title: 'Sign up error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            try {
                const userEdit = request.payload;
                const id = request.params.id;
                const user = await User.findById(id);
                user.firstName = userEdit.firstName;
                user.lastName = userEdit.lastName;
                user.email = userEdit.email;
                user.password = userEdit.password;
                await user.save();
                return h.redirect('/admin/update/'+id);
            }
            catch (err) {
                return h.view('adminsettings', { errors: [{ message: err.message }] });
            }
        }
    },


    adminMakeAdmin: {
        handler: async function (request, h) {
            const id = request.params.id;
            const user = await User.findById(id);
            if(user.admin === true) user.admin=false;
            else user.admin = true;
            await user.save();
            return h.redirect('/admin');
        }
    },


    logout: {
        handler: function(request, h) {
            request.cookieAuth.clear();
            return h.redirect('/');
        }
    }
};

module.exports = Accounts;