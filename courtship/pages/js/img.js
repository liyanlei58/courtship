var util = require('./util.js');
module.exports = {

  // 上传图片
  doUpload: function(callback) {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        wx.showLoading({
          title: '上传中',
        });
        const filePath = res.tempFilePaths[0]
        // 上传图片 文件名称
        const cloudPath = new Date().getTime() + util.getRandomNum(6) + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            // console.log('filePath: ', filePath)
            // console.log('cloudPath: ', cloudPath)
            callback(res)
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  // 删除图片
  deletePhoto: function (fileId, callback) {
    wx.cloud.deleteFile({
      fileList: [fileId]
    }).then(res => {
      // handle success
      console.log(res.fileList)
      callback(res)
    }).catch(error => {
      // handle error
      console.log("删除图片失败，error: ", error)
    })
  },


}