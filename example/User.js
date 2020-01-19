const Model = require('../Model.js');

const user = {
    schema : {
        name: {
            type: 'string',
        },
        address: {
            type: 'string',
            required: true
        }
    }
};


class User extends Model{};
User.init('Users', user);
module.exports = User;
