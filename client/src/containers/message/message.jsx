/* 消息列表界面的路由组件 */
import React from "react";
import { connect } from "react-redux";
import { List, Badge } from "antd-mobile";
import QueueAnim from "rc-queue-anim";

const Item = List.Item;
const Brief = Item.Brief;

function getLastMsgs(chatMsgs, userId) {
  // 1 找到每个聊天的lastMsg,并用一个容器对象来保存{chat_id,lastMsg}
  const lastMsgObjs = {};
  chatMsgs.forEach((msg) => {
    // 对msg进行统计
    if (msg.to === userId && !msg.read) {
      // 如果消息是发给我的并且消息显示未读，则将msg的unReadCOunt设置为1
      msg.unReadCount = 1;
    } else {
      msg.unReadCount = 0;
    }

    // 得到msg的聊天id  谁给谁发的消息  fromid_toid
    const chatId = msg.chat_id;
    // 获取已保存的当前组件的lastMsg
    const lastMsg = lastMsgObjs[chatId];
    if (!lastMsg) {
      // 没有则说明当前msg就是所在组的lastMsg
      lastMsgObjs[chatId] = msg;
    } else {
      // 累加unReadCount
      const unReadCount = lastMsg.unReadCount + msg.unReadCount;
      // 如果msg比lastmsg晚，就将msg保存为lastmsg
      if (msg.create_time > lastMsg.create_time) {
        lastMsgObjs[chatId] = msg;
      }
      // 保存在最新的lastMsg上   最后一条消息还保存了当前的未读消息总数
      lastMsgObjs[chatId].unReadCount = unReadCount;
    }
  });
  // console.log(lastMsgObjs);   {chat_id:msg}
  // 得到所有的lastMsg的数组,将对象形式转换为数组形式
  const lastMsgs = Object.values(lastMsgObjs);
  // console.log(lastMsgs);  [msg,...]
  // 排序(按照create_time)降序排列
  lastMsgs.sort(function (m1, m2) {
    // 结果小于0，则m1在前
    return m2.create_time - m1.create_time;
  });
  return lastMsgs;
}

class Message extends React.Component {
  render() {
    const { user } = this.props;
    const { users, chatMsgs } = this.props.chat;
    // 对chatMsgs使用chat_id进行分组
    console.log(111111111111111111);

    const lastMsgs = getLastMsgs(chatMsgs, user._id);
    console.log(lastMsgs);
    // debugger;
    return (
      <div>
        {/* 设置上下外边距       我们在这个界面只需要显示聊天的最后一条消息即可 */}
        <List style={{ marginTop: 50, marginBottom: 50 }}>
          <QueueAnim type="scaleX">
            {lastMsgs.map((msg) => {
              // 得到目标用户的id
              const targetUserId = msg.to === user._id ? msg.from : msg.to;
              const targetUser = users[targetUserId];
              const unReadCount = msg.unReadCount;
              console.log("unReadCount", unReadCount);
              return (
                <Item
                  key={msg._id}
                  extra={<Badge text={unReadCount} />} // 未读消息数量
                  thumb={
                    targetUser.header
                      ? require(`../../assets/images/${targetUser.header}.png`)
                      : null
                  } // 头像
                  arrow="horizontal"
                  onClick={() =>
                    this.props.history.push(`/chat/${targetUserId}`)
                  }
                >
                  {msg.content}
                  <Brief>{targetUser.username}</Brief>
                </Item>
              );
            })}
          </QueueAnim>
        </List>
      </div>
    );
  }
}
export default connect(
  (state) => ({ user: state.user, chat: state.chat }),
  {}
)(Message);
