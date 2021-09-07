'use strict';

const Accounts = require('./app/controllers/accounts');
const Venues = require('./app/controllers/venues');

module.exports = [
  { method: 'GET', path: '/', config: Accounts.index },
  { method: 'GET', path: '/signup', config: Accounts.showSignup },
  { method: 'GET', path: '/login', config: Accounts.showLogin },
  { method: 'GET', path: '/settings', config: Accounts.showSettings },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'POST', path: '/signup', config: Accounts.signup },
  { method: 'POST', path: '/settings', config: Accounts.settings },
  { method: 'POST', path: '/login', config: Accounts.login },
  { method: 'POST', path: '/addvenue', config: Venues.addVenue },
  { method: 'GET', path: '/addvenue', config: Venues.addVenueForm },
  { method: 'GET', path: '/home', config: Venues.report },
  { method: 'GET', path: '/report', config: Venues.report },
  { method: 'GET', path: '/venues', config: Venues.report },
  { method: 'GET', path: '/venue/{id}', config: Venues.showVenue },
  { method: 'GET', path: '/venue/delete/{id}', config: Venues.deleteVenue },
  { method: 'GET', path: '/venue/update/{id}', config: Venues.updateVenue },
  { method: 'POST', path: '/venue/update/{id}', config: Venues.applyUpdates },
  { method: 'GET', path: '/venue/update/{id}/{image}', config: Venues.deleteImage },
  { method: 'GET', path: '/category', config: Venues.category },
  { method: 'POST', path: '/category', config: Venues.addCategory },
  { method: 'GET', path: '/category/delete/{id}', config: Venues.deleteCategory },
  { method: 'GET', path: '/admin', config: Accounts.admin },
  { method: 'GET', path: '/admin/delete/{id}', config: Accounts.deleteUser },
  { method: 'GET', path: '/admin/update/{id}', config: Accounts.adminUpdate },
  { method: 'POST', path: '/admin/update/{id}', config: Accounts.adminApplyUpdate },
  { method: 'GET', path: '/admin/update/{id}/makeadmin', config: Accounts.adminMakeAdmin },


  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: './public'
      }
    },
    options: {auth:false}
  }
];