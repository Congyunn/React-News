import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom'
import Login from '../views/login/Login';
import NewsSandBox from '../views/sandbox/NewsSandBox';
import News from '../views/news/News';
import Detail from '../views/news/Detail';

const IndexRouter = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path='/login/*' element={<Login />} />  {/* 多层路由必须在父路由后面加/*否则不会继续匹配 */}
                <Route path='/news/*' element={<News/ >} />
                <Route path='/detail/:id' element={<Detail/ >} />
                <Route path='/*' element={<NewsSandBox />} />
                {/* <Route path="/" element={<Navigate to="/login"/>}></Route> */}
            </Routes>
        </HashRouter>
    );
}

export default IndexRouter;
