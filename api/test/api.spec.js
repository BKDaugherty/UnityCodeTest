//Required modules
const dummyClient = require("../client/clientApi.js") //Used to simulate REST requests
//Utility functionalities
const util = require("./utility.js")
const common = require('../common/utility')

//Testing framework used
const expect = require("chai").expect
const mocha = require("mocha")

const request = require("request-promise") //Used for more freedom in REST requests
const port = process.env.port || 7846
const baseURL = "http://localhost:" + port



//Wrapper function for successful id requests
const testIDRequest = function(query, project){
  return dummyClient.requestProject(query)
  .then(message => {
    message = JSON.parse(message)
    expect(message.projectName).to.equal(project.projectName)
    expect(message.projectCost).to.equal(project.projectCost)
    expect(message.projectUrl).to.equal(project.projectUrl)
  })
}


//Mocha is used as a Test framework, and is meant to be as descriptive as possible!
//Group subsections in describe blocks, each it is a test case.
describe("Testing Framework", function(){
  describe("CreateProject", function(){
    describe("Positive Tests", function(){
      describe("Create a valid project", function(){
        it("Should return '200 OK' and the response: 'campaign is sucessfully created'", function(){
          return dummyClient.createProject(util.generateRandomProject()).then(message => {
            expect(message.message).to.equal("campaign is successfully created")
          })
        })
      })
      describe("Create a lot of valid projects", function(){
        it("Should all return 200 OK and the response: 'campaign is successfully created'", function(){
          //Give more time because of amount of requests
          let arrayOfPromises = []
          for(let i = 0; i < 150; i++){
            arrayOfPromises.push(dummyClient.createProject(util.generateRandomProject()).then(message => {
              expect(message.message).to.equal("campaign is successfully created")
            }))
          }

          return Promise.all(arrayOfPromises)

        })
      })
    })
    describe("Negative Tests", function(){
      describe("Invalid URL", function(){
        it("Attempt to post to an invalid URL returns 404", function(){
          const proj = util.generateRandomProject()
          return request.post({url:baseURL + "/requestProject", json:proj}).catch(err => {
            expect(err.statusCode).to.equal(404)
          })
        })
      })

      describe("Attempt to create an invalid project", function(){
        it("Empty body should be rejected", function(){
          return dummyClient.createProject(null).catch(err => {
            expect(err.statusCode).to.equal(400)
          })
        })
        it("Body that isn't a JSON should be rejected", function(){
          return dummyClient.createProject("Hello").catch(err => {
            expect(err.statusCode).to.equal(400)
          })
        })
        it("Post with no id should be rejected", function(){
          let project = util.generateRandomProject()
          project.id = null
          return dummyClient.createProject(project).catch(err => {
            expect(err.statusCode).to.equal(400)
          })
        })
        it("Post without expiration date should be rejected", function(){
          let project = util.generateRandomProject()
          project.expiryDate = null
          return dummyClient.createProject(project).catch(err => {
            expect(err.statusCode).to.equal(400)
          })
        })
        it("Post without creation date should be rejected", function(){
          let project = util.generateRandomProject()
          project.creationDate = null
          return dummyClient.createProject().catch(err => {
            expect(err.statusCode).to.equal(400)
          })
        })
        it("Post without targetKeys should be rejected", function(){
          let project = util.generateRandomProject()
          project.targetKeys = null
          return dummyClient.createProject().catch(err => {
            expect(err.statusCode).to.equal(400)
          })
        })
        it("Post without projectCost should be rejected", function(){
          let project = util.generateRandomProject()
          project.projectCost = null
          return dummyClient.createProject().catch(err => {
            expect(err.statusCode).to.equal(400)
          })
        })
        it("Post without targetCountries should be rejected", function(){
          let project = util.generateRandomProject()
          project.targetCountries = null
          return dummyClient.createProject().catch(err => {
            expect(err.statusCode).to.equal(400)
          })
        })

      })
    })
  })
  describe("RequestProject", function(){
    describe("Positive Tests", function(){
      //Insert specific projects so we know what we are looking for
      describe("Request for specific id", function(){
        let project
        before(function(){
          project = util.generateRandomProject()
          return dummyClient.createProject(project)
        })
        describe("Request project with id returns the correct project", function(){
          it("Should return created project", function(){
            return testIDRequest({projectid:project.id}, project)
          })
        })
        describe("Request project with extraneous information requests by id", function(){
            it("With bad country, returns created project", function(){
              return testIDRequest({projectid:project.id, country:"ALABAMA"}, project)
            })
            it("With bad country and bad keyword, returns created project", function(){
              return testIDRequest({projectid:project.id, country:"ALABAMA", keyword:"YOPE"}, project)
            })
            it("With bad keyword, returns created project", function(){
              return testIDRequest({projectid:project.id, keyword:"YOPE"}, project)
            })
            it("With bad number, returns created project", function(){
              return testIDRequest({projectid:project.id, number:4000000}, project)
            })
        })
        describe("Testing Rules algorithm", function(){

          //Setup environment
          before(function(){
            //Create all projects and return promises
            const projectsToCreate = [util.generateRandomProject({id:1, projectName:"1", enabled:false}),
              util.generateRandomProject({id:2, projectName:"2", projectCost:7000, targetCountries:["GB"], targetKeys:[{number:500, keyword:"HelloWorld"}], enabled:true}),
               util.generateRandomProject({id:3,projectName:"3", projectCost:5000, enabled:true}),
            util.generateRandomProject({id:6, projectName:"6", projectCost:15000, enabled:false, targetCountries:["USA", "GB"]} ),
             util.generateRandomProject({id:5, projectName:"5", projectCost:12000, targetKeys:[{number:250, keyword:"HelloWorld"}], enabled:true}),
           util.generateRandomProject({id:7, projectName:"7", projectCost:100000, targetKeys:[{number:800, keyword:"HelloWorld"}], enabled:true, expiryDate:util.getPastDate()})]

            return common.clearDatabase().then(() => {
              //Need to write this to DB, as error handling on
              //first endpoint wont allow it
              let projWithBadURL = util.generateRandomProject({id:4, projectName:"4", projectCost:20000})
              projWithBadURL.projectUrl = null
              return common.writeToDB(projWithBadURL)

            }).then(() => {
              return Promise.all(projectsToCreate.map(elem => {
                return dummyClient.createProject(elem)
              }))
            })
          })

          it("Query for id 1 should return even though enabled is false", function(){
            return dummyClient.requestProject({projectid:1}).then(message => {
              message = JSON.parse(message)
              expect(message.projectName).to.equal("1")
            })
          })

          it("Query for all projects with no params should return projectName 5", function(){
            return dummyClient.requestProject().then(message => {
              message = JSON.parse(message)
              expect(message.projectName).to.equal("5")
            })
          })
          it("Query for GB should return projectName 2", function(){
            return dummyClient.requestProject({country:"GB"}).then(message => {
              message = JSON.parse(message)
              expect(message.projectName).to.equal("2")
            })
          })

          it("Query for Scotland should return no project found", function(){
            return dummyClient.requestProject({country:"Scotland"}).then(message => {
              message = JSON.parse(message)
              expect(message.message).to.equal("no project found")
            })
          })

          it("Query for keyword HelloWorld should return projectName 5", function(){
            return dummyClient.requestProject({keyword:"HelloWorld"}).then(message => {
              message = JSON.parse(message)
              expect(message.projectName).to.equal("5")
            })
          })

          it("Query for keyword HelloWorld and number < 250 should return projectName 5", function(){
            return dummyClient.requestProject({keyword:"HelloWorld", number:200}).then(message => {
              message = JSON.parse(message)
              expect(message.projectName).to.equal("5")
            })
          })

          it("Query for keyword HelloWorld and number == 250 should return projectName 5", function(){
            return dummyClient.requestProject({keyword:"HelloWorld", number:250}).then(message => {
              message = JSON.parse(message)
              expect(message.projectName).to.equal("5")
            })
          })
          it("Query for keyword HelloWorld and number > 250 should return projectName 2", function(){
            return dummyClient.requestProject({keyword:"HelloWorld", number:251}).then(message => {
              message = JSON.parse(message)
              expect(message.projectName).to.equal("2")
            })
          })
        })
      })
    })
    describe("Negative Tests", function(){
      describe("Invalid URL", function(){
        it("Attempt to GET anything other than requestProject returns 404", function(){
          return request.get(baseURL + "/requstProject?").catch(err => {
            expect(err.statusCode).to.equal(404)
          })
        })
        it("Attempt to GET createProject returns 404", function(){
          return request.get(baseURL + "/createProject").catch(err => {
            expect(err.statusCode).to.equal(404)
          })
        })
      })
      describe("Invalid Parameters", function(){
        it("Should take empty query to be standard", function(){
          return request.get(baseURL + "/requestProject").then(message => {
            message = JSON.parse(message)
            expect(message.projectName).to.equal("5")
          })
        })
        it("Should ignore invalid params", function(){
          return request.get(baseURL + "/requestProject?apple=cheese&triangle=square")
        })
        it("Should ignore bad params", function(){
          return request.get(baseURL + "/requestProject?projectid=null&keyword=HelloWorld").then(message => {
            message = JSON.parse(message)
            expect(message.message).to.equal("no project found")
          })
        })
        it("Should not find a project with id ${true}", function(){
          return request.get(baseURL + "/requestProject?projectid=${true}").then(message => {
            message = JSON.parse(message)
            expect(message.message).to.equal("no project found")
          })
        })
      })
    })
  })
})
