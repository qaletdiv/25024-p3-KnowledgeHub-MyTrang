const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize)=>{
    class Comments extends Model{
        static associate(models){
            Comments.belongsTo(models.Users,{foreignKey: 'user_id', as:'author'});
            Comments.belongsTo(models.Posts,{foreignKey: 'post_id', as: 'origin'});
        }
    }
    Comments.init(
        {
            id:{type: DataTypes.INTEGER, allowNull:false, primaryKey:true},
            post_id: DataTypes.INTEGER,
            user_id: DataTypes.INTEGER, 
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