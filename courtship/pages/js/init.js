module.exports = {
  getOpenid: function(callback) {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {}
    }).then(res => {
      console.log('[云函数] [login] user openid: ', res.result.openid)
      callback(res.result.openid)
    }).catch(err => {
      console.error('[云函数] [login] 调用失败', err)
    });

  },

  getUserInfoFromWx: function (callback) {
    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    wx.getUserInfo({
      success: res => {
        console.log('[云函数] [getUserInfo]成功，res: ', res)
        callback(res.userInfo)
      }
    })
  },

  //从本地缓存中获取值
  getFromCache: function (key, hasCallback, noCallback) {
    try {
      var value = wx.getStorageSync(key)
      if (value) {//存在
        hasCallback(value)
      } else {//不存在
        noCallback()
      }
    } catch (e) {
      console.log("从本地缓存中获取[" + key + "]异常, e: ", e)
    }
  },

  //把值存入本地缓存
  setToCache: function (key, value) {
    try {
      wx.setStorageSync(key, value)
    } catch (e) {
      console.log("把[" + key + "] = [" + value + "]存入本地缓存异常, e: ", e)
    }
  },

  //把值存入本地缓存
  setToCacheSync: function (key, value, callback) {
    try {
      wx.setStorageSync(key, value)
      callback()
    } catch (e) {
      console.log("把[" + key + "] = [" + value + "]同步存入本地缓存异常, e: ", e)
    }
  },

}