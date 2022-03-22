import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import Home from '../../views/sandbox/home/Home'
import UserList from '../../views/sandbox/user-manage/UserList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import RightList from '../../views/sandbox/right-manage/RightList'
import NoPermission from '../../views/sandbox/nopermission/NoPermission'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'


const LocalRouterMap = {
    '/home': <Home />,

    '/user-manage/list': <UserList />,

    '/right-manage/role/list': <RoleList />,
    '/right-manage/right/list': <RightList />,

    '/news-manage/add': <NewsAdd />,
    '/news-manage/draft': <NewsDraft />,
    '/news-manage/category': <NewsCategory />,
    '/news-manage/preview/:id': <NewsPreview />,
    '/news-manage/update/:id': <NewsUpdate />,

    '/audit-manage/audit': <Audit />,
    '/audit-manage/list': <AuditList />,

    '/publish-manage/unpublished': <Unpublished />,
    '/publish-manage/published': <Published />,
    '/publish-manage/sunset': <Sunset />

}

function NewsRouter(props) {

    const [backRouteList, setbackRouteList] = useState([]);
    useEffect(() => {
        Promise.all([
            axios.get('/rights'),
            axios.get('/children')
        ]).then(
            res => {
                //console.log(res);
                setbackRouteList([...res[0].data, ...res[1].data])  //权限数据扁平化

            }
        )
    }, []);

    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))

    const checkRoute = (item) => {
        //权限列表中删掉了或者配置不可用
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }

    const checkUserPermisson = (item) => {
        //当前登录的用户角色是否包含这个权限
        return rights.includes(item.key)
    }

    return (
        <Spin size="large" spinning={props.isLoading} >
            <Routes>
                {
                    backRouteList.map(item => {
                        if (checkRoute(item) && checkUserPermisson(item)) {  //判断路由开关和这个用户的权限能不能路由
                            return <Route path={item.key} key={item.key}
                                element={LocalRouterMap[item.key]} />
                        }
                        return null
                    }
                    )
                }
                <Route path='/' element={<Navigate to='/home' />} />
                {
                    backRouteList.length > 0 &&
                    <Route path='*' element={<NoPermission />} />
                }
            </Routes>
        </Spin>
    )
}

const mapStateToProps = ({LoadingReducer:{isLoading}})=>{
    return {
      isLoading
    }
  }

export default connect(mapStateToProps)(NewsRouter)
