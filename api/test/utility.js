//Generate random Projects --> Used to fill data!
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomDate(){
  return "05112017 00:00:00"
}

function getRandomString(size){
  return Math.random().toString(36).substring(size);
}


const generateRandomProject = function(){
  return {
    "id": getRandomInt(0, 50000),
    "projectName":getRandomString(5),
    "creationDate":getRandomDate(),
    "expiryDate ":getRandomDate(),
    "targetCountries":[getRandomString(3),getRandomString(5)],
    "projectCost":getRandomInt(0,500),
    "projectUrl":`http://www.${getRandomString(6)}.com`,
    "targetKeys":[
      {"number":getRandomInt(0, 500),"keyword":getRandomString(2)},
      {"number":getRandomInt(500, 1000),"keyword":getRandomString(2)}
    ]
  }
}


module.exports = {
  generateRandomProject
}
