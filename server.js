const express = require("express");
const path = require("path");
// require rollbar below
const Rollbar = require("rollbar");
// create the Rollbar class below
const rollbar = new Rollbar({
  accessToken: "e57ad563cad14d52b07481f2d156c2af",
  captureUncaught: true,
  captureUnhandledRejections: true,
});

const app = express();
app.use(express.json());
app.use(rollbar.errorHandler());
let studentList = [];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
  // send rollbar some info
  rollbar.info("html file served successfully");
});

app.post("/api/student", (req, res) => {
  let { name } = req.body;
  name = name.trim();

  const index = studentList.findIndex((studentName) => {
    return studentName === name;
  });

  if (index === -1 && name !== "") {
    studentList.push(name);
    // add rollbar log here
    rollbar.log('Student added succesfully', {author: 'Wesley', type: 'Manual'})
    res.status(200).send(studentList);
  } else if (name === "") {
    // add a rollbar error here
    rollbar.error('no name givin');
    res.status(400).send({ error: "no name was provided" });
  } else {
    // add a rollbar error here too
    rollbar.error('student already exists');
    res.status(400).send({ error: "that student already exists" });
  }
});

const port = process.env.PORT || 4545;

// add rollbar errorHandler middleware here

app.listen(port, () => console.log(`server running on port ${port}`));