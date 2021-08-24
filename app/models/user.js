// UUID & Hashing
const uuid = require('uuid')

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class User extends Model {}

    User.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: uuid.v4(),
            },

            name: {
                allowNull: false,
                type: DataTypes.STRING(128),
            },

            email: {
                type: DataTypes.STRING(254),
                allowNull: false,
            },

            password: {
                type: DataTypes.STRING(64),
                allowNull: false,
            },

            lastseen_time: {
                type: DataTypes.DATE,
                allowNull: false,
            },

            profile_img: {
                type: DataTypes.STRING(64),
                allowNull: true,
                defaultValue: null,
            },

            bio: {
                type: DataTypes.STRING(254),
                allowNull: false,
                defaultValue: 'Your friendly tourisit user',
            },

            is_email_verified: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            is_admin: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            ip_address: {
                type: DataTypes.STRING(256),
                allowNull: false,
            },
        },

        {
            sequelize,
            tableName: 'User',
            modelName: 'User',
        },
    )

    User.associate = (models) => {
        User.hasMany(models.Session, {
            onDelete: 'cascade',
            foreignKey: 'uid',
        })

        User.hasMany(models.Limits, {
            onDelete: 'cascade',
            foreignKey: 'uid',
        })

        User.hasMany(models.Token, {
            onDelete: 'cascade',
            foreignKey: 'uid',
        })

        User.hasMany(models.Log, {
            onDelete: 'cascade',
            foreignKey: 'uid',
        })
    }

    return User
}
