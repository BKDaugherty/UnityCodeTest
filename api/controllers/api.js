//Defines the main functionality of the REST service

const fs = require('fs') //Used to write to txt file
const projectTextFile = "projects.txt" //place to store data
const util = require('./utility.js') //Holder for utility functions
const common = require('../common/utility') //Holder for utility functions common to multiple modules
const LOG_MODE = process.env.LOG_MODE //Used to turn logging on or off!

//Will run on createProject POST request
const createProject = function(req, res){
  //Receives the body of the request in req.body
  //Attempt to validate
  if(util.validateProjectPostData(req.body)){
    if(LOG_MODE)
      console.log("Request Body successfully validated")

    //On validation, write body to file
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

        //Send success response to client
        return res.status(200)
          .json({
              message:"campaign is successfully created"
        })
      }
    })
  } else {
    if(LOG_MODE)
      console.log("Unable to create project due to bad input. Sending client code 400")
    //Unable to create, send failure to client
    return res.status(400).send("Unable to create resource")
  }
}

//Used to load the projects from the txt file
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



//Implements selection rules to choose project based on query
//Uses map, filter and reduce as methods to functionally find the
//item we are searching for
 const selectProject = function(query, projectList){
   //If ID is present, disregard all other rules
   if(query.projectid){
     return selectProjectById(query.projectid, projectList)
  } else {
    if(LOG_MODE)
      console.log("FILTERING BY QUERY")
    //Filter projects for expiration date, projectUrl, and enabled==true
    const currentTime = new Date()
    projectList = projectList.filter(elem => {
      const expireDate = common.parseDateFormat(elem.expiryDate)
      const projUrl = elem.projectUrl
      const enabled = elem.enabled

      return (projUrl != null && projUrl != undefined) && (expireDate > currentTime) && enabled
    })

    if(LOG_MODE){
      console.log("AFTER GENERAL")
      console.log(projectList)
    }

    //Filter for country query
    if(query.country){
      projectList = projectList.filter(elem => {
        return elem.targetCountries.includes(query.country)
      })
    }


    if(LOG_MODE) {
      console.log("COUNTRY AFTER")
      console.log(projectList)
    }

    //Filter for number query
    if(query.number){
      projectList = projectList.filter(elem => {
        return (elem.targetKeys.find(obj => {
          return (obj.number >= query.number)
        }) != undefined)
      })
    }

    if(LOG_MODE){
      console.log("NUMBER AFTER")
      console.log(projectList)
    }

    //Filter for keyword query
    if(query.keyword){
      projectList = projectList.filter(elem => {
        return (elem.targetKeys.find(obj => {
          return obj.keyword === query.keyword
        }) != undefined)
      })
    }

    if(LOG_MODE){
      console.log("KEYWORD AFTER")
      console.log(projectList)
    }

    //If there are one or greater elements can use reduction, otherwise return null
    if(projectList.length >= 1){
      return findHighestCost(projectList)
    } else {
      return null
    }

  }
 }


//Runs on requestProject endpoint
/* Query Params
 * projectid
 * country
 * number
 * keyword
 */
const requestProject = function(req, res){

  const projectId = req.query.projectid
  const country = req.query.country
  const number = req.query.number
  const keyword = req.query.keyword

  //Load projects.txt into memory
  loadProjects(function(projectList){

  //Choose project to return
  const selectedProject = selectProject(req.query, projectList)

    //Reply with selected project
    if(!selectedProject){
      if(LOG_MODE)
        console.log("No project found. Relaying to client")
      //No project, send no project found message
      return res.status(200).json({
        message:"no project found"
      })
    } else {
      if(LOG_MODE)
        console.log(`Project query successful. Sending client 200 ok and Project with id ${selectedProject.id}`)
      //Found project, successful reply
      return res.status(200).json({
        "projectName":selectedProject.projectName,
        "projectCost":selectedProject.projectCost,
        "projectUrl":selectedProject.projectUrl
      })
    }
  })

}

module.exports = {createProject, requestProject}
