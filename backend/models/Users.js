const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) =>{
    class Users extends Model{
        static associate(models){
            Users.hasMany(models.Posts, {foreignKey: 'userId', as: 'posts'});
            Users.hasMany(models.Comments, {foreignKey: 'userId', as: 'comments'});
        }
    }
    Users.init(
        {
            id: {type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
            username: DataTypes.STRING,
            birth: DataTypes.DATEONLY,
            gender: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            avatar: {type: DataTypes.STRING, defaultValue: null},
        },{
            sequelize,
            modelName: 'Users',
            tableName: 'Users',
            timestamps: true
        }
    )
    return Users;
}