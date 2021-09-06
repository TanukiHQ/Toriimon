// UUID & Hashing
const uuid = require('uuid')

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Limits extends Model {}

    Limits.init(
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
            tableName: 'Limits',
            modelName: 'Limits',
        },
    )

    return Limits
}
