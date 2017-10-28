const fs = require('fs')
const projectTextFile = "projects.txt"
const util = require('./utility.js')
const common = require('../common/utility')
const LOG_MODE = process.env.LOG_MODE || true
//Will run on createProject POST request
const createProject = function(req, res){
  //Receives the body of the request in req.body

  if(util.validateProjectPostData(req.body)){
    if(LOG_MODE)
      console.log("Request Body successfully validated")

    fs.appendFile(projectTextFile, JSON.stringify(req.body) + '\n', (err) => {
      if(err){
        if(LOG_MODE)
          console.log("Unable to write to file projects.txt")
        return res.status(500).send("Unable to create resource, due to internal server error")
        //and we should exit
      }
      else {
        if(LOG_MODE){
          console.log(`Wrote project with id:${req.body.id} to projects.txt`)
          console.log("Successful post. Sending 200 ok to client")
        }

        //Send response to client
        return res.status(200)
          .json({
              message:"campaign is successfully created"
        })
      }
    })
  } else {
    if(LOG_MODE)
      console.log("Unable to create project due to bad input. Sending client code 400")
    return res.status(400).send("Unable to create resource")
  }
}

//Will run on requestProject GET request
const loadProjects = function(callback){
  fs.readFile(projectTextFile,"utf-8", (err, data) => {
    if(err) {
      if(LOG_MODE)
        console.log("Unable to read project text file")
      throw err //Bad filesystem! We need to exit!
    } else {
      const projectList = data.split('\n')
        .filter((elem) => {return elem != ""})
        .map(JSON.parse)
      callback(projectList)
    }
  })
}

//Query Params
/*
 * projectid
 * country
 * number
 * keyword
 */

 const findHighestCost = function(projectList){
   return projectList.reduce(function(prev, current){
     return (prev.projectCost <= current.projectCost) ? current : prev
   })
 }

const selectProjectById = function(projectid, projectList){
  projectList = projectList.filter(elem => {
    return elem.id == projectid
  })

  if(projectList.length > 1){
    if(LOG_MODE)
      console.log("More than one project with given projectid! Returning that with highest project cost.")
    return findHighestCost(projectList)
  } else if(projectList.length == 1)
      return projectList[0]
    else
      return null
}

 const selectProject = function(query, projectList){
   //"If sent in request then should always return the project with matching id
   //regardless of any other rule.
   if(query.projectid){
     return selectProjectById(query.projectid, projectList)
  } else {
    //Filter projects for expiration date, projectUrl, and enabled==true
    const currentTime = new Date()
    projectList = projectList.filter(elem => {
      const expireDate = common.parseDateFormat(elem.expiryDate)
      const projUrl = elem.projectUrl
      const enabled = elem.enabled

      return (projUrl != null && projUrl != undefined) && (expireDate > currentTime) && enabled
    })

    //Filter for country query
    if(query.country){
      projectList = projectList.filter(elem => {
        elem.targetCountries.includes(query.country)
      })
    }

    //Filter for number query
    if(query.number){
      projectList = projectList.filter(elem => {
        return (elem.targetKeys.find(obj => {
          obj.number >= query.number
        }) != undefined)
      })
    }

    if(query.keyword){
      projectList = projectList.filter(elem => {
        return (elem.targetKeys.find(obj => {
          obj.keyword == query.keyword
        }) != undefined)
      })
    }

    //If there are one or greater elements can use reduction, otherwise return null
    if(projectList.length >= 1){
      return findHighestCost(projectList)
    } else {
      return null
    }

  }
 }

const requestProject = function(req, res){

  const projectId = req.query.projectid
  const country = req.query.country
  const number = req.query.number
  const keyword = req.query.keyword

  //Load projects.txt into memory
  loadProjects(function(projectList){

  //Choose project to return
  const selectedProject = selectProject(req.query, projectList)

    //Reply with project
    if(!selectedProject){
      if(LOG_MODE)
        console.log("No project found. Relaying to client")
      return res.status(200).json({
        message:"no project found"
      })
    } else {
      if(LOG_MODE)
        console.log(`Project query successful. Sending client 200 ok and Project with id ${selectedProject.id}`)
      return res.status(200).json( {
        "projectName":selectedProject.projectName,
        "projectCost":selectedProject.projectCost,
        "projectUrl":selectedProject.projectUrl
      })
    }
  })

}

module.exports = {createProject, requestProject}
