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

const getPastDate = function getPastDate(){
  const milliseconds = new Date().getTime()
  const pastDate = milliseconds - 50
  return common.sendToDateFormat(new Date(pastDate))
}

function getRandomString(size){
  return Math.random().toString(36).substring(size);
}

const generateRandomProject = function(obj){
  if(!obj)
    obj = {}

  return {
    "id": obj.id || getRandomInt(0, 500000),
    "projectName":obj.projectName || getRandomString(5),
    "creationDate":obj.creationDate || getCurrentDate(),
    "expiryDate":obj.expiryDate || getRandomDate(),
    "enabled": (obj.enabled != null || obj.enabled != undefined) ? obj.enabled : (getRandomInt(0,10) < 2) ? false: true,
    "targetCountries":obj.targetCountries || [(getRandomInt(0,10) < 3) ? "USA" : getRandomString(3),getRandomString(5)],
    "projectCost":obj.projectCost || getRandomInt(0,500),
    "projectUrl":obj.projectUrl || `http://www.${(getRandomInt(0,10) < 3) ? "unity3d" : getRandomString(6)}.com`,
    "targetKeys":obj.targetKeys || [
      {"number":(getRandomInt(0,10) < 3) ? 5 : getRandomInt(0, 500),"keyword":(getRandomInt(0,10) < 3) ? "swords" : getRandomString(2)},
      {"number":getRandomInt(500, 1000),"keyword":getRandomString(2)}
    ]
  }

}


module.exports = {
  generateRandomProject,
  getPastDate
}
