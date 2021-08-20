const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Session extends Model {}

    Session.init(
        {
            sid: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.STRING,
            },

            device_info: {
                allowNull: true,
                type: DataTypes.STRING,
            },
        },

        { /* hon hon french bread */
            sequelize,
            tableName: 'Session',
            modelName: 'Session',
        },
    )

    return Session
}

