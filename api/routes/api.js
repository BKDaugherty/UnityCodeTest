//Import the game module
const api = require('../controllers/api.js');

module.exports = function(app){
  app.route('/createProject')
    .post(api.createProject) //Requires Game Board Parameters

  app.route('/requestProject')
    .get(api.requestProject) //Returns the state of the game
}
