const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize)=>{
    class Comments extends Model{
        static associate(models){
            Comments.belongsTo(models.Users,{foreignKey: 'userId', as:'author'});
            Comments.belongsTo(models.Posts,{foreignKey: 'postId', as: 'origin'});
        }
    }
    Comments.init(
        {
            id:{type: DataTypes.INTEGER, allowNull:false,autoIncrement:true, primaryKey:true},
            postId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER, 
            content: DataTypes.TEXT
        },{
            sequelize,
            modelName: 'Comments',
            tableName: 'Comments',
            timestamps: true
        }
    )
    return Comments;
}