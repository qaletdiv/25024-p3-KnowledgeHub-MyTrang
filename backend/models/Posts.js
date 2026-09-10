const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) =>{
    class Posts extends Model{
        static associate(models){
            Posts.belongsTo(models.Users,{foreignKey: 'user_id', as: 'author'});
            Posts.hasMany(models.Comments,{foreignKey: 'id', as:'comments'});
        } 
    }
    Posts.init(
        {
           id: {type: DataTypes.INTEGER, allowNull: false},
           user_id: DataTypes.INTEGER,
           title: DataTypes.STRING,
           content: DataTypes.TEXT,
           thumbnail: DataTypes.STRING
        },{
            sequelize,
            modelName: 'Posts',
            tableName: 'Posts',
            timestamps: true
        }
    )
    return Posts;
}