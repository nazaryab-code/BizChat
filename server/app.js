var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { MongoClient } = require('mongodb');
const cors = require('cors'); // Import the cors middleware
const bodyParser = require('body-parser'); // Import body-parser

// Express
var app = express();
// Enable CORS for all routes
app.use(cors());
app.use(express.json()); // Enable JSON parsing for POST requests
app.use(bodyParser.json()); // Use body-parser for JSON parsing
app.use(cookieParser());
app.use(logger('dev'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection details
const mongoURI = 'mongodb://192.168.1.50:27017/';
const dbName = 'bizchat_db';
// Define a route to fetch data from multiple MongoDB collections
// Function to fetch users


app.get('/api/users', async (req, res) => {
  try {
    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db(dbName);
    const users = await db.collection('users').find({}).toArray();

    await client.close();

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Function to fetch messages
app.get('/api/messages', async (req, res) => {
  try {
    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db(dbName);
    const messages = await db.collection('messages').find({}).toArray();

    await client.close();

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Function to fetch user details

app.post('/api/authenticate', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db(dbName);
    const user = await db.collection('users').findOne({ username, password });

    await client.close();

    if (user) {
      // Include the complete user information in the JSON response
      const response = {
        _id: user._id,
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        country: user.country,
        project: user.project,
        invoice: user.invoice,
        deadline: user.deadline,
        budget: user.budget,
        session_id: user.session_id,
        status: user.status,
      };
      res.json(response);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.post('/api/getUserInfo', async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db(dbName);
    const user = await db.collection('users').findOne({ id });

    await client.close();

    if (user) {
      const response = {
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        country: user.country,
        project: user.project,
        invoice: user.invoice,
        deadline: user.deadline,
        budget: user.budget,
        session_id: user.session_id,
        status: user.status,
      };
      res.json(response);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/getUserInfoByName', async (req, res) => {
  try {
    const { full_name } = req.body;

    if (!full_name) {
      return res.status(400).json({ error: 'Full name is required' });
    }

    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db(dbName);
    const user = await db.collection('users').findOne({ full_name });

    await client.close();

    if (user) {
      const response = {
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        country: user.country,
        project: user.project,
        invoice: user.invoice,
        deadline: user.deadline,
        budget: user.budget,
        session_id: user.session_id,
        status: user.status,
      };
      res.json(response);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Function to fetch user transactions
app.post('/api/userTransactions', async (req, res) => {
  try {
    const { full_name } = req.body;

    if (!full_name) {
      return res.status(400).json({ error: 'Full name is required' });
    }

    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db(dbName);
    const userTransactions = await db.collection('user_transaction').find({ full_name }).toArray();

    await client.close();

    res.json(userTransactions);
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/userOrderDetails', async (req, res) => {
  try {
    const { full_name } = req.body;

    if (!full_name) {
      return res.status(400).json({ error: 'Full name is required' });
    }

    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db(dbName);
    const userOrderDetails = await db.collection('user_details').find({ full_name }).toArray();

    await client.close();

    res.json(userOrderDetails);
  } catch (error) {
    console.error('Error fetching user order details:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Define a route to fetch notes
app.post('/api/notes', async (req, res) => {
  try {
    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db(dbName);
    const myColl = db.collection('note');

    const { note, user, date, status } = req.body;

    if (!note || !user || !date || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await myColl.insertOne({ note, user, date, status });

    await client.close();

    console.log('MongoDB Insert Result:', result);

    if (result && result.insertedId) {
      // If the insertion was successful, construct the created note
      const createdNote = { _id: result.insertedId, note, user, date, status };
      return res.json(createdNote);
    } else {
      console.error('Error creating note: InsertedId is undefined or empty');
      return res.status(500).json({ error: 'Internal Server Error', details: 'Failed to create note' });
    }
  } catch (error) {
    console.error('Error creating note:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Define a route to fetch notes based on message, status, or date
app.get('/api/notesSearch', async (req, res) => {
  try {
    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db(dbName);
    const notesCollection = db.collection('note');

    const { search } = req.query;

    // Use a regular expression to perform a case-insensitive search
    const query = {
      $or: [
        { note: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
        { date: { $regex: search, $options: 'i' } },
      ],
    };

    const sort = { _id: 1 }; // Sort by _id field in descending order

    const notes = await notesCollection.find(query).sort(sort).toArray();

    await client.close();

    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Add this route to your existing code
app.get('/api/stopServer', (req, res) => {
  // This will stop the server
  res.send('Server is stopping...');
  process.exit();
});



// Routes
app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;