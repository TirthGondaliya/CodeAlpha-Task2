const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', authRoutes);
app.use('/api/posts', postRoutes);

mongoose.connect('mongodb://localhost:27017/mediatorDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.listen(5000, () => console.log('Server started on port 5000'));
