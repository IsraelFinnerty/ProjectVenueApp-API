'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');          // For password hashing

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    lastLogin: String,
    admin: Boolean
});

userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email : email});
};

userSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    if (!isMatch) {
        throw Boom.unauthorized('Password mismatch');
    }
    return this;
};

userSchema.statics.deleteUser = function(id) {
    return this.findOneAndRemove({"_id": id});
};

userSchema.statics.makeAdmin = function(email) {
    const user1 = findByEmail(email);
    cosole.log(user1);
    user1.admin = true;
}

module.exports = Mongoose.model('User', userSchema);