require('../src/db/mongoose');
const User = require('../src/models/user');

// User.findByIdAndUpdate('5e6119463da49443ac8e2287', { age: 5 }).then(user => {
//     console.log(user);
//     return User.countDocuments({ age: 5 });
// }).then(result => {
//     console.log(result);
// }).catch(e => {
//     console.log(e)
// })

const updateAgeandCount = async (id, age) => {
    await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({ age })
    return count;
}

updateAgeandCount('5e6119463da49443ac8e2287', 50).then(result => {
    console.log(result);
}).catch(e => {
    console.log('e:', e)
})