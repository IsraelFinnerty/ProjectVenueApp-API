const Users= require('./app/api/users');
const Venues= require('./app/api/venues');

module.exports = [
  { method: 'GET', path: '/api/users', config: Users.find },
  { method: 'GET', path: '/api/users/{id}', config: Users.findOne },
  { method: 'POST', path: '/api/users', config: Users.create },
  { method: 'DELETE', path: '/api/users/{id}', config: Users.deleteOne },
  { method: 'DELETE', path: '/api/users', config: Users.deleteAll },
  { method: 'GET', path: '/api/users/admin/{id}', config: Users.makeAdmin },
  { method: 'GET', path: '/api/users/removeadmin/{id}', config: Users.removeAdmin },
  { method: 'GET', path: '/api/users/lastlogin/{id}', config: Users.lastLogin },
  { method: 'GET', path: '/api/all', config: Venues.findAll },
  { method: 'GET', path: '/api/categories', config: Venues.findCategories },
  { method: 'GET', path: '/api/venues', config: Venues.findVenues },
  { method: 'GET', path: '/api/venues/{location}', config: Venues.findVenuesLocation },
  { method: 'DELETE', path: '/api/venues/delete/{id}', config: Venues.deleteOne },
  { method: 'POST', path: '/api/venues/update/{id}', config: Venues.updateVenue},
  { method: 'POST', path: '/api/venues/add', config: Venues.addVenue },
  { method: 'POST', path: '/api/venues/addreview/{id}', config: Venues.addReview }

  ];