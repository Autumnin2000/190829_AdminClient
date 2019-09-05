/**
 * 包含应用中所有请求接口的函数：接口请求函数
 * 
 */
import ajax from './ajax'

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