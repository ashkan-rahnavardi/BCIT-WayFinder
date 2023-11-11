import express from 'express';

const app = express();

app.get('/', function (req, res) {
    // WIP
})

app.listen(5000, function (err) {
    if (err) console.log(err);
});
