'use strict';

const Venue = require('../models/venues');
const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');

const Venues = {

  findAll: {
    auth: false,
    handler: async function(request, h) {
      try{
      const allVenues = await Venue.find();
      if(!allVenues) {
        return Boom.notFound('No venues found');
      }

      return allVenues;
    } catch (err) {
        return Boom.badImplementation('error fetching ');
      }
    }
  },

  findOne: {
    auth: false,
    handler: async function(request, h) {
      try{
      const venue = await Venue.findOne({_id: request.params.id});
      if(!venue) {
        return Boom.notFound('No venues found');
      }
      return venue;
    } catch (err) {
        return Boom.badImplementation('error fetching ');
      }

      }
  },

  findCategories: {
    auth: false,
    handler: async function (request, h) {
      try{
      const allVenues = await Venue.find();
       var categories = [];
      for (var i = 0; i < allVenues.length; i++) {
        categories.push(allVenues[i].category);
      }
      if(!categories) {
        return Boom.notFound('No categories found');
      }
            return categories;
    } catch (err) {
        return Boom.badImplementation('error fetching ');
      }
    }
    },

  findVenues: {
    auth: false,
    handler: async function (request, h) {
        try {
        const allVenues = await Venue.find();
        var venues = [];
        for (var i = 0; i < allVenues.length; i++) {
          for (var j = 0; j < allVenues.length; j++) {
            venues.push(allVenues[i].pois[j]);
          }
        }

     if(!venues){
       return Boom.notFound('No venues found');
     }
           return venues;
    } catch (err) {
        return Boom.badImplementation('error fetching ');
      }
    }

  },


  findVenuesLocation: {
    auth: false,
    handler: async function (request, h) {
      try{
      const allVenues = await Venue.find();
      var venues = [];
      for (var i = 0; i < allVenues.length; i++) {
        for (var j = 0; j < allVenues.length; j++)
        {
          if (allVenues[i].pois[j].location === request.params.location) {
            venues.push(allVenues[i].pois[j]);
          }
        }
      }
      if(!venues) {
        return Boom.notFound('No venues found in that location');
      }
       return venues;
    } catch (err) {
        return Boom.badImplementation('error fetching ');
      }
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
        if (venue) {
          return {success: true};
        }
      }
      catch (err) {
        return h.view('home', { errors: [{ message: err.message }] });
      }
    }
  },


  updateVenue: {
    auth: false,
    handler: async function (request, h) {
      const id = request.params.id;
      try {
        const userEdit = request.payload;
        const venue = await Venue.updateVenue(id, userEdit);
        if (venue) {
          return {success: true};
        }
      } catch (err) {
        return Boom.badImplementation('error fetching ');
      }
    }
  },

  deleteOne: {
    auth: false,
    handler: async function (request, h)
    {
      const allVenues = await Venue.find();
      var venues = [];
      for (var i = 0; i < allVenues.length; i++) {
        for (var j = 0; j < allVenues.length; j++) {
          if (allVenues[i].pois[j]._id === request.params.id) {
            const user = await allVenues[i].pois[j].deleteOne({_id: request.params.id});
          }
        }
      }
      if (user) {
        return {success: true};
      }
      return Boom.notFound('id not found');
    }

  },

  addReview: {
    auth: false,
    handler: async function (request, h) {
      const id = request.params.id;
      try {
        const payload = request.payload;
        const newReview = [{
          reviwer: payload.reviewer,
          review: payload.review,
          dateOfVisit: payload.dateOfVisit,
          rating: payload.rating
        }]
        const reviewAdded = await Venue.addReview(id, newReview);
        if (reviewAdded)
        {
          return reviewAdded
        }

      } catch (err) {
        return Boom.badImplementation('error fetching ');
      }
    }
  },



};

module.exports = Venues;

/*
}*/