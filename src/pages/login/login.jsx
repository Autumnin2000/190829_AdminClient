import React, { Component } from 'react'
import {Form,Icon,Button,Input,message} from 'antd'
import {Redirect} from 'react-router-dom'
import {reqLogin} from '../../api'
import storageUtils from '../../utils/storageUtils'
import logo from '../../assets/images/logo.png'
import './login.less'
import memoryUtils from '../../utils/memoryUtils';



 class Login extends Component {
  handleSubmit = e => {
    //阻止事件的默认行为，阻止表单的提交
    e.preventDefault();


    //对表单所有字段进行统一验证
    this.props.form.validateFields(async (err,{username,password})=>{
      if(!err){
      //  alert(`发登录的ajax请求,username=${username}`)
       const result = await reqLogin(username,password)
       //登录成功
       if(result.status ===0){
        //跳转到管理界面
        const user =result.data
        storageUtils.saveUser(user)
        //保存在内存中
        memoryUtils.user =user
        this.props.history.replace('/')//用replace不要让他回来
        message.success('登录成功！')
       }else{
         message.error(result.msg)
       }
      }else{
        
      }
    })
   
  };
  validatePwd =(rule,value,callback) =>{
    value =value.trim()
    if(!value){
      callback('密码必须输入')
    }else if(value.length<4){
      callback('密码不能小于4位')
    }else if(value.length>12){
      callback('密码不能大于12位')
    }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
      callback('密码必须由数字、英字母或下划线组成')
    }else{
      callback() //不传参，表示验证通过
    }

  }
  render() {
    //读取保存的user，如果存在，直接跳转到admin
    const user =memoryUtils.user
    if(user._id){
      return <Redirect to="/" />
    }
    const { getFieldDecorator} = this.props.form;
    return (
      
      <div className="login">
        <div className="login-header">
          <img src={logo} alt="logo"/>
          <h1>后台管理系统</h1>
        </div>
        <div className="login-content">
          <h1>用户登录</h1>
          <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [
                { required: true,whitespace:true, message: '用户名不能为空!' },
                { min:4,message:'用户名最小为4位'},
                {max:12,message:'用户名最大为12位'},
                {pattern:/^[a-zA-Z0-9_]+$/,message:'用户名必须由数字、英字母或下划线组成'}
              ],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="用户名"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              initialValue:'',
              rules: [
                {validator:this.validatePwd}  
              ],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="密码"
              />,
            )}
          </Form.Item>
          <Form.Item>
         
            <Button type="primary" htmlType="submit" className="login-form-button">
              登 录
            </Button>
            
          </Form.Item>
        </Form>
        </div>
      </div>
    )
  }
}

 const WrapperForm  = Form.create()(Login)

 export default WrapperForm;
/**
 * 用户名、密码的合法性要求
 1).必须输入 
 2).必须大于等于4位
 3).必须小于等于12位
 4).必须是英文、数字、或者下划线组成 

 */


/**
 * 组件：本质上是构造函数
 * 组件对象：组件类的实例 ，也就是构造函数的实例
 */
