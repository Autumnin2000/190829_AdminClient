
import storageUtils from "./storageUtils";

//初始时取一次并保存为user
const user =storageUtils.getUser()
//如果写在下面的话则每次点user的时候都会从storage中取
export default {
  user,//用来存储登录用户的信息，默认没有登录

  //初始值为local中的user
  product:{},//需要查看的商品对象

}