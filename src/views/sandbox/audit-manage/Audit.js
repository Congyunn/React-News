import React,{useState, useEffect} from 'react'
import { Table, Button, notification } from 'antd';
import axios from 'axios'

export default function Audit() {

  const [dataSource, setdataSource] = useState([]);
  const {roleId,region:regionId} = JSON.parse(localStorage.getItem("token"))

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
      title: '操作',
      render: (item) => {
        return <div>
          {
            //通过
            <Button type="primary" onClick={()=>handleAudit(item,2,1)}>通过</Button>
          }
          {
            //拒绝
            <Button danger onClick={()=>handleAudit(item,3,0)}>驳回</Button>
          }
        </div>
      }
    }
  ]
  
  useEffect(() => {
    axios.get(`/news?auditState=1&_expand=category`).then(
      res => {
        const list = res.data
        setdataSource(roleId===1?list:[
          //...list.filter(item=>item.author===username),
          ...list.filter(item=>item.region===regionId && 
            item.roleId===3)
        ])
      }
    )
  }, []);

  const handleAudit = (item,auditState,publishState) => {
    setdataSource(dataSource.filter(data=>data.id!==item.id))

    axios.patch(`/news/${item.id}`,{
      auditState,
      publishState
    }).then(
      res => {
        notification.info({
          message: `操作成功`,
          description: auditState===2?`审核通过！`:`审核驳回！`,
          placement: "bottomRight",
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
        rowKey={item => item.key}
      />
    </div>
  )
}
