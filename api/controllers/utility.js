//Validates the input of the post request
//Returns true on a valid project post data
const validateProjectPostData = function(projectPostData){
  const validParams =
  ["id", "projectName", "creationDate", "expiryDate", "enabled",
   "targetCountries", "projectCost", "projectUrl", "targetKeys"]

   if(Object.keys(projectPostData).length < validParams.length){
     return false
   }

   for(let paramName in projectPostData){
     if(!validParams.includes(paramName)){
      return false
     }
   }

   return true
}

module.exports = {
  validateProjectPostData,
}
