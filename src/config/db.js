const mongoose = require('mongoose');
// mongoose.set('useCreateIndex', true);

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('db is connected');
    } catch (error) {
        console.log(error);
        process.exit(1); // detiene la app
    }
}

module.exports = conectarDB;