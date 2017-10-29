//Routes are defined here.
//Endpoints of API and allowed methods
const api = require('../controllers/api.js');

module.exports = function(app){
  app.route('/createProject')
    .post(api.createProject) //Post data as specified to create project

  app.route('/requestProject')
    .get(api.requestProject) //Based on the specification, retrieves a project from the REST service
}
