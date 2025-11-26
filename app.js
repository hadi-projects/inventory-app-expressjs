const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const dotenv = require('dotenv');

dotenv.config();

const inventoryRoutes = require('./routes/inventory');

const app = express();

// View engine setup
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  helpers: {
    multiply: (a, b) => a * b,
    eq: (a, b) => a === b
  }
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', inventoryRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});