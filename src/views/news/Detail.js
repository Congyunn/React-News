import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions, notification } from 'antd'
import { HeartTwoTone } from '@ant-design/icons';

import { useLocation } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';

export default function Detail() {

    const location = useLocation()
    const [newsInfo, setnewsInfo] = useState(null);
    const [starFlag, setstarFlag] = useState(false);
    //console.log(location.pathname);
    const url = location.pathname.split('/')
    //console.log(url[3]);
    useEffect(() => {
        axios.get(`/news/${url[2]}?_expand=category&_expand=role`).then(
            res => {
                setnewsInfo({
                    ...res.data,
                    view:res.data.view+1
                })
                return res.data
            }
        ).then(
            res=>{
                axios.patch(`/news/${url[2]}`,{
                    view:res.view+1
                })
            }
        )
    }, []);

    const handleStar = ()=>{
        setnewsInfo({
            ...newsInfo,
            star:starFlag===false?newsInfo.star+1:newsInfo.star-1
        })

        notification.info({
            message: `操作成功`,
            description: starFlag===true?`取消点赞成功！`:`点赞成功！`,
            placement: "bottomRight",
          })

        var newFlag = !starFlag
        setstarFlag(newFlag)

        axios.patch(`/news/${url[2]}`,{
            star:starFlag===false?newsInfo.star+1:newsInfo.star-1
        })
    }
    
    return (
        <div>
            {
                newsInfo && <div><PageHeader
                    onBack={() => window.history.back()}
                    title={newsInfo.title}
                    subTitle={<div>
                        {newsInfo.category.title}
                        <HeartTwoTone twoToneColor="#eb2f96" onClick={()=>handleStar()} />
                    </div>}
                >
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="创建者">
                            {newsInfo.author}</Descriptions.Item>
                        <Descriptions.Item label="发布时间">
                            {newsInfo.publishTime ? moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss") : '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label="区域">
                            {newsInfo.region}</Descriptions.Item>
                        <Descriptions.Item label="访问数量" style={{color:'green'}}>
                            {newsInfo.view}</Descriptions.Item>
                        <Descriptions.Item label="点赞数量" style={{color:'red'}}>
                            {newsInfo.star}</Descriptions.Item>
                        <Descriptions.Item label="评论数量">
                            0</Descriptions.Item>
                    </Descriptions>
                </PageHeader>

                    <div dangerouslySetInnerHTML={{
                        __html:newsInfo.content
                    }} style={{
                        margin:'0 24px',
                        border:'1px solid orange'
                    }}>
                    </div>
                </div>
            }
        </div>
    )
}
