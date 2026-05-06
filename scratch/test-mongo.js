const { MongoClient } = require('mongodb');

async function testLocalMongo() {
  const url = 'mongodb://127.0.0.1:27017';
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('Successfully connected to local MongoDB');
    await client.close();
  } catch (err) {
    console.error('Failed to connect to local MongoDB:', err.message);
  }
}

testLocalMongo();
