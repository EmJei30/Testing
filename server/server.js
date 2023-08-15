require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connection = require('./database/connection');
const ProductRoute = require('./router/ProductsRouter');

/**create an express app*/
const app = express();
process.env.TZ = 'Asia/Manila';
app.use(cors());

/** Middleware that looks for the body of incomming request / data to server */
/** and attach to the req object */
// app.use(express.json());

/**A node module use to get the data from the request / Post object*/
/**Increase payload size limit to 50MB*/
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(bodyParser.json());

/** Middleware to console incoming request */
app.use((req, res, next)=>{
    // console.log(req.path, req.method);
    next();
});

/**Connection to database */
connection.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Connected to database');
  });

// /** Set a route handler */
app.use('/api/products', ProductRoute);

/** Listen for request */
app.listen(3001, ()=>{
    console.log(`listening on port ${process.env.PORT}`);
});
