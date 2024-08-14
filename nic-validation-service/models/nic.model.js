module.exports = (sequelize, DataTypes) => {
    const NIC = sequelize.define('NIC', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nic_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        birthday: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false
        },
        file_name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return NIC;
};
