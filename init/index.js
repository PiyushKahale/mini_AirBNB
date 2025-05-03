const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const mongo_url = 'mongodb://localhost:27017/travelbugg';

main()
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch(err => {
        console.error('Error connecting to MongoDB', err);
    });

async function main() {
    await mongoose.connect(mongo_url);
}


const initDB = async () => {
    await Listing.deleteMany({});

    initData.data = initData.data.map((obj) =>({...obj, owner: "68142c9d28dc5175789e2e86"}));

    await Listing.insertMany(initData.data);

    console.log("Database initialized....!");
}

initDB();

