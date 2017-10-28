//Generate random Projects --> Used to fill data!
const common = require('../common/utility')

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getCurrentDate(){
  return common.sendToDateFormat(new Date())
}

function getRandomDate(){

  const milliseconds = new Date().getTime()
  const pseudoRandomDate = milliseconds + getRandomInt(-100000, 5000000)

  return common.sendToDateFormat(new Date(pseudoRandomDate))
}

function getRandomString(size){
  return Math.random().toString(36).substring(size);
}

const generateRandomProject = function(){
  return {
    "id":getRandomInt(0, 500000),
    "projectName":getRandomString(5),
    "creationDate":getCurrentDate(),
    "expiryDate":getRandomDate(),
    "enabled":(getRandomInt(0,10) < 2) ? false: true,
    "targetCountries":[(getRandomInt(0,10) < 3) ? "USA" : getRandomString(3),getRandomString(5)],
    "projectCost":getRandomInt(0,500),
    "projectUrl":`http://www.${(getRandomInt(0,10) < 3) ? "unity3d" : getRandomString(6)}.com`,
    "targetKeys":[
      {"number":(getRandomInt(0,10) < 3) ? 5 : getRandomInt(0, 500),"keyword":(getRandomInt(0,10) < 3) ? "swords" : getRandomString(2)},
      {"number":getRandomInt(500, 1000),"keyword":getRandomString(2)}
    ]
  }
}


module.exports = {
  generateRandomProject
}
