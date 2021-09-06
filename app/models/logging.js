// UUID & Hashing
const uuid = require('uuid')

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Log extends Model {}

    Log.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: uuid.v4(),
            },
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
