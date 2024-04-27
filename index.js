const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;


//middlewares
app.use(cors());
app.use(express.json());


//routes

app.get('/', (req, res) => {
    res.send('art and craft server is running')
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})