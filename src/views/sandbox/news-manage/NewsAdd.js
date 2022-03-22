import React, { useState, useEffect, useRef } from 'react'
import { PageHeader, notification, Steps, Form, Input, Button, Select, message } from 'antd'
import { useNavigate } from 'react-router-dom'

import style from './News.module.css'
import axios from 'axios'

import NewsEditor from '../../../components/news-manage/NewsEditor'

const { Step } = Steps
const { Option } = Select

export default function NewsAdd() {
  let navigate = useNavigate()

  const [current, setcurrent] = useState(0);
  const [categoryList, setcategoryList] = useState([]);
  const [formInfo, setformInfo] = useState({}); //储存标题分类
  const [content, setcontent] = useState(""); //储存主体

  const User = JSON.parse(localStorage.getItem("token"))

  const handleNext = () => {
    if (current === 0) {
      NewsForm.current.validateFields().then(
        res => {
          setformInfo(res)

          setcurrent(current + 1)
        }
      ).catch(err => {
        console.log(err);
      })
    } else {
      if (content === "" || content.trim() === "<p></p>") {
        // console.log(formInfo,content)
        message.err("新闻内容不能为空")
      }
      setcurrent(current + 1)
    }
  }

  const handlePrevious = () => {
    setcurrent(current - 1)
  }

  useEffect(() => {
    axios.get('/categories').then(
      res => {
        setcategoryList(res.data)
      }
    )
  }, [])

  const NewsForm = useRef(null)

  const handleSave = (auditState) => {
    axios.post('/news', {
      ...formInfo,
      'content': content,
      'region': User.region ? User.region : '全球',
      'author': User.username,
      'roleId': User.roleId,
      'auditState': auditState,
      'publishState': 0,
      'createTime': Date.now(),
      'star': 0,
      'view': 0,
      // 'publishTime':0
    }).then(
      res => {
        navigate(auditState === 0 ?
          '/news-manage/draft' : '/audit-manage/list')
        notification.info({
          message: `操作成功`,
          description: 
            `${auditState===0?'已保存到草稿箱！':'已提交审核，请耐心等待！'}`,
          placement:"bottomRight",
        });
      }
    )
  }

  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => null}
        title="撰写新闻"
        subTitle="This is a subtitle"
      />

      <Steps current={current}>
        <Step title="基本信息" description="新闻标题、新闻分类" />
        <Step title="新闻内容" description="新闻主题内容" />
        <Step title="新闻提交" description="保存草稿或提交" />
      </Steps>
      <div style={{ margin: '50px' }}>
        <div className={current === 0 ? '' : style.active}>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            ref={NewsForm}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{ required: true, message: '请输入新闻标题!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{ required: true, message: '请选择新闻分类!' }]}
            >
              <Select>
                {
                  categoryList.map(item => {
                    return <Option value={item.id} key={item.id} >
                      {item.title}</Option>
                  })
                }
              </Select>
            </Form.Item>

          </Form>
        </div>
      </div>
      <div className={current === 1 ? '' : style.active}>
        <NewsEditor getContent={(value) => {
          // console.log(value)
          setcontent(value)
        }}></NewsEditor>
      </div>
      <div className={current === 2 ? '' : style.active}>
        
      </div>

      <div style={{ marginTop: "50px" }}>
        {
          current === 2 && <span>
            <Button type='primary' onClick={() => handleSave(0)} >保存草稿箱</Button>
            <Button danger onClick={() => handleSave(1)}>提交审核</Button>
          </span>
        }
        {
          current < 2 && <Button type='primary' onClick={handleNext}>下一步</Button>
        }
        {
          current > 0 && <Button onClick={handlePrevious}>上一步</Button>
        }
      </div>
    </div>
  )
}
