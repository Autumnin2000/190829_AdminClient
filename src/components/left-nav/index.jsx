import React, { Component } from 'react'
import {Link,withRouter} from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import './index.less'
import menuList from '../../config/menuConfig';

import { Menu ,Icon,} from 'antd';


const {SubMenu } =Menu
 class LeftNav extends Component {
  

  /**
   * 根据指定menu数据数组生成<Menu.Item>和<SubMenu>的数组
   */
  getMenuNodes = (menuList) =>{
    const path =this.props.location.pathname
    return menuList.map(item =>{
      if(!item.children){
        return(
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      }
      const cItem =item.children.find(cItem =>cItem.key === path)
      if(cItem){
        this.openKey =item.key
      }
      return (
        <SubMenu
         key={item.key}
         title={
           <span>
            <Icon type={item.icon} />
            <span>{item.title}</span>
           </span>
         }
        >
        {
          this.getMenuNodes(item.children)
        }
        </SubMenu>
      )
    })
  
   
  }
  /**
   * 第一次render之后 执行 一次
   * 执行异步任务：发ajax请求，启动定时器
   * componentDidMount(){

  }
   */
  
  /**
   * 第一次render之前执行 一次
   * 为第一次render做一些同步的准备工作
   * 减少重新渲染的时候每次都去重新生成menuNodes
   */
  UNSAFE_componentWillMount(){
    this.menuNodes  =  this.getMenuNodes(menuList)
  }
  render() {
   
    const selectKey =this.props.location.pathname
    
    return (
      <div className="left-nav">
        <Link className="left-nav-link" to="/home">
          <img src={logo} alt="logo"/>
          <h1>硅谷后台</h1>
        </Link>
        <Menu
        selectedKeys={[selectKey]}
        defaultOpenKeys={[this.openKey]}
        mode="inline"
        theme="dark"
        >
        {
          this.menuNodes
        }
        </Menu>
      </div>
    )
  }
}
export default withRouter(LeftNav)
