const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const multer = require('multer')
const authRoute = require('./routes/auth')
const usersRoute = require('./routes/users')
const postsRoute = require('./routes/posts')
const catRoute = require('./routes/categorys')

app.use(express.json())

mongoose.connect(process.env.MONGO_URL)
    .then(console.log('DB connected'))
    .catch(err => console.log(err))


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");     //  where uploaded files will be stored

    },
    filename: (req, file, cb) => {
        cb(null, 'thisIsPic');
    },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => { // single file with the field name "file"

    res.status(200).json({ message: 'Image uploaded successfully' });
});

app.use('/api/auth', authRoute)
app.use('/api/user', usersRoute)
app.use('/api/post', postsRoute)
app.use('/api/cat', catRoute)


app.get('/', (req, res) => {
    res.send('Hellooo Worldd!')
})

const port = 3000;


app.listen(port, console.log(`Server started on port ${port}`))