import React, {useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined, AlignLeftOutlined } from '@ant-design/icons'

import axios from 'axios'

const {confirm} = Modal

export default function RoleList() {
  
  const [dataSource, setdataSource] = useState([])
  const [isModalVisible, setisModalVisible] = useState(false);
  const [rightList, setRightList] = useState([]);
  const [currentId, setcurrentId] = useState(0);
  const [currentRights, setcurrentRights] = useState([]);
  const columns = [
    {
      title: '权限ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined />}
            onClick={() => confirmMethod(item)}></Button>&nbsp;&nbsp;
          <Button type='primary' shape='circle' 
              icon={<AlignLeftOutlined />} onClick={()=>{
                setisModalVisible(true)
                setcurrentRights(item.rights)
                setcurrentId(item.id)
              }} ></Button>
        </div>
      }
    },
  ]

  useEffect(() => {
    axios.get("/roles").then(res=>{
      setdataSource(res.data)
    })
  }, [])

  useEffect(()=>{
    axios.get("/rights?_embed=children").then(
      res => {
        setRightList(res.data)
      }
    )
  },[])

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
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/roles/${item.id}`)

  }

  const handleOk = ()=>{
    setisModalVisible(false)
    setdataSource(dataSource.map(item=>{
      if(item.id===currentId){
        return {
          ...item,
          rights:currentRights
        }
      }
      return item
    }))

    axios.patch(`/roles/${currentId}`,{
      rights:currentRights
    })
  }

  const handleCancel = ()=>{
    setisModalVisible(false)
  }

  const onCheck = (checkKeys)=>{
    setcurrentRights(checkKeys.checked)
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
      rowKey={(item)=>item.id} ></Table>

      <Modal title="权限分配" visible={isModalVisible} 
        onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          treeData={rightList} //树形结构的数据（带children）
          checkedKeys={currentRights} //目前有哪个权限被选了
          onCheck={onCheck} //设置哪个权限选了
          checkStrictly={true}  //可以设置一级点了，二级没有全点
          />
      </Modal>
    </div>
  )
}
