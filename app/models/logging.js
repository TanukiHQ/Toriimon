const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Log extends Model {}

    Log.init(
        {
            type: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            message: {
                allowNull: false,
                type: DataTypes.STRING,
            },
        },

        {
            sequelize,
            tableName: 'Log',
            modelName: 'Log',
        },
    )

    return Log
}
