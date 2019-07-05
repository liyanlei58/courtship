const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  var templateId = event.templateId
  console.log("event:", event);
  var param = {
    id: templateId
  }
  console.log("param:", param);
  try {
    const result = await cloud.openapi.templateMessage.getTemplateLibraryById(param)
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}