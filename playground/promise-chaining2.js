require('../src/db/mongoose');
const Task = require('../src/models/task');

// Task.findByIdAndDelete('5e677871eb640122bc6ac04b').then(result => {
//     return Task.countDocuments({ completed: false });
// }).then(result => {
//     console.log(result);
// }).catch(e => {
//     console.log(e)
// })

const deleteAndCount = async (id) => {
    await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({ completed: false });
    return count;
}

deleteAndCount('5e677881eb640122bc6ac04c').then(result => {
    console.log(result);
}).catch(e => {
    console.log('e:', e)
})