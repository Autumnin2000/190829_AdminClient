import React, { Component } from 'react'
import {Modal} from 'antd';
import {withRouter} from 'react-router-dom'
import {reqWeather} from '../../api'
import dayjs from 'dayjs'
import memoryUtils from '../../utils/memoryUtils'
import './index.less'
import storageUtils from '../../utils/storageUtils';
import menuList from '../../config/menuConfig';
import LinkButton from '../link-button';
 class Header extends Component {

  state = {
    currentTime:dayjs().format('YYYY-MM-DD  HH:mm:ss   A'),
    dayPictureUrl:'',
    weather:''
    
  }

  /**
   * 根据当前请求的path得到对应的title
   */
  getTitle =() =>{
    let title =''
    const path =this.props.location.pathname
    menuList.forEach(item=>{
      if(item.key === path){
        title =item.title
      }else if(item.children){
        const cItem =item.children.find(cItem=>cItem.key ===path)
        if(cItem){
          title =cItem.title
        }
      }
    })
    return title
  }

  logout = () =>{
    Modal.confirm({
      title:'你确定要退出登录吗？',
      onOk:()=>{
        console.log("OK");

        storageUtils.removeUser()
        memoryUtils.user ={}
        this.props.history.replace('/login')
      },
      onCancel(){
        console.log('Cancel');
      }

    })
  }

  getWeather = async () =>{
    // 发请求得到数据
    const {dayPictureUrl,weather} = await reqWeather('南京')
    //更新状态
    this.setState({
      dayPictureUrl,
      weather
    })
  }
  componentDidMount(){
   this.setIntervalId= setInterval(() => {
      this.setState({
        currentTime:dayjs().format('YYYY-MM-DD  HH:mm:ss   A') 
      })
    }, 1000);

    //发jsonp请求获取天气信息显示
    this.getWeather()
  }
  componentWillUnmount(){
    clearInterval(this.setIntervalId)
  }
  render() {
    const {currentTime,dayPictureUrl,weather} =this.state
    const user = memoryUtils.user
    //得到当前需要显示的title
    const title =this.getTitle()
    return (
      <div className="header">
        <div className="header-top">
          欢迎，{user.username} &nbsp;&nbsp;
           <LinkButton onClick={this.logout}>退出></LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt="weather"/>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Header)