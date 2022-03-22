import React, { useEffect, useState } from 'react'
import './index.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { connect } from 'react-redux';
import axios from 'axios'

import { Layout, Menu } from 'antd';
import {
  UserOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { SubMenu } = Menu;

const iconList = {
  "/home": <UserOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage": <UserOutlined />,
  "/right-manage/role/list": <UserOutlined />,
  "/right-manage/right/list": <UserOutlined />,
}


function SideMenu(props) {
  let navigate = useNavigate();
  const location = useLocation();
  //const url = location.pathname.split('/')
  //console.log(url);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    axios.get("/rights?_embed=children").then(
      res => {
        //console.log(res.data);
        setMenu(res.data)
      }
    )
  }, [])


  const {role:{rights}} = JSON.parse(localStorage.getItem("token"))
  const checkPagePermission = (item) => {
    return item.pagepermisson && rights.includes(item.key)
  }

  const renderMenu = (menuList) => {
    //console.log(location.pathname)
    return menuList.map(item => {
      if (item.children?.length && checkPagePermission(item)) {
        //console.log("object");
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
          {renderMenu(item.children)}
        </SubMenu>
      }
      return checkPagePermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => {
        //  console.log(props)
        navigate(item.key)
      }}>{item.title}</Menu.Item>
    })
  }
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed} >
      <div style={{ display: 'flex', height: '100%', 'flexDirection': 'column' }}>
        <div className="logo">新闻发布管理系统</div>
        <div style={{ flex: 1, 'overflow': 'auto' }}>
          <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}
             //defaultOpenKeys = { url[1] }
            >
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}

const mapStateToProps = ({CollApsedReducer:{isCollapsed}})=>{
  return {
    isCollapsed
  }
}

export default connect(mapStateToProps)(SideMenu)

