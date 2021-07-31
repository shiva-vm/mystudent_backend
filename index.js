const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const studentRoute=require('./routes/studentRoutes')


const clientServerUrl = process.env.CLIENT_SERVER_URL;

const app = express();

//middlewares

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.status(200).send("Hi from user service");
});
//middleware to get requesting user for authorization
//app.use(Authorization.decodeAccessToken);
app.use("/student", studentRoute);
app.use('/profile', express.static('upload/images'))


function dbInit() {
  mongoose.connect(process.env.MONGOOSE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  let db = mongoose.connection;

  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log( "Db connection successfull " );
  });
  mongoose.Promise = global.Promise;
}


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("INFO", "Express Server", "started " + PORT);
  dbInit();
});
