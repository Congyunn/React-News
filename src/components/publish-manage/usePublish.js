import axios from 'axios';
import { useEffect, useState } from 'react'
import { notification } from 'antd';

export default function usePublish(type) {

    const { username } = JSON.parse(localStorage.getItem("token"))

    const [dataSource, setdataSource] = useState([]);

    useEffect(() => {
        //console.log(`/news?author=${username}&publishState=${type}&_expand=category`);
        axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(
            res => {
                setdataSource(res.data)
            }
        )
    }, [username, type]);
    //console.log(dataSource);

    const handlePublish = (id) => {
        // console.log(id);
        setdataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`/news/${id}`, {
            "publishState": 2,
            "publishTime": Date.now()
        }).then(
            res => {
                notification.info({
                    message: `操作成功`,
                    description: '已发布该新闻，请到已发布列表中查看！',
                    placement: "bottomRight",
                })
            }
        )
    }


    const handleSunset = (id) => {
        // console.log(id);
        setdataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`/news/${id}`, {
            "publishState": 3
        }).then(
            res => {
                notification.info({
                    message: `操作成功`,
                    description: '已下线该新闻，请到已下线列表中查看！',
                    placement: "bottomRight",
                })
            }
        )
    }

    const handleDelete = (id) => {
        // console.log(id);
        setdataSource(dataSource.filter(item => item.id !== id))
        axios.delete(`/news/${id}`).then(
            res => {
                notification.info({
                    message: `操作成功`,
                    description: '已删除该新闻！',
                    placement: "bottomRight",
                })
            }
        )
    }

    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}