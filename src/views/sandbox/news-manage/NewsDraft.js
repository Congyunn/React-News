import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal } from 'antd'
import axios from 'axios';
import { UploadOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { notification } from 'antd';

export default function NewsDraft() {
  const [dataSource, setdataSource] = useState([]);
  const { confirm } = Modal
  let navigate = useNavigate()

  const { username } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(
      res => {
        const list = res.data
        setdataSource(list)
      }
    )
  }, [username])

  const columns = [
    {
      title: '新闻ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render:(title,item)=>{
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined />}
            onClick={() => confirmMethod(item)}></Button>&nbsp;&nbsp;
          <Button shape='circle'
            icon={<EditOutlined />}
            onClick={()=>{
              //navigate('/news-manage/update/:'+item.id)
              navigate(`/news-manage/update/:${item.id}`)
            }} ></Button>&nbsp;&nbsp;
          <Button type='primary' shape='circle'
            icon={<UploadOutlined />}
            onClick={()=>handleCheck(item.id)} ></Button>

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
        //window.location.reload()
      },
      onCancel() {

      },
    })
  }

  const deleteMethod = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/news/${item.id}`)
  }

  const handleCheck = (id)=>{
    axios.patch(`/news/${id}`,{
      auditState:1
    }).then(
      res=>{
        navigate('/audit-manage/list')
        notification.info({
          message: `操作成功`,
          description: '已提交审核，请耐心等待！',
          placement:"bottomRight",
        })
      }
    )
  }

  return (

    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5
        }} 
        rowKey={item=>item.id}
        />

    </div>
  )
}
