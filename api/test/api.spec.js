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
          return dummyClient.createProject(util.generateRandomProject())
        })
      })
    })
    describe("Negative Tests", function(){

    })
  })
  describe("RequestProject", function(){
    describe("Positive Tests", function(){

    })
    describe("Negative Tests", function(){

    })
  })
})
