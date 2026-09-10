const Sequelize = require('sequelize');
const config = require('../config/config')["development"];
const db = {};

const sequelize = new Sequelize(config);

db.Users = require('../models/Users')(sequelize);
db.Posts = require('../models/Posts')(sequelize);
db.Comments = require('../models/Comments')(sequelize);

Object.keys(db).forEach(modelName=>{
    if(db[modelName].associate)
        db[modelName].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
