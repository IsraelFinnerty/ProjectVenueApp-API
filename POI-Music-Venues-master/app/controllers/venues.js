'use strict';

const Venue = require('../models/venues');
const User = require('../models/user');
const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');

const Venues = {
    addVenueForm: {
        handler: async function(request, h) {
            const venues = await Venue.find().lean();
            return h.view('home', {
                title: 'Add a venue',
                venues: venues
            });
        }
    },

    category: {
        handler: async function(request, h) {
            const venues = await Venue.find().lean();
            const userid = request.auth.credentials.id;
            const user = await User.findById(userid).lean();
            return h.view('category', {
                title: 'Add a category',
                venues: venues,
                user: user
            });
        }
    },

    addCategory: {
        validate: {
            payload: {
                category: Joi.string().required(),
                   },
            options: {
                abortEarly: false
            },
            failAction: async function(request, h, error) {
                const venues = await Venue.find().lean();
                return h
                    .view('category', {
                        title: 'Add Category Error',
                        venues: venues,
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            try {
                const venues = await Venue.find().lean();
                const payload = request.payload;
                const newCategory = new Venue({
                    category: payload.category
                })
                await newCategory.save();
                return h.redirect('/category', {
                    title: 'Add a category',
                    venues: venues
                });
            }
            catch (err) {
                    return h.view('category', { errors: [{ message: err.message }] });
                }
        }
    },

    deleteCategory: {
        handler: async function(request, h) {
            const id = request.params.id;
             try {
                await Venue.deleteCategory(id);
                return  h.redirect('/category');
            }
            catch (err) {
                return h.redirect('/category', { errors: [{ message: err.message }] });
            }
        }

    },

    report: {
        handler: async function(request, h) {
            const venues = await Venue.find().lean();
            const userid = request.auth.credentials.id;
            const user = await User.findById(userid).lean();
                 return h.view('report', {
                title: 'Venues',
                venues: venues,
                user: user
                });
        }
    },

    addVenue: {
        validate: {
            payload: {
                category: Joi.string().required(),
                name: Joi.string().required(),
                location: Joi.string().required(),
                lat: Joi.number().required(),
                long: Joi.number().required(),
                website: Joi.string().required(),
                imageMain: Joi.string(),
                image1: Joi.string(),
                image2: Joi.string(),
                image3: Joi.string(),
                description: Joi.string().required(),
                },
            options: {
                abortEarly: false
            },
            failAction: async function(request, h, error) {
                const venues = await Venue.find().lean();
                return h
                    .view('home', {
                        title: 'Add Venue Error',
                        venues: venues,
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            const payload = request.payload;
            try {
                const newVenue = new Venue({
                    category: payload.category,
                    pois: [{
                        name: payload.name,
                        location: payload.location,
                        geo: {
                            lat: payload.lat,
                            long: payload.long
                        },
                        website: payload.website,
                        imageMain: payload.imageMain,
                        image1: payload.image1,
                        image2: payload.image2,
                        image3: payload.image3,
                        description: payload.description
                    }]
                });
                const venue = await Venue.addVenue(newVenue);
                venue.pois.push(newVenue.pois[0]);
                venue.save();
                return h.redirect('/venues');
            }
            catch (err) {
                return h.view('home', { errors: [{ message: err.message }] });
            }
        }
    },


    showVenue: {
        handler: async function(request, h) {
            const id = request.params.id;
            const userid = request.auth.credentials.id;
            const user = await User.findById(userid).lean();
            try {
               const venue = await Venue.findByUID(id).lean();
                return h.view('venue',
                {
                    title: 'Venues',
                    venue: venue,
                    user: user
                }
                );
            }
            catch (err) {
                return h.view('venue', { errors: [{ message: err.message }] });
            }
        }

    },

    deleteVenue: {
        handler: async function(request, h) {
            const id = request.params.id;
            try {
                await Venue.deleteVenue(id);
                return  h.redirect('/venues');
            }
            catch (err) {
                return h.redirect('/venues', { errors: [{ message: err.message }] });
            }
        }

    },

    updateVenue: {
        handler: async function(request, h) {
            const id = request.params.id;
            try {
                const venue = await Venue.findByUID(id).lean();
                return h.view('update',
                    {
                        title: 'Venues',
                        venue: venue
                    }
                );
            }
            catch (err) {
                return h.view('update', { errors: [{ message: err.message }] });
            }
        }

    },

    applyUpdates: {
        validate: {
            payload: {
                name: Joi.string().required(),
                location: Joi.string().required(),
                lat: Joi.number().required(),
                long: Joi.number().required(),
                website: Joi.string().required(),
                description: Joi.string().required(),
                imageMain: Joi.string(),
                image1: Joi.string(),
                image2: Joi.string(),
                image3: Joi.string()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                 return h
                    .view('update', {
                        title: 'Update Venue Error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            const id = request.params.id;
            try {
                const userEdit = request.payload;
                const venue = await Venue.updateVenue(id, userEdit);
                return h.redirect('/venue/update/' + id);
            }
            catch (err) {
                return h.view('update', { errors: [{ message: err.message }] });
            }
        }

    },

    deleteImage: {
        handler: async function (request, h) {
            const image = request.params.image;
            const id = request.params.id;
            let update;
            switch(image) {
                case "imageMain":
                    await Venue.deleteImageMain(id);
                    break;
                case "image1":
                    await Venue.deleteImage1(id);
                    break;
                case "image2":
                    await Venue.deleteImage2(id);
                    break;
                case "image3":
                    await Venue.deleteImage3(id);
                    break;
                default:

            }
            try {
                 return  h.redirect('/venue/update/'+id);
            }
            catch (err) {
                return h.redirect('/venue/update/'+id, { errors: [{ message: err.message }] });
            }
        }
    }


};

module.exports = Venues;