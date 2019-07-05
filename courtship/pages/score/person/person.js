const app = getApp();
var userDb = require('../../js/user.js')
var activityDb = require('../../js/activityDB.js')
var scoreDb = require('../../js/score.js')
var matchDb = require('../../js/match.js')
var msg = require('../../js/message.js')
var util = require('../../js/util.js')

Page({
  data: {
    houseArray: ['请选择', '无房', '北京有房', '北京周边有房', '天津有房', '老家有房', '其他城市有房'],
    formId: '',
    person: {},
    score: {},
    isSelf: false,
    activity: {}
  },
  onLoad: function(options) {
    var that = this;
    var personOpenid = options.personOpenid;
    var activityId = options.activityId;
    if (personOpenid == null || personOpenid == "") {
      wx.showToast({
        icon: 'none',
        title: '人员ID为空'
      })
      return;
    }
    if (activityId == null || activityId == "") {
      wx.showToast({
        icon: 'none',
        title: '活动ID为空'
      })
      return;
    }

    if (app.globalData.openid == personOpenid) {
      that.setData({
        isSelf: true
      })
    }

    //获取活动信息
    that.getActivityById(activityId);
    
    //获取人员信息、打分信息
    that.getPersonByOpenidAndScore(personOpenid, activityId);

  },

  //获取活动信息
  getActivityById: function (activityId) {
    var that = this;
    activityDb.getActivityById(activityId, function(data){
      if(data != null){
        that.setData({
          activity: data
        })
      }
    })
  },

  //获取人员信息、打分信息
  getPersonByOpenidAndScore: function(personOpenid, activityId) {
    var that = this;
    userDb.getUserByOpenid(personOpenid, function(data) {
      if (data.length > 0) {
        that.setData({
          person: data[0]
        })

        //设置导航标题
        that.setNavTitle(that.data.person.nickName);

        //获取打分信息
        that.getScore(activityId);
      }
    });
  },

  //设置导航标题
  setNavTitle: function(nickName) {
    var title = nickName;
    if (title != null && title != '') {
      title = "打分 - " + title;
    }
    wx.setNavigationBarTitle({
      title: title
    });
  },

  //获取打分信息
  getScore: function(activityId) {
    var that = this;
    var userId = that.data.person._id;
    //查询是否打过分
    scoreDb.findScoreByActivityIdAndOpenidAndUserId(activityId, app.globalData.openid, userId, function(scoreList) {
      if (scoreList.length > 0) {
        //本次活动已经打过分
        that.setData({
          score: scoreList[0]
        })
      }
    });
  },

  formReset: function() {
    console.log('form发生了reset事件')
  },

  //点击打分按钮
  score: function(e) {
    var that = this;

    var formId = e.detail.formId;
    that.setData({
      formId: formId
    })

    //{score,reason}
    var score = e.detail.value;
    var activityId = that.data.activity._id;

    console.log('打分，score：', score);

    scoreDb.findCountByActivityIdAndOpenid(activityId, app.globalData.openid, function(total) {
      //校验打分的条数,一次活动最多给5个人打分
      if (total >= app.globalData.scoreCount) {
        wx.showToast({
          icon: 'none',
          title: '一次活动最多只能给' + scoreCount + '个人打分',
        })
        return;
      }

      //打分
      that.doScore(activityId, score);

    });

  },

  //打分
  doScore: function(activityId, score) {
    var that = this;
    var userId = that.data.person._id;
    console.log(activityId);
    //查询是否打过分
    scoreDb.findScoreByActivityIdAndOpenidAndUserId(activityId, app.globalData.openid, userId, function(scoreList) {
      console.log("doScore: activityId - scoreList ", activityId, scoreList);
      if (scoreList.length == 0) {
        //本次活动没有打过分 - add
        score.activity = that.data.activity;
        score.user = that.data.person;
        score.createTime = new Date();
        scoreDb.addScore(score, function(scoreId) {
          if (scoreId != null) {
            score._id = scoreId;
            score._openid = that.data.person._openid
            that.scoreSuccess(null, score);
          } else {
            that.scoreFail();
          }
        });

      } else {
        //本次活动已经打过分 - update
        var scoreId = scoreList[0]._id;
        score.updateTime = new Date();
        scoreDb.updateScore(scoreId, score, function(count) {
          if (count > 0) {
            score._id = scoreId;
            score.activity = that.data.activity;
            score.user = that.data.person;
            score._openid = that.data.person._openid
            score.createTime = scoreList[0].createTime;
            that.scoreSuccess(scoreList[0], score);
          } else {
            that.scoreFail();
          }
        });

      }
    });
  },

  //打分失败
  scoreFail: function() {
    console.log("score fail");
    wx.showToast({
      icon: 'none',
      title: '打分失败',
    })
  },

  //打分成功（A-->B打分）
  scoreSuccess: function(oldScoreObj, newScoreObj) {
    var that = this;
    wx.showToast({
      title: '打分成功',
    })
    console.log("score success");

    //计算是否互相打分，只要有打分即可，不需要是同一个活动，并且分数都大于app.globalData.niceScore
    that.calculateMatch(oldScoreObj, newScoreObj);

  },


  //计算是否匹配（A-->B)，A:当前用户，B：被打分的人员。匹配规则：两人互相打分，并且分数都大于app.globalData.niceScore
  calculateMatch: function(oldScoreObj, newScoreObj, matchCallback) {
    var that = this;
    //(1)第一次打分 || 上次的分数低于app.globalData.niceScore（60）
    if (oldScoreObj == null || oldScoreObj.score < app.globalData.niceScore) {
      that.oldScoreLtNicescore(newScoreObj)
      return
    }

    //(2)上次的打分值不低于app.globalData.niceScore（60）
    //(2-1)新的打分记录低于niceScore（60）
    if (newScoreObj.score < app.globalData.niceScore) {
      that.oldScoreGteNiceScoreAndNewScoreLtNiceScore(oldScoreObj, newScoreObj);
      return
    }

    //(2-2)新的打分记录不低于niceScore（60）
    that.oldScoreGteNiceScoreAndNewScoreGteNiceScore(oldScoreObj, newScoreObj);

  },

  //计算匹配 - (oldScore < niceScore)
  oldScoreLtNicescore: function(newScoreObj) {
    var that = this;
    //(1-1)新的打分记录低于niceScore（60）
    if (newScoreObj.score < app.globalData.niceScore) {
      return;
    }
    //(1-2)新的打分记录不低于niceScore
    //重新计算（A-->B）的匹配，保存到match表，A:当前用户，B：被打分的人员。
    //找到（B-->A）的大于niceScore的maxScore,与（A-->B）newScoreObj形成匹配
    that.addAToBMatch(newScoreObj);
  },

  //计算匹配 - (oldScore >= niceScore && newScore < niceScore)
  oldScoreGteNiceScoreAndNewScoreLtNiceScore: function(oldScoreObj, newScoreObj) {
    var that = this;
    //老的打分是否有匹配
    matchDb.findMatchByScoreId(oldScoreObj._id, function(matchList) {
      //(2-1-1)老的打分没有match
      if (matchList.length == 0) {
        return;
      }
      //(2-1-2)老的打分有match del match, 重新计算（B-->A）的匹配
      var matchDel = matchList[0];
      that.getScoreAB(matchDel, oldScoreObj._id, function(scoreA, scoreB) {
        var aToBMaxScoreObj = null;
        that.findOpenidToUserIdMaxScore(scoreA._openid, scoreA.user._id, function(aToBMaxScoreObject) {
          aToBMaxScoreObj = aToBMaxScoreObject
          if (aToBMaxScoreObj == null) {
            return
          }
          //重新计算（B-- > A）的匹配
          //添加（B-- > A）的匹配
          if (aToBMaxScoreObj.score < app.globalData.niceScore) {
            //(2-1-2-1)匹配失败
            var length = matchList.length;
            for (var i = 0; i < length; i++) {
              matchDb.removeMatchById(matchList[i]._id);
            }
            return;
          }

          //(2-1-2-2)匹配成功
          var length = matchList.length;
          for (var i = 0; i < length; i++) {
            matchDb.removeMatchById(matchList[i]._id);
            that.getScoreAB(matchList[i], oldScoreObj._id, function (scoreA, scoreB) {
              that.addMatch(aToBMaxScoreObj, scoreB, false);
            });
          }
        });

        
      });

    });
  },

  //计算匹配 - (oldScore >= niceScore && newScore >= niceScore)
  oldScoreGteNiceScoreAndNewScoreGteNiceScore: function(oldScoreObj, newScoreObj) {
    var that = this;
    //老的打分是否有匹配
    matchDb.findMatchByScoreId(oldScoreObj._id, function(matchList) {
      //(2-2-1)老的打分没有match
      if (matchList.length == 0) {
        return;
      }
      //(2-2-2)老的打分有match del match, 重新计算（B-->A）的匹配
      var matchDel = matchList[0];
      that.getScoreAB(matchDel, oldScoreObj._id, function(scoreA, scoreB) {
        var aToBMaxScoreObj = null;
        that.findOpenidToUserIdMaxScore(scoreA._openid, scoreA.user._id, function(aToBMaxScoreObject) {
          aToBMaxScoreObj = aToBMaxScoreObject;
          if (aToBMaxScoreObj == null) {
            return
          }

          //重新计算（B-- > A）的匹配
          //添加（B-- > A）的匹配
          if (aToBMaxScoreObj.score < app.globalData.niceScore) {
            //(2-2-2-1)匹配失败，这种情况不会存在，newScoreObj > app.globalData.niceScore
            return;
          }

          //(2-2-2-2)匹配成功
          var length = matchList.length;
          if (newScoreObj._id == aToBMaxScoreObj._id) {
            //(2-2-2-2-1)newScoreObj与aToBMaxScoreObj为同一个对象
            for (var i = 0; i < length; i++) {
              that.updateMatch(aToBMaxScoreObj, scoreB)
            }
          } else {
            //(2-2-2-2-1)newScoreObj与aToBMaxScoreObj不是同一个对象
            for (var i = 0; i < length; i++) {
              that.updateMatch(aToBMaxScoreObj, scoreB);
              that.addAToBMatch(newScoreObj);
            }
          }
        })
      })
    })
  },

  //添加从A-->B的匹配
  addAToBMatch: function(newScoreAObj) {
    var that = this;
    var personOpenid = that.data.person._openid;
    var currentUserId = app.globalData.userInfo._id;
    that.findOpenidToUserIdMaxScore(personOpenid, currentUserId, function(bToAMaxScoreObj) {
      if (bToAMaxScoreObj == null){//匹配失败
        return
      }
      if (bToAMaxScoreObj.score >= app.globalData.niceScore) {
        //匹配成功
        that.addMatch(newScoreAObj, bToAMaxScoreObj, true);
      }
    })
  },

  getScoreAB: function(match, scoreAId, callback) {
    var scoreA = null;
    var scoreB = null;
    if (scoreAId == match.score1._id) { //A
      scoreA = match.score1;
      scoreB = match.score2;
    } else {
      scoreA = match.score2;
      scoreB = match.score1;
    }
    callback(scoreA, scoreB);
  },

  // 查询[openid - > userId]的最高打分记录，有则通过callback返回；若没有，则通过callback返回null
  findOpenidToUserIdMaxScore: function(openid, userId, callback) {
    var that = this;
    var query = {
      _openid: openid,
      user: {
        _id: userId
      }
    }
    scoreDb.findScoreByQuery(query, function(scoreList) {
      if (scoreList.length == 0) {
        console.log("没有查到[openid - > userId]的打分记录", openid, userId);
        //没有查到相互打分
        callback(null);
        return;
      }

      //查找最高分
      var length = scoreList.length;
      var maxScoreObj = scoreList[0];
      for (var i = 1; i < length; i++) {
        if (scoreList[i].score > maxScoreObj.score) {
          maxScoreObj = scoreList[i];
        }
      }
      console.log("查到[openid - > userId]的最高打分记录，maxScoreObj: ", maxScoreObj);
      callback(maxScoreObj);
    });
  },


  // 查询[openid - > userId]的最高打分记录，有则通过callback返回；若没有，则通过callback返回null
  addMatch: function(scoreObj1, scoreObj2, isShowMatch) {
    var that = this;
    var match = {
      score1: scoreObj1,
      score2: scoreObj2,
      createTime: new Date()
    }
    matchDb.addMatch(match, function(matchId) {
      if (matchId != null && isShowMatch) { //保存成功
        that.showMatch(scoreObj1, scoreObj2);
      }
    });
  },

  //提示匹配成功
  showMatch: function (scoreObj1, scoreObj2) {
    var that = this;
    var index = Math.ceil(Math.random() * matchDb.matchMsgArray.length);
    wx.showModal({
      title: '匹配成功 - 赶紧加微信，一起去脱单吧',
      content: matchDb.matchMsgArray[index],
      showCancel: false,
      confirmText: '确定',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击了“确定”')
        }
      }
    })

    //发送匹配消息 - 一个表单只能发送一条消息，所以这里给对方发送消息，不给自己发消息了
    if (scoreObj1.user._openid == that.data.person._openid){//给被打分的人person发送消息
      that.sendOneMsg(scoreObj2.user, scoreObj1.user, matchDb.matchMsgArray[index]);
    }else{
      that.sendOneMsg(scoreObj1.user, scoreObj2.user, matchDb.matchMsgArray[index]);
    }
  },

  sendOneMsg: function (fromUser, toUser, tips) {
    var index = Math.ceil(Math.random() * matchDb.matchMsgArray.length);
    var msgObj = {
      formId: this.data.formId,
      nickName: fromUser.nickName,
      job: fromUser.job,
      age: fromUser.birthday,
      hobby: fromUser.hobby,
      tips: tips
    }
    //发送匹配消息
    msg.sendTemplateMsg(fromUser._openid, msgObj, function (res) {
      if (res.result.errCode == 0) {//todo 消息发送失败，保存到数据库，每三分钟重新尝试发送
        console.log("send success");
      } else {
        console.log("send fail, save to db");
      }
    });
  },


  updateMatch: function(scoreObj1, scoreObj2, callback) {
    var that = this;
    var match = {
      score1: scoreObj1,
      score2: scoreObj2,
      updateTime: new Date()
    }
    matchDb.updateMatch(match, function(count) {
      if (count > 0) { //保存成功
        console.log("匹配结果更新成功");
      }
    });
  },



})