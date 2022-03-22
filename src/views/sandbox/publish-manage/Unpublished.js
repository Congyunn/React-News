import React from 'react'
import { Button } from 'antd';

import NewsPublish from '../../../components/publish-manage/NewsPublish';
import usePublish from '../../../components/publish-manage/usePublish';

export default function Unpublished() {

  //1===未发布
  const {dataSource,handlePubish} = usePublish(1)
  //console.log(dataSource);

  return (
    <div>
        <NewsPublish dataSource={dataSource}
         button={(id)=><Button type="primary" onClick={()=>handlePubish(id)}>
          发布
        </Button>}></NewsPublish>
    </div>
  )
}
