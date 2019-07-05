const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  console.log("event:", event);
  try {
    const result = await cloud.openapi.templateMessage.getTemplateList({
      offset: event.offset,
      count: event.count
    })
    console.log("getTemplateList: ", result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}
