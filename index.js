var imgbbUploader = require('imgbb-uploader');
var express = require('express')
var multer  = require('multer')
var dotenv  = require('dotenv')
var cors  = require('cors');
const path = require('path');

var app = express()
dotenv.config();
app.use(cors())
var port = 5000;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/tmp')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })

app.use("/tmp", express.static(path.join(__dirname, "/tmp")));
// app.use(express.static(__dirname + '/tmp'));
// app.use('./tmp', express.static('tmp'));

app.post('/api/upload', upload.single('image'), async function (req, res, next) {
    const options = {
        apiKey: process.env.IMGBB_KEY,
        imagePath: "/tmp/"+req.file.filename
    }
    imgbbUploader(options)
        .then((response) => res.status(200).json(response))
        .catch((error) => res.status(409).json({message: error}));
  })

app.listen(port,() => console.log(`Server running on port ${port}!`))
