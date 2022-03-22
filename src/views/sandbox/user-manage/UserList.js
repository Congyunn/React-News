import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Modal, Switch } from 'antd'
import axios from 'axios';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import UserForm from '../../../components/user-manage/UserForm';

export default function UserList() {
  const [dataSource, setdataSource] = useState([]);
  const [isAddVisible, setisAddVisible] = useState(false);
  const [roleList, setroleList] = useState([]);
  const [region, setregion] = useState([]);
  const [isUpdateVisible, setisUpdateVisible] = useState(false);
  const [isUpdateDisable, setisUpdateDisable] = useState(false);
  const [current, setcurrent] = useState(null);

  const addForm = useRef(null)
  const updateForm = useRef(null)

  const { confirm } = Modal

  const {roleId,region:regionId,username} = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios.get('/users?_expand=role').then(
      res => {
        const list = res.data
        setdataSource(roleId===1?list:[
          ...list.filter(item=>item.username===username),
          ...list.filter(item=>item.region===regionId && 
            item.roleId===3)
        ])
      }
    )
  }, [roleId,regionId,username])

  useEffect(() => {
    axios.get('/regions').then(
      res => {
        const list = res.data
        setregion(list)
      }
    )
  }, [])

  useEffect(() => {
    axios.get('/roles').then(
      res => {
        const list = res.data
        setroleList(list)
      }
    )
  }, [])

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters:[
        ...region.map(item=>({  //做筛选功能，将region列表的key值转换为antd table筛选所需的text和value字段
          text:item.title,
          value:item.value
        })),
        {
          text:"全球",
          value:""
        }
      ],

      onFilter:(value,item)=>item.region===value, //筛选，将所有region为value的item显示出来
      render: (region) => {
        return <b>{region === "" ? '全球' : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState}
          disabled={item.default} onChange={()=>handleChange(item)}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined />}
            onClick={() => confirmMethod(item)} disabled={item.default}></Button>&nbsp;&nbsp;
          <Button type='primary' shape='circle'
            icon={<EditOutlined />} disabled={item.default}
            onClick={()=>{handleUpdate(item)}}></Button>

        </div>
      }
    }
  ]

  const confirmMethod = (item) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: '你确定要删除吗？',
      onOk() {
        deleteMethod(item)
      },
      onCancel() {

      },
    })
  }

  const deleteMethod = (item) => {
    //当前页面同步状态+后端同步
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/users/${item.id}`)
    
  }

  const addFormOk = () => {
    //console.log("add",addForm)
    addForm.current.validateFields().then(
      value => {
        //console.log(value)
        setisAddVisible(false)

        addForm.current.resetFields() //重置表单

        axios.post(`/users`, {
          ...value,
          "roleState": true,
          "default": false
        }).then(
          res => {
            //console.log(res.data);
            setdataSource([...dataSource,{
              ...res.data,
              role:roleList.filter(item=>item.id===value.roleId)[0]
            }])
          }
        ).catch(
          err => {
            console.log(err);
          }
        )
      })
  }

  const updateFormOk = ()=>{
    updateForm.current.validateFields().then(
      value => {
        //console.log(value)
        setisUpdateVisible(false)

        setdataSource(dataSource.map(item=>{
          if(item.id===current.id){
            return{
              ...item,
              ...value,
              role:roleList.filter(data=>data.id===value.roleId)[0]
            }
          }
          return item
        }))
        setisUpdateDisable(!isUpdateDisable)

        axios.patch(`/users/${current.id}`
          ,value)
      })
  }

  const handleChange = (item)=>{
    //console.log(roleState)
    item.roleState = !item.roleState
    setdataSource([...dataSource])

    axios.patch(`/users/${item.id}`,{
      roleState:item.roleState
    })
  }

  const handleUpdate = (item)=>{
    setTimeout(()=>{
      setisUpdateVisible(true)

      if(item.roleId===1){
        //禁改区域
        setisUpdateDisable(true)
      }else{
        setisUpdateDisable(false)
      }
      updateForm.current.setFieldsValue(item)
    },0)

    setcurrent(item)
  }


  return (
    <div>
      <Button type='primary' onClick={() => {
        setisAddVisible(true)
      }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5
        }}
        rowKey={item => item.id} />

      <Modal
        visible={isAddVisible}
        title="添加一个用户"
        okText="添加"
        cancelText="取消"
        onCancel={() => {
          setisAddVisible(false)
        }}
        onOk={() => { addFormOk() }}
      >
        <UserForm region={region}
          roleList={roleList}
          ref={addForm}></UserForm>
      </Modal>

      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setisUpdateVisible(false)
          setisUpdateDisable(!isUpdateDisable)
        }}
        onOk={() => { updateFormOk() }}
      >
        <UserForm region={region}
          roleList={roleList}
          isUpdateDisable={isUpdateDisable}
          ref={updateForm}
          isUpdate={true}></UserForm>
      </Modal>
    </div>
  )
}
