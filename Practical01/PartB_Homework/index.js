const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Welcome to Homework API");
});

app.get("/intro", (req, res) => {
  res.send("Hi There, This is Amos Ho!");
});

app.get("/name", (req, res) => {
  res.send("Amos Ho!");
});

app.get("/hobbies", (req, res) => {
  res.json(["coding", "reading", "cycling"]);
});

app.get("/food", (req, res) => {
  res.send("Bak kut teh and sushi and Mee Pok Dry with Chilli");
});

app.get("/student", (req, res) => {
  res.json({
    name: "Alex",
    hobbies: ["coding", "reading", "cycling"],
    intro: "Hi, I'm Alex, a Year 2 student passionate about building APIs!"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
