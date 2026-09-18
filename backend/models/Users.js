const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) =>{
    class Users extends Model{
        static associate(models){
            Users.hasMany(models.Posts, {foreignKey: 'id', as: 'posts'});
            Users.hasMany(models.Comments, {foreignKey: 'id', as: 'comments'});
        }
    }
    Users.init(
        {
            id: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true},
            username: DataTypes.STRING,
            birth: DataTypes.DATEONLY,
            gender: DataTypes.STRING,
            email: DataTypes.STRING,
            pass: DataTypes.STRING,
            ava: DataTypes.STRING,
        },{
            sequelize,
            modelName: 'Users',
            tableName: 'Users',
            timestamps: true
        }
    )
    return Users;
}