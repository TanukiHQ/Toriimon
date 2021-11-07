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
                allowNull: false,
                type: DataTypes.STRING(2000),
            },

            last_used: {
                allowNull: false,
                type: DataTypes.DATE,
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

