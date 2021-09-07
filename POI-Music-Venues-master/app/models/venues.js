'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Boom = require('@hapi/boom');

const venueSchema = new Schema({
    category: String,
    pois: [{
        name: String,
        location: String,
        geo: {
            lat: Number,
            long: Number
        },
        website: String,
        imageMain: String,
        image1: String,
        image2: String,
        image3: String,
        description: String,
        reviews: [{
            reviwer: String,
            review: String,
            dateOfVisit: String,
            rating: String
        }]
    }]
});

venueSchema.statics.findByUID = function(id) {
    var id2 = Mongoose.Types.ObjectId(id);
    return this.find({ "pois._id" : id2},{_id:0, "pois.$": 1});


};

venueSchema.statics.findOneByUID = function(id) {
    var id2 = Mongoose.Types.ObjectId(id);
    return this.findOne({ "pois._id" : id2}, {_id:1, "pois.$": 1});



};

venueSchema.statics.addVenue = function(newVenue) {
    return this.findOne({category : newVenue.category});

};

venueSchema.statics.deleteVenue = function(id) {
    var id2 = Mongoose.Types.ObjectId(id);
    return this.findOneAndUpdate({"pois._id": id2}, {$pull: {pois: {_id: id2}}}, {multi: true});
};

venueSchema.statics.updateVenue = function(id, userEdit) {
        return  this.findOneAndUpdate({"pois._id" : id}, {$set: {
            "pois.$.name" : userEdit.name,
            "pois.$.location": userEdit.location,
            "pois.$.description": userEdit.description,
            "pois.$.website": userEdit.website,
            "pois.$.geo.lat": userEdit.lat,
            "pois.$.geo.long": userEdit.long,
            "pois.$.imageMain" : userEdit.imageMain,
            "pois.$.image1" : userEdit.image1,
            "pois.$.image2" : userEdit.image2,
            "pois.$.image3" : userEdit.image3
        }}, {useFindAndModify: false}
    );
};

venueSchema.statics.addReview = function(id, newReview) {
    return this.findOne({"pois._id": newReview.pois._id});
};


venueSchema.statics.deleteCategory = function(id) {
    var id2 = Mongoose.Types.ObjectId(id);
    return this.findOneAndDelete({_id: id2}, {multi: true, useFindAndModify: false});
};

venueSchema.statics.deleteImageMain = function(id) {
    return  this.findOneAndUpdate({"pois._id" : id}, {$set: {
            "pois.$.imageMain" : "https://res.cloudinary.com/izzofinno/image/upload/v1583046281/default.png",
            }}, {useFindAndModify: false}
    );
};

venueSchema.statics.deleteImage1 = function(id) {
    return  this.findOneAndUpdate({"pois._id" : id}, {$set: {
            "pois.$.image1" : "https://res.cloudinary.com/izzofinno/image/upload/v1583046281/default.png",
        }}, {useFindAndModify: false}
    );
};

venueSchema.statics.deleteImage2 = function(id) {
    return  this.findOneAndUpdate({"pois._id" : id}, {$set: {
            "pois.$.image2" : "https://res.cloudinary.com/izzofinno/image/upload/v1583046281/default.png",
        }}, {useFindAndModify: false}
    );
};

venueSchema.statics.deleteImage3 = function(id, image) {
    return  this.findOneAndUpdate({"pois._id" : id}, {$set: {
            "pois.$.image3" : "https://res.cloudinary.com/izzofinno/image/upload/v1583046281/default.png",
        }}, {useFindAndModify: false}
    );
};



module.exports = Mongoose.model('Venues', venueSchema);