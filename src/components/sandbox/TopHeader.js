import React from 'react'
import { useNavigate } from 'react-router-dom'

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import { connect } from 'react-redux';

const { Header } = Layout;

function TopHeader(props) {
  //console.log(props)
  //const [collapsed, setCollapsed] = useState(false);
  const changeCollapsed = () => {
    //改变props.isCollapsed
    //console.log(props);
    props.changeCollapsed() //父组件(connect)帮着dispatch给store
  }

  let navigate = useNavigate()
  const {role:{roleName},username} = JSON.parse(localStorage.getItem("token"))
  
  const menu = (
    <Menu>
      <Menu.Item>
        {roleName}
      </Menu.Item>
      <Menu.Item danger onClick={()=>{
        localStorage.removeItem("token")
        navigate("/login")
      }}>退出登录</Menu.Item>
    </Menu>
  );

  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {
        props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} />
          : <MenuFoldOutlined onClick={changeCollapsed} />
      }

      <div style={{ float: "right" }} >
        <span>欢迎&nbsp;<span style={{color:"#1809ff"}}>{username}</span>&nbsp;回来</span>
        <Dropdown overlay={menu}>
          <span><Avatar size="large" icon={<UserOutlined />} /></span>
        </Dropdown>
      </div>
    </Header>
  )
}

const mapStateToProps = ({CollApsedReducer:{isCollapsed}})=>{
  return {
    isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed(){
    return {
      type:"change_collapsed",
      //payload
    } //action
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(TopHeader)
