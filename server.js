//Boiler plate routing code
let express = require('express'), app = express(), port = process.env.port || 7846
  bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let routes = require('./api/routes/api.js'); //importing route
routes(app); //register the route

//Start the server
app.listen(port)

//Log the port and that the app has started
console.log("Unity Code Test hosted on port " + port);
