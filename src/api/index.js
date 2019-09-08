/**
 * 包含应用中所有请求接口的函数：接口请求函数
 * 
 */
import jsonp from 'jsonp'//axios不能发jsonp请求
import ajax from './ajax'
import { message } from 'antd';

const BASE ='';

//请求登录
//大括号没有return的作用
export const reqLogin = (username,password) => ajax.post(BASE+'/login',{username,password})


  /* return ajax({
    method:'post',
    url:BASE+'/login',
    data:{//默认使用json格式的请求体携带参数
      username,
      password
    }
  })
}
const name ='admin'
const pwd ='pwd'
reqLogin(name,pwd).then(result =>{
  console.log('请求成功了',result);
  
},error =>{
  alert('请求失败了'+error.message)
})  */


//发送 jsonp请求获取天气信息
export const reqWeather = (city) =>{
  //执行器函数：内部去执行异步任务
  //成功了调用resolve(),失败了不调用reject()，直接提示错误
  return new Promise((resolve,reject)=>{
    const url =`http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    jsonp(url,{},(error,data) =>{
      if(!error && data.error ===0){
        const {dayPictureUrl,weather} =data.results[0].weather_data[0]
        resolve({dayPictureUrl,weather})
      }else{//并没有调用reject来处理异常，所以在外面.then()没有用
        message.error('获取天气信息失败')
      }
    })
  }
)}
  