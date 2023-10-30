const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');
const axios = require('axios');
const { topics } = require('./constants');
const postRouter = require('./routes/postRoutes');
const todoRouter = require('./routes/todoRoutes');
const userRouter = require('./routes/userRoutes');

/////////////////////////
const session = require('express-session');
const redis = require('redis');
let RedisStore = require('connect-redis').default;

const PORT = process.env.PORT;
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require('./config/config');
// in here i have to pass the host url( ip address) and the port that redis server is going
// to be listening on ( i wrote them in config.js) remember i have the dns in docker( "redis" -> ip)
////////////////////////
const redisClient = redis.createClient({
  url: 'redis://redis:6379',
});

redisClient.connect().catch(console.error);
let store = new RedisStore({ client: redisClient, prefix: 'perm-back:' });
/////////////////////

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
app.enable('trust proxy');
//middleware
app.use(
  session({
    store: store,
    secret: SESSION_SECRET,
    cookie: {
      saveUninitialized: false,
      resave: false,
      secure: false, // Set true if using https
      httpOnly: true,
      maxAge: 6000000, // Set cookie max age ( this is in milliseconds)
    },
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
  res.send('<h1>sapir love yoel</h1>');
  console.log('gggggggggggggggggggggggggggg');
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
