//Validates the input
//Returns true on a valid project post data
const validateProjectPostData = function(projectPostData){
  const validParams =
  ["id", "projectName", "creationDate", "expiryDate", "enabled",
   "targetCountries", "projectCost", "projectUrl", "targetKeys"]

   for(let paramName in projectPostData){
     if(!validParams.includes(paramName)){
      return false
     }
   }

   return true
  // const ProjectID = projectPostData.id && typeof(projectPostData.id) == "number"
  // const ProjectName = projectPostData.projectName && typeof(projectPostData.projectName) == "string"
  // const CreationDate = projectPostData.creationDate && typeof(projectPostData.creationDate) == "string"
  // const ExpiryDate = projectPostData.expiryDate && typeof(projectPostData.expiryDate) == "string"
  // const Enabled = projectPostData.enabled == true || projectPostData.enabled == false
  // const TargetCountries = projectPostData.targetCountries && typeof(projectPostData.targetCountries) == "object"
  // const ProjectCost = projectPostData.projectCost && typeof(projectPostData.projectCost) == "number"
  // const ProjectURL = projectPostData.projectUrl && typeof(projectPostData.projectUrl) == "string"
  // const TargetKeys = projectPostData.targetKeys && typeof(projectPostData.targetKeys) == "object"

  return ProjectID && ProjectName && CreationDate && ExpiryDate && TargetCountries && ProjectCost && ProjectURL && TargetKeys

}

module.exports = {
  validateProjectPostData,
}
