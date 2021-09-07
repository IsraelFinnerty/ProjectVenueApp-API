'use strict';

const Hapi = require('@hapi/hapi');
const cloudinary = require('cloudinary').v2;

try {
    const result = require('dotenv').config();
    if (result.error) {
        throw result.error
    }
}
catch {
    console.log('Problem loading dotenv file')
}

const fs = require('fs');
/*const server = Hapi.server({
    port: 3443,
    tls: {
        key: fs.readFileSync('keys/private/webserver.key'),
        cert: fs.readFileSync('keys/webserver.crt')
    }
});*/


/*const server = Hapi.server({
    port: process.env.PORT || 3000,
});
*/
require('./app/models/db');

async function init() {
    await server.register(require('@hapi/inert'));
    await server.register(require('@hapi/vision'));
    await server.register(require('@hapi/cookie'));
    await server.validator(require('@hapi/joi'));


    server.views({
        engines: {
            hbs: require('handlebars'),
        },
        relativeTo: __dirname,
        path: './app/views',
        layoutPath: './app/views/layouts',
        partialsPath: './app/views/partials',
        layout: true,
        isCached: false,
    });



    server.auth.strategy('session', 'cookie', {
        cookie: {
            name: 'donation',
            password:  process.env.password,
            isSecure: false
        },
        redirectTo: '/',
    });

    server.auth.default('session');

    server.route(require('./routes'));
    server.route(require('./routes-api'));
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

init();