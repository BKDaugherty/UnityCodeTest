const request = require("request-promise")
const port = process.env.port || 7846
const baseURL = "http://localhost:" + port

const createProject = function(projectBodyData){
  return request.post({url:baseURL + "/createProject",  json:projectBodyData})
}

const requestProject = function(projectID, country, number, keyword){

  let queryString = "/requestProject?"

  if(projectID){
    queryString += `projectid=${projectID}&`
  }
  if(country){
    queryString +=  `country=${country}&`
  }
  if(number){
    queryString += `number=${number}&`
  }
  if(keyword){
    queryString += `keyword=${keyword}`
  }

  const url = baseURL + queryString
  return request.get(url)
}

module.exports = {
  createProject,
  requestProject
}
