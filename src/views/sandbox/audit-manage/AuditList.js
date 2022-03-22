import React, { useEffect, useState } from 'react'
import { Table, Button, Tag, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function AuditList() {
  const navigate = useNavigate()

  const [dataSource, setdataSource] = useState([]);

  const { username } = JSON.parse(localStorage.getItem("token"))

  const auditList = ["未审核", "审核中", "已通过", "未通过"]
  const colorList = ["", "orange", "green", "red"]
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
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
        return <div>{category.title}</div>
      }
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {

        return <Tag color={colorList[auditState]}>
          {auditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {
            item.auditState === 1 &&
            <Button type='primary' danger onClick={() => handleRervert(item)}>撤销</Button>
          }
          {
            item.auditState === 2 &&
            <Button style={{ backgroundColor: "green" }} onClick={()=>handlePublish(item)}>发布</Button>
          }
          {
            item.auditState === 3 &&
            <Button type='primary' onClick={()=>handleUpdate(item)}>修改</Button>
          }
        </div>
      }
    }
  ]

  useEffect(() => {
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(
      res => {
        //console.log(res.data)
        setdataSource(res.data)
      }
    )
  }, [username]);

  const handleRervert = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))

    axios.patch(`/news/${item.id}`, {
      auditState: 0
    }).then(
      res => {
        notification.info({
          message: `操作成功`,
          description: '已撤销新闻，请到草稿箱中查看！',
          placement: "bottomRight",
        })
      }
    )
  }

  const handlePublish = (item)=>{
    axios.patch(`/news/${item.id}`,{
      "publishState":2,
      "publishTime":Date.now()
    }).then(
      res=>{
        navigate(`/publish-manage/published`)
        notification.info({
          message: `操作成功`,
          description: '已发布该新闻，请到已发布列表中查看！',
          placement: "bottomRight",
        })
      }
    )
  }

  const handleUpdate = (item)=>{
    navigate(`/news-manage/update/${item.id}`)
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5
        }}
        rowKey={item => item.key}
      />
    </div>
  )
}
