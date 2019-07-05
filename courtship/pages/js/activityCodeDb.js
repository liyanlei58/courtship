const db = wx.cloud.database();

module.exports = {

  //产生活动参与码
  generateActivityCode: function(activityId, callback) {
    var that = this;
    //查询所有活动参与码，若超过5分钟，则删除，有5分钟之内的则返回
    that.removeAllByActivityId(activityId, function(count){
      console.log("del code count : ", count);
      var code = that.generateRandomCode();
      that.addActivityCode(activityId, code, function(dataId){
        if(dataId != null){
          callback(code);//添加成功
        }
      })
    });
  },

  //查询活动参与码
  generateRandomCode: function() {
    var code = "";　　
    for (var i = 0; i < 6; i++) {　　　　
      var radom = Math.floor(Math.random() * 10);　　　　
      code += radom;　　
    }　　
    console.log(code);
    return code;
  },

  //查询活动参与码
  getActivityCode: function(activityId, callback) {
    var time = new Date(); //当前时间
    time.setTime(time.setMinutes(time.getMinutes() - 5)); //验证码5分钟内有效
    //查询所有活动参与码，若超过5分钟，则删除，有5分钟之内的则返回
    db.collection('activity_code').where({
      activityId: activityId
    }).orderBy("createTime", "asc").get().then(res => {
      console.log('[数据库] [查询活动参与码] 成功: ', res);
      var codeList = res.data;
      if (codeList.length == 0) {
        callback(null);
        return;
      }
      var length = codeList.length;
      for (var i = 0; i < length; i++) {
        if (codeList[i].createTime < time) { //验证码5分钟内有效，超过5分钟则删除
          this.removeActivityCodeById(codeList[i]._id);
        } else {
          callback(codeList[i].code);
          return;
        }
      }
      callback(null);
    }).catch(err => {
      console.error('[数据库] [查询活动参与码] 失败：', err)
    });
  },

  //添加活动参与码
  addActivityCode: function(activityId, code, callback) {
    var activityCode = {
      activityId: activityId,
      code: code,
      createTime: new Date()
    }
    
    db.collection('activity_code').add({
      data: activityCode
    }).then(res => {
      // 在返回结果中会包含新创建的记录的 _id
      console.log('[数据库] [添加用户 - 自定义用户信息] 成功，记录 _id: ', res._id)
      callback(res._id);
    }).catch(err => {
      console.error('[数据库] [添加用户 - 自定义用户信息] 失败：', err)
    });

  },

  //根据id删除活动参与码
  removeActivityCodeById: function(codeId, callback) {
    db.collection('activity_code').doc(codeId).remove().then(res => {
      console.log('[数据库] [根据id删除活动参与码] 成功: ', res);
      callback(res.stats.removed);
    }).catch(err => {
      console.error('[数据库] [根据id删除活动参与码] 失败：', err)
    });
  },

  //根据id删除活动参与码
  removeAllByActivityId: function (activityId, callback) {
    //查询所有活动参与码，若超过5分钟，则删除，有5分钟之内的则返回
    db.collection('activity_code').where({
      activityId: activityId
    }).get().then(res => {
      console.log('[数据库] [查询活动参与码] 成功: ', res);
      var codeList = res.data;
      if (codeList.length == 0) {
        callback(0);
        return;
      }
      var length = codeList.length;
      for (var i = 0; i < length; i++) {
        this.removeActivityCodeById(codeList[i]._id);
      }
      //会不会有异步问题
      callback(length);
    }).catch(err => {
      console.error('[数据库] [查询活动参与码] 失败：', err)
    });
  }

}