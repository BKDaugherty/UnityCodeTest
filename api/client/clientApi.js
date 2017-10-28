const request = require("request-promise")
const port = process.env.port || 7846
const baseURL = "http://localhost:" + port

const createProject = function(projectBodyData){
  return request.post({url:baseURL + "/createProject",  json:projectBodyData})
}

const requestProject = function(projectID, country, number, keyword){
  const url = baseURL + `/requestProject?projectid=${projectID}&country=${country}&number=${number}&keyword=${keyword}`
  return request.get(url)
}

module.exports = {
  createProject,
  requestProject
}
