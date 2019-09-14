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

//获取分类列表
export const reqCategorys = () => ajax(BASE+'/manage/category/list')
  
/**
 * 添加分类
 */
export const reqAddCategorys = (categoryName) =>ajax.post(BASE+'/manage/category/add',{
  categoryName
})
/**
 * 修改分类
 */
export const reqUpdateCategory = ({categoryId,categoryName}) =>ajax.post(BASE+'/manage/category/update',{
  categoryId,
  categoryName
})
/**
 * 根据分类id获取分类
 */

 export const reqCategory =(categoryId) =>ajax(BASE+'/manage/category/info',{
   params:{
     categoryId
   }
 })
/**
 * 获取商品分类列表
 */
export const reqProducts = (pageNum,pageSize) =>ajax.get(BASE+'/manage/product/list',
{params:{
  pageNum,
  pageSize
  //包含所有query参数的对象
}})
/**
 * 根据Name/desc搜索产品分页列表
 */
export const reqSearchProducts =({
  pageNum,
  pageSize,
  searchName,
  searchType //它的值是'productName'或'productDesc'
}) => ajax(BASE+'/manage/product/search',{
  //method:'GET',
  params:{
    pageNum,
    pageSize,
    [searchType]:searchName
  }
})
/**
 * 对商品进行上架下架处理
 */
export const reqUpdateStatus = (productId,status) =>ajax(BASE+'/manage/product/updateStatus',{
  method:'POST',
  data:{
    productId,
    status
  }
})
/**
 * 删除图片
 */
export const reqDeleteImg  =(name) =>ajax.post(BASE+'/manage/img/delete',{name})

/**添加或者修改商品 */
export const reqAddUpdateProduct = (product) =>ajax.post(
  BASE+'/manage/product/'+(product._id ? 'update' :'add'),
  product
)