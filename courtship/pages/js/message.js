module.exports = {

  //发送客服文本消息
  sendTemplateMsg: function (toUserOpenid, msgObj, callback) {
  
    var param = {
      toUserOpenid: toUserOpenid,
      msgObj: msgObj
    };
    console.log("msg obj : ", param);
    // 调用云函数
    wx.cloud.callFunction({
      name: 'sendTemplateMsg',
      data: param
    }).then(res => {
      console.log('[云函数] [发送模板消息] : ', res)
      callback(res)
    }).catch(err => {
      console.error('[云函数] [发送模板消息] 调用失败', err)
    });

  },

  //获取模板消息
  getTemplateMsgById: function (templateId, callback) {
    // templateId = '0I95M35e7dBc7JVNc0O0zyORd42_XTtwY7KqoCRr_-E'
    console.log("getTemplateMsgById templateId: ", templateId);
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getTemplate',
      data: {
        templateId: templateId
      }
    }).then(res => {
      console.log('[云函数] [获取模板消息] : ', res)
      callback(res)
    }).catch(err => {
      console.error('[云函数] [获取模板消息] 调用失败', err)
    });

  },

  //获取模板消息列表
  getTemplateList: function (offset, count, callback) {
    console.log("offset - count", offset, count);
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getTemplateList',
      data: {
        offset: offset,
        count: count
      }
    }).then(res => {
      console.log('[云函数] [获取模板消息列表] : ', res)
      callback(res)
    }).catch(err => {
      console.error('[云函数] [获取模板消息列表] 调用失败', err)
    });

  },


}