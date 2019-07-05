const db = wx.cloud.database()
const _ = db.command

module.exports = {
  matchMsgArray: [
    '爱情这东西，时间很关键，认识得太早或太晚，都不行。',
    '你说你不会让我找不到你，我也是。',
    '就算全世界不要你，还有我来疼你。',
    '全世界只有一个你，叫我如何不珍惜。',
    '只要你需要我，我永远在你能看到的地方。',
    '全世界只有你最懂我，比我自己还要了解我。',
    '你信不信有一种感情，一辈子都不会输给时间。',
    '时光不老，我们不散，天不会不蓝，我不会不在。',
    '就算全世界背叛你，我会在你身后背叛全世界。',
    '开心的时候要想起我，难受的时候要记得你还有我。',
    '找你帮忙不需要寒暄，直奔主题。最后，不说谢谢。',
    '我爱你，不是因为你是一个怎样的人，而是因为我喜欢与你在一起时的感觉',
    '我想在你的心里盖一间小屋，高兴了在那里挥拳欢呼，伤心了躲着放声痛哭。屋前有一条小路，屋后种一片毛竹。请问你心里还有地么，可不可以出租',
    '我会想你，在漫漫长路的每一步。无论你身在何处，无论你为何忙碌，我都会在此守候。热烈的爱情是不可抑制的渴望。',
    '曾经相遇，总胜过从未碰头。',
    '是谁说过，心的空间有时候很大，可以装得下整个世界。可有时候却很小很小，只能够住得下一个人。',
    '你在的时候，你是一切;你不在的时候，一切是你。吾爱永恒。',
    '两个默默相爱的人，彼此懂得，彼此一个眼神，一个动作，都能读懂，走进彼此的心里进驻。哪怕静静的并肩坐着，都是一种幸福，安心的温暖，在心间化开。因为爱情，不会轻易悲伤，因为爱情，现世安稳，因为爱情，如此美丽。就算世界背离，也依旧拉着彼此向前。同一个梦，同一个信念，同一个终点。',
    '每个人都有一颗守护的星，传说那是颗爱人的心。亲爱的你，我已在星星上刻了你的名字，那是我为你守候为你爱着的星。',
    '什么是幸福?那是有了你;什么是无奈?那是情人节的时候却无法与你相伴;什么是爱情?那是你我之间的感觉!',
    '原来，再大的房子，再大的床，没有相爱的人陪伴，都只是冰冷的物质。而如果身边有爱人陪伴，即使房子小，床小，也觉得无关紧要，因为这些物质上面有了爱的温度，成了家的元素。',
    '找伴侣，就是信任宽容，让你有安全感，只要双方相爱想上进，物质会改善的。要珍惜容忍你耍小性子，耍小脾气的人，试想，你长这么大，除了父母，也许只有他了，这是多么难得的福分;但小性子小脾气不要总拿出来，即使他能多次包容，但有些东西可能就会变了。',
    '因为你，我懂得了爱。爱情是生活最好的提神剂。爱情永不死。有了你，黑暗不再是黑暗。',
    '世上最遥远的距离，不是生与死的距离，不是天各一方，而是我就站在你面前，你却不知道我爱你。',
    '别离，是为了重聚。',
    '我们放下自尊，放下骄傲，放下任性，只因我们放不下一个人。',
    '爱上一个人的时候，总会有点害怕，怕得到他;怕失掉他。',
    '距离使两颗心靠得更近。我们需要彼此，正如我们需要呼吸空气。',
    '天涯地角有穷时，只有相思无尽处。',
    '何当共剪西窗烛，却话巴山夜雨时。',
    '执手相看泪眼，竟无语凝噎。',
    '若待得君来向此，花前对酒不忍触。',
    '伤心明月凭阑干，想君思我锦衾寒。',
    '君知妾有夫，赠妾双明珠。。',
    '天长地久有时尽，此恨绵绵无绝期。。',
    '人面不知何处去，桃花依旧笑春风。。',
    '花落花开自有时，总赖东君主。。',
    '为君憔悴尽，百花时。。',
    '寂寞深闺，柔肠一寸愁千缕。。',
    '妾身悔作商人妇，妾命当逢薄幸夫。。',
    '君若清路尘，妾若浊水泥。。',
    '乌啼隐杨花，君醉留妾家。。',
    '重叠泪痕缄锦字，人生只有情难死。。',
    '上穷碧落下黄泉，两处茫茫皆不见。。',
    '旋开旋落旋成空，白发多情人更惜。。',
    '愿君多采撷，此物最相思。。',
    '今夜鄜州月，闺中只独看。。',
    '平生不会相思，才会相思，便害相思。。',
    '落花人独立，微雨燕双飞。。',
    '当君怀归日，是妾断肠时。。',
    '美人卷珠帘，深坐颦蛾眉。。',
    '名花倾国两相欢，长得君王带笑看。。',
    '愿我如星君如月，夜夜流光相皎洁。。',
    '相思已是不曾闲，又那得、工夫咒你。。',
    '可怜无定河边骨，犹是春闺梦里人。。',
    '人到情多情转薄，而今真个不多情。。',
    '只愿君心似我心，定不负相思意。。',
    '人生自是有情痴，此恨不关风与月。。',
    '一日不思量，也攒眉千度。。',
    '似此星辰非昨夜，为谁风露立中宵。。',
    '相思相望不相亲，天为谁春。。',
    '东边日出西边雨，道是无晴却有晴。。',
    '出入君怀袖，动摇微风发。。',
    '断无蜂蝶慕幽香，红衣脱尽芳心苦。。',
    '从此无心爱良夜，任他明月下西楼。。',
    '曾经沧海难为水，除却巫山不是云。。',
    '取次花丛懒回顾，半缘修道半缘君。。',
    '盈盈一水间，脉脉不得语。。',
    '看朱成碧思纷纷，憔悴支离为忆君。。',
    '尊前拟把归期说，未语春容先惨咽。。',
    '相思似海深，旧事如天远。。',
    '寂寂花时闭院门，美人相并立琼轩。。',
    '为君持酒劝斜阳，且向花间留晚照。。',
    '月上柳梢头，人约黄昏后。。',
    '惜分长怕君先去，直待醉时休。。',
    '诚知此恨人人有，贫贱夫妻百事哀。。',
    '只愿君心似我心，定不负相思意。。',
    '此曲有意无人传，愿随春风寄燕然，忆君迢迢隔青天。。',
    '直道相思了无益，未妨惆怅是清狂。。',
    '新知遭薄俗，旧好隔良缘。。',
    '秾艳一枝细看取，芳心千重似束。。',
    '相见争如不见，有情何似无情。。',
    '身无彩凤双飞翼，心有灵犀一点通。。',
    '夫死战场子在腹，妾身虽存如昼烛。。',
    '情人怨遥夜，竟夕起相思。。',
    '同穴窅冥何所望，他生缘会更难期。。',
    '今夕何夕，见此良人。。',
    '怕相思，已相思，轮到相思没处辞，眉间露一丝。。',
    '夜长争得薄情知，春初早被相思染。。',
    '两鬓可怜青，只为相思老。。',
    '恨君却似江楼月，暂满还亏，暂满还亏，待得团圆是几时?。',
    '可怜无定河边骨，犹是春闺梦里人!',
    '在天愿作比翼鸟，在地愿为连理枝。',
    '玲珑骰子安红豆，入骨相思知不知。',
    '忆君心似西江水，日夜东流无歇时。',
    '一场寂寞凭谁诉。算前言，总轻负。',
    '君宠益娇态，君怜无是非。',
    '春蚕到死丝方尽，蜡炬成灰泪始乾。',
    '君若扬路尘，妾若浊水泥，浮沈各异势，会合何时谐?',
    '相思只在：丁香枝上，豆蔻梢头。',
    '还君明珠双泪垂，恨不相逢未嫁时。',
    '鱼沈雁杳天涯路，始信人间别离苦。',
    '可怜闺里月，长在汉家营。',
    '月色入高楼，相思两处愁。',
    '山远天高烟水寒，相思枫叶丹。',
    '春心莫共花争发，一寸相思一寸灰。',
    '四月十七，正是去年今日，别君时。',
    '相思树底说相思，思郎恨郎郎不知。',
    '终日望君君不至，举头闻鹊喜。',
    '深知身在情长在，怅望江头江水声。'


  ],
  //添加匹配记录 
  addMatch: function(match, callback) {
    db.collection('match').add({
      data: match
    }).then(res => {
      // 在返回结果中会包含新创建的记录的 _id
      console.log('[数据库] [添加匹配记录] 成功，记录 _id: ', res._id)
      callback(res._id);
    }).catch(err => {
      console.error('[数据库] [添加匹配记录] 失败：', err)
    });
  },

  //修改匹配记录
  updateMatch: function(match, callback) {
    // console.log("update score:", score);
    db.collection('match').doc(match._id).update({
      data: match
    }).then(res => {
      console.log('[数据库] [修改匹配记录]，result: ', res.stats.updated)
      callback(res.stats.updated);
    }).catch(err => {
      console.error('[数据库] [修改分值] 失败：', err)
    });
  },

  //查询匹配记录
  findMatchByQuery: function(query, callback) {
    db.collection('match').where(query).get().then(res => {
      console.log('[数据库] [查询匹配记录] 成功: ', query, res);
      callback(res.data);
    }).catch(err => {
      console.error('[数据库] [查询匹配记录] 失败：', query, err)
    });
  },

  //根据ScoreId查询匹配记录
  findMatchByScoreId: function(scoreId, callback) {
    db.collection('match').where(_.or([{
        score1: {
          _id: scoreId
        }
      },
      {
        score2: {
          _id: scoreId
        }
      }
    ])).get().then(res => {
      console.log('[数据库] [根据ScoreId查询匹配记录] 成功: ', res);
      callback(res.data);
    }).catch(err => {
      console.error('[数据库] [根据ScoreId查询匹配记录] 失败：', err)
    });
  },

  //我的匹配 - 互相倾慕，根据userId查询匹配记录,按照时间倒序
  findMatchByUserId: function(userId, start, count, callback) {
    // 互相倾慕
    var dbQuery = db.collection('match').where(_.or([{
        score1: {
          user: {
            _id: userId
          }
        }
      },
      {
        score2: {
          user: {
            _id: userId
          }
        }
      }
    ])).orderBy('createTime', 'desc');
    if (start > 0) {
      dbQuery = dbQuery.skip(start);
    }
    dbQuery.limit(count).get().then(res => {
      console.log('[数据库] [查询互相倾慕] 成功: ', res);
      callback(res.data);
    }).catch(err => {
      console.error('[数据库] [查询互相倾慕] 失败：', err)
    });
  },


  //删除匹配记录
  delMatchByScoreId: function(scoreId, callback) {
    db.collection('match').where(_.or([{
        score1: {
          _id: scoreId
        }
      },
      {
        score2: {
          _id: scoreId
        }
      }
    ])).get().then(res => {
      console.log('[数据库] [根据ScoreId查询匹配记录] 成功: ', res);
      var matchList = res.data;
      if (matchList.length > 0) {
        //查询到记录, 删除所有查询的记录
        var length = matchList.length;
        for (var i = 0; i < length; i++) {
          this.removeMatchById(matchList[i]._id);
        }
      }
      callback(matchList);
    }).catch(err => {
      console.error('[数据库] [根据ScoreId查询匹配记录] 失败：', err)
    });
  },

  //根据id删除匹配记录
  removeMatchById: function(matchId, callback) {
    db.collection('match').doc(matchId).remove().then(res => {
      console.log('[数据库] [根据id删除匹配记录] 成功: ', res);
      callback(res.stats.removed);
    }).catch(err => {
      console.error('[数据库] [根据id删除匹配记录] 失败：', err)
    });
  }


}