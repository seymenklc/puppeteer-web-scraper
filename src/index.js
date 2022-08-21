const expreess = require('express');
const cors = require('cors');
// local imports
const routes = require('./routes/appRoutes');

// app init
require('dotenv').config();
const app = expreess();

// middleware
app.use(expreess.json());
app.use(cors());

// routes
app.use('/api/v1', routes);

// app start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on: ${PORT}`));