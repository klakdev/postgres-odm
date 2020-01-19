
const User = require('./User.js');

async function test() {
    //success
    let user1 = new User({ name: 'yaki', address: 'ramat-gan' });
    await user1.insert();


    //fail - missing required data;
    try {
        let user2 = new User({name: 'yaki'});
        await user2.insert();
    } catch(err) {
        console.log(err);
    }

    let user = User.findById(4)
}

test();
