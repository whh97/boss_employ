/* 
    注册路由组件
*/

import React from "react";
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Radio,
  Button,
} from "antd-mobile";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import Logo from "../../components/logo/logo";
import { register } from "../../redux/actions";

const ListItem = List.Item;
class Register extends React.Component {
  state = {
    username: "", //用户名
    password: "", // 密码
    password2: "", // 确认密码
    type: "laoban", // 用户类型
  };

  // 点击注册调用
  register = () => {
    // console.log(this.state);
    // 不需要传入password2,
    this.props.register(this.state);
  };

  handleChange = (name, value) => {
    // 更新状态,要用[name]，这样才会作为变量，否则就会直接去查找state中的name属性，而state中没有name属性
    this.setState({ [name]: value });
  };

  toLogin = () => {
    // 已有账户，则进入登录界面
    this.props.history.replace("/login");
  };

  render() {
    const { type } = this.state;
    const { msg, redirectTo } = this.props.user;

    // 如果它有值，则需要它重定向到指定的路由
    if (redirectTo) {
      return <Redirect to={redirectTo} />;
    }
    return (
      <div>
        <NavBar>硅&nbsp;谷&nbsp;直&nbsp;聘</NavBar>
        <Logo></Logo>
        {/* WingBlank表示两边留白  WhiteSpace表示上下留白 */}
        <WingBlank>
          <List>
            {msg ? <div className="error-msg">{msg}</div> : null}
            <WhiteSpace />
            <InputItem
              placeholder="请输入用户名"
              onChange={(value) => {
                this.handleChange("username", value);
              }}
            >
              用户名：
            </InputItem>
            <WhiteSpace />
            <InputItem
              placeholder="请输入密码"
              type="password"
              onChange={(value) => {
                this.handleChange("password", value);
              }}
            >
              密&nbsp;&nbsp;&nbsp;码：
            </InputItem>
            <WhiteSpace />
            <InputItem
              placeholder="请再次输入密码进行确认"
              type="password"
              onChange={(value) => {
                this.handleChange("password2", value);
              }}
            >
              确认密码：
            </InputItem>
            <ListItem>
              <span>用户类型：</span>&nbsp;&nbsp;&nbsp;
              <Radio
                checkd={type === "dashen"}
                onChange={() => this.handleChange("type", "dashen")}
              >
                大神
              </Radio>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Radio
                checkd={type === "laoban"}
                onChange={() => this.handleChange("type", "laoban")}
              >
                老板
              </Radio>
            </ListItem>
            <Button type="primary" onClick={this.register}>
              注&nbsp;&nbsp;&nbsp;册
            </Button>
            <Button onClick={this.toLogin}>已有账户</Button>
          </List>
        </WingBlank>
      </div>
    );
  }
}

export default connect((state) => ({ user: state.user }), { register })(
  Register
);
