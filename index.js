const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');
const { createClient } = require('redis');
const RedisStore = require('connect-redis').default;
const PORT = process.env.PORT;

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
} = require('./config/config');
// in here i have to pass the host url( ip address) and the port that redis server is going
// to be listening on ( i wrote them in config.js) remember i have the dns in docker( "redis" -> ip)
let redisClient = createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
});
redisClient.connect().catch(console.error);

const postRouter = require('./routes/postRoutes');
const todoRouter = require('./routes/todoRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose
    .connect(mongoUrl)
    .then(() => console.log('successfully connected to mongo db'))
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000); //call again after 5 seconds to retry to connect
    });
};
connectWithRetry();
const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');
const axios = require('axios');
const { topics } = require('./constants');

//middleware
app.use(
  session({
    store: new RedisStore({ client: redisClient, prefix: 'myapp:' }),
    secret: '123', // the session secret is random string we store on our express server we use to handle the sessions
    // the properties for the cookie we send back to the user(its in the express-session docs)
    secure: false,
    resave: false,
    saveUninitialized: false,
    httpOnly: true, // httpOnly is about restricting access to cookies from client-side scripts.
    maxAge: 30000,
  })
);
app.use(cors());
app.use(express.json());

// change the url of my backnd app instead to this app.use('/api/v1/posts' ...
// the api is domain name - in case in the future my hosting front and back within the same domain
// and the v1 is the version number of the api that way i keep my different versions independent
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/todos', todoRouter);
app.use('/api/v1/users', userRouter);

//ROUTES//
app.get('/api/v1/test', async (req, res) => {
  return res.send('<h1>sapir love yoel</h1>');
});

//get the xml data from web scraping google news ( by a topic)
app.get('/api/v1/news/:topic', async (req, res) => {
  try {
    const parser = new XMLParser();
    const response = await axios({
      method: 'get',
      url: topics[req.params.topic].url,
      headers: { 'Content-Type': 'application/xml' },
    });
    const data = parser.parse(response.data);
    res.json(data.rss.channel.item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});
