const padLeft = function(str){
  if(str.length == 1){
    return "0" + str
  } else {
    return str
  }
}

const parseDateFormat = function (d){
  const dateString = d.substr(0,2) + " " + d.substr(2,2) + " " + d.substr(4, 4) + " " + d.substr(8)
  const date = new Date(dateString)
  return date
}

const sendToDateFormat = function(d){
  const month = padLeft((d.getMonth() + 1).toString())
  const day = padLeft(d.getDay().toString())
  const year = d.getFullYear()

  const hour = padLeft(d.getHours().toString())
  const minute = padLeft(d.getMinutes().toString())
  const second = padLeft(d.getSeconds().toString())

  const dateString = `${month}${day}${year} ${hour}:${minute}:${second}`
  return dateString
}

module.exports = {
  parseDateFormat,
  sendToDateFormat
}
