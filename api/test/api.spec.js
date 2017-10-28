//Required modules
const dummyClient = require("../client/clientApi.js")
const util = require("./utility.js")
//Testing framework used
const expect = require("chai").expect
const mocha = require("mocha")

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
      describe("Attempt to create an invalid project", function(){

      })
    })
  })
  describe.only("RequestProject", function(){
    describe("Positive Tests", function(){
      //Insert specific projects so we know what we are looking for
      let project
      before(function(){
        project = util.generateRandomProject()
        return dummyClient.createProject(project)
      })
      describe("Request project with no params", function(){
        it("Should return created project", function(){
          return dummyClient.requestProject(project.id).then(message => {
            message = JSON.parse(message)
            expect(message.projectName).to.equal(project.projectName)
            expect(message.projectCost).to.equal(project.projectCost)
            expect(message.projectUrl).to.equal(project.projectUrl)
          })
        })
      })
    })
    describe("Negative Tests", function(){

    })
  })
})
