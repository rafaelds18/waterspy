const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/dist/WaterSpy'));
app.listen(process.env.PORT || 4200);
app.get('/*', function(req, res){
    res.sendFile(path.join(__dirname + '/dist/WaterSpy/index.html'));
});

console.log('Console listening!');
