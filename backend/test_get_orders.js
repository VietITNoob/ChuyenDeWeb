const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://anhviet:vietpro147@chuyendeweb.hg7mz8i.mongodb.net/?appName=ChuyenDeWeb';

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

async function run() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to database!');

    console.log('Querying orders with populate...');
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('orderItems.product', 'title price seller')
      .sort({ createdAt: -1 });

    console.log(`Successfully fetched ${orders.length} orders!`);
    if (orders.length > 0) {
      console.log('Sample populated order:');
      console.log(JSON.stringify(orders[0], null, 2));
    }
  } catch (err) {
    console.error('Error querying orders:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
