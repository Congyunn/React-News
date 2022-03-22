import React, { forwardRef, useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd'

const { Option } = Select
const UserForm = forwardRef((props, ref) => {
    const [isDisable, setisDisable] = useState(false);
    //console.log(props);

    useEffect(() => {
        setisDisable(props.isUpdateDisable)
    }, [props.isUpdateDisable])

    const {roleId,region:regionId} = JSON.parse(localStorage.getItem("token"))
    const checkRegionDisable = (item)=>{
        if(props.isUpdate){
            if(roleId===1){
                return false  //如果是超级管理员不禁用改区域
            }else{
                return true
            }
        }else{
            if(roleId===1){
                return false
            }else{
                // console.log(item.value);
                // console.log(regionId);
                return item.value !== regionId
            }
        }
    }
    const checkRoleDisable = (item)=>{
        if(props.isUpdate){
            if(roleId===1){
                return false  //如果是超级管理员不禁用改区域
            }else{
                return true
            }
        }else{
            if(roleId===1){
                return false
            }else{
                // console.log(item.value);
                // console.log(regionId);
                return item.id !== 3
            }
        }
    }

    return (
        <div>
            <Form
                ref={ref}
                layout="vertical"
            >
                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[{ required: true, message: '请输入用户名！' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="密码"
                    rules={[{ required: true, message: '请输入密码！' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="region"
                    label="区域"
                    rules={isDisable ? [] :
                        [{ required: true, message: '请选择区域！' }]}
                >
                    <Select disabled={isDisable}>
                        {
                            props.region.map(item =>
                                <Option value={item.value}
                                    key={item.id}
                                    disabled={checkRegionDisable(item)}>{item.title}</Option>)
                        }
                    </Select>
                </Form.Item>

                <Form.Item
                    name="roleId"
                    label="角色"
                    rules={
                        [{ required: true, message: '请选择角色！' }]}
                >
                    <Select onChange={(value) => {
                        if (value === 1) {
                            setisDisable(true)
                            ref.current.setFieldsValue({
                                region: ""
                            })
                        } else {
                            setisDisable(false)
                        }
                    }}>
                        {
                            props.roleList.map(item =>
                                <Option value={item.id}
                                    key={item.id}
                                    disabled={checkRoleDisable(item)}>{item.roleName}</Option>)
                        }
                    </Select>
                </Form.Item>
            </Form>
        </div>
    )
})
export default UserForm