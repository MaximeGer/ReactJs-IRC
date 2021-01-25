module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        login_name: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        }
    });

    return User;
};