// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
var templateId = '0I95M35e7dBc7JVNc0O0zxN0uDauro_1PsKeIPxB36w'
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log("touser: ", wxContext.OPENID);
  console.log("send msg event: ",event);

  var toUser = event.toUserOpenid;
  var msgObj = event.msgObj;
  
  try {
    const result = await cloud.openapi.templateMessage.send({
      touser: toUser,
      // page: 'pages/me/index/index',
      data: {
        keyword1: {
          value: msgObj.nickName
        },
        keyword2: {
          value: msgObj.job
        },
        keyword3: {
          value: msgObj.age
        },
        keyword4: {
          value: msgObj.hobby
        },
        keyword5: {
          value: msgObj.tips
        }
      },
      templateId: templateId,
      formId: msgObj.formId,
      emphasisKeyword: 'keyword1.DATA'
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}


