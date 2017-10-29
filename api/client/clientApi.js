const request = require("request-promise")
const port = process.env.port || 7846
const baseURL = "http://localhost:" + port

//Clientside API built to use in testing framework

const createProject = function(projectBodyData){
  return request.post({url:baseURL + "/createProject",  json:projectBodyData})
}

const requestProject = function(query){

  let queryString = "/requestProject?"

  if(!query)
    query = {}

  if(query.projectid){
    queryString += `projectid=${query.projectid}&`
  }
  if(query.country){
    queryString +=  `country=${query.country}&`
  }
  if(query.number){
    queryString += `number=${query.number}&`
  }
  if(query.keyword){
    queryString += `keyword=${query.keyword}`
  }

  const url = baseURL + queryString
  return request.get(url)
}

module.exports = {
  createProject,
  requestProject
}
