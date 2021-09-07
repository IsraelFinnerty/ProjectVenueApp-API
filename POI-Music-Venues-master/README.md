![Logo](https://res.cloudinary.com/izzofinno/image/upload/v1583661892/logo_ml4fpq.jpg)


# Project Title

Rhythm & Booze - POI app for music venues in Ireland. 


## Description

User can sign up and log in as regular user. They can view all existing POI's and add there own, with image upload and location status. The user can also add new categories for POI's
If admin privileges are granted the user can edit each POI and delete or update its images. The admin can also delete entire categories. 

The admin can view all users including their last login time. The admin can edit user details and delete the user entirely. Statistics on the POI's and users are also available to the admin on the dashboard.

### Installing

All dependencies can be installed using npm Node install.

```
npm install
```

A database connection to MongoDB or Atlas is required.

### Technology used

NodeJs with the HAPI framework (see dependencies below).
MongoDB with Cloud Atlas with Mongoose.
Handlebars Templating Engine.
Cloudinary Image Hosting.
Fomantic UI

### Dependencies

@hapi/boom
@hapi/cookie
@hapi/hapi
@hapi/inert
@hapi/joi
@hapi/vision
cloudinary
dotenv
handlebars
mais-mongoose-seeder
mongoose

## Deployment

Deployed on heroku - https://poi-rhythm-and-booze.herokuapp.com/


## Author

* **Israel (Iz) Finnerty** - [GitHub](https://github.com/IsraelFinnerty)


## Acknowledgments

Venue Information References : GABY GUEDEZ thetaste.ie
