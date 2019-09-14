import React, { Component } from 'react'
import {
  Card,Select,Input,
  Button,Icon,Table, message
} from 'antd'
import {reqProducts, reqSearchProducts,reqUpdateStatus} from '../../api'
import LinkButton from '../../components/link-button'
import {PAGE_SIZE} from '../../utils/constants'
import memoryUtils from '../../utils/memoryUtils'
const Option =Select.Option
/**
 * 商品管理
 */
export default class Product extends Component {
  
  state= {
    loading:false,
    products:[],
    tatal:0,//商品总数量
    searchType:'productName',//默认是按商品名称搜索
    searchName:''//搜索的关键字

  }
  updateStatus = async (productId,status) =>{
    //计算更新后的值
    status = status===1 ? 2 :1
    //请求更新
    const result = await reqUpdateStatus(productId,status)
    if(result.status ===0){
      message.success('更新状态成功')
      //获取当前页 显示
      this.getProducts(this.pageNum)
    }

  }
  initColums = () =>{
    this.colums =[
      {
        title:'商品名称',
        dataIndex:'name'
      }, 
      {
        title:'商品描述',
        dataIndex:'desc'
      }, 
      {
        title:'价格',
        dataIndex:'price',
        render:(price) => '￥' +price
      },
      {
        title:'状态',
        width:100,
      //  dataIndex:'status',
        render:({_id,status}) =>{
          let btnText ='下架'
          let text ='在售'
          if(status ===2){
            btnText ='上架'
            text='已下架'
          }
          return (
            <span>
            {/**有些时候在指定回调函数的时候必须指定特定的数据 ，这个时候可以包起来 */}
              <Button type="primary" onClick={() =>{this.updateStatus(_id,status)}}>{btnText}</Button><br />
              <span>{text}</span>
            </span>
          )
        }
      },
      {
        title:'操作',
        render:(product) =>(
          <span>
            <LinkButton 
            onClick={() =>
              {
                //在内存中保存product
                memoryUtils.product =product
                this.props.history.push('/product/detail')}
              }
              >详情
              </LinkButton>
            <LinkButton
            onClick={()=>{
              memoryUtils.product =product
              this.props.history.push('/product/addupdate')
            }}
           >修改</LinkButton>
          </span>
        )
      }

    ]
  }
  /**
   */
  getProducts = async (pageNum)=>{
    //保存当前请求的页码 
    this.pageNum = pageNum
    const {searchName,searchType} =this.state
    let result
    if(!searchName){
        //发送请求
         result =await reqProducts(pageNum,2)
    }else{
       result =await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
    }
  
    if(result.status ===0){
      const {total,list} =result.data
      this.setState({
        products:list,
        total
      })
    }
  }

  UNSAFE_componentWillMount(){
    this.initColums()
  }
  componentDidMount(){
    this.getProducts(1)
  }

  render() {
  
  const {loading,products,total,searchName,searchType} = this.state
  const title = (
     <span>
      <Select 
        style={{width:150}}
        value={searchType}
        onChange={(value)=>this.setState({searchType:value})}>
        <Option value="productName">按名称搜索</Option>
        <Option value="productDesc">按描述搜索</Option>
      </Select>
      <Input 
      style={{width:200,margin:'0 10px'}} 
      placeholder="关键字" 
      value={searchName} 
      onChange={(e)=>this.setState({searchName:e.target.value})}
      
      />
      <Button type="primary" onClick={()=>this.getProducts(1)}>搜索</Button>
     </span>
   )
   const extra =(
     <Button type="primary" 
     onClick={()=>{
       memoryUtils.product ={}
      this.props.history.push('/product/addupdate')
     }}>
      <Icon type="plus" />添加
     </Button>
   )
   return(
     <Card title={title} extra={extra}>
      <Table
        bordered={true}
        rowKey="_id"
        loading={loading}
        columns={this.colums}
        dataSource={products}
        pagination={{
          total,defaultPageSize:2,
          showQuickJumper:true,
          current:this.pageNum,
          onChange:this.getProducts
        }}
       />

      
     </Card>
   )
  }
}
