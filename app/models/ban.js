const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Token extends Model {}

    Token.init(
        {
            from_date: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            to_date: {
                allowNull: true,
                type: DataTypes.DATE,
            },
        },

        {
            sequelize,
            tableName: 'Token',
            modelName: 'Token',
        },
    )

    return Token
}
