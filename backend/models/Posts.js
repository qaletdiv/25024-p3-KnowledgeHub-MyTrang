const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) =>{
    class Posts extends Model{
        static associate(models){
            Posts.belongsTo(models.Users,{foreignKey: 'userId', as: 'author'});
            Posts.hasMany(models.Comments,{foreignKey: 'postId', as:'comments'});
        } 
    }
    Posts.init(
        {
           id: {type: DataTypes.INTEGER, allowNull: false, autoIncrement: true,primaryKey: true},
           userId: DataTypes.INTEGER,
           title: DataTypes.STRING,
           content: DataTypes.TEXT,
           thumbnail: {type: DataTypes.STRING, defaultValue: null}
        },{
            sequelize,
            modelName: 'Posts',
            tableName: 'Posts',
            timestamps: true
        }
    )
    return Posts;
}