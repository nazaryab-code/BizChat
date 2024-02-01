const express = require('express');
const router = express.Router();

// GET home page
router.get('/', function (req, res, next) {
  res.render('index', { title: 'BizChat | Server' });
});

// GET user data
router.get('/api/users', async (req, res) => {
  try {
    const db = req.app.get('mongoDB'); // Access the MongoDB instance from the app
    const users = await db.collection('users').find({}).toArray();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
