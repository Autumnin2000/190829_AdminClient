import React, { Component } from 'react'
import {Card,Icon,List} from 'antd'
import {Redirect} from 'react-router-dom'
import LinkButton  from '../../components/link-button'
import './product.less'
import memoryUtils from '../../utils/memoryUtils'
import {reqCategory} from '../../api'
import { BASE_IMG } from '../../utils/constants'
const Item = List.Item

export default class Detail extends Component {

  state={
    categoryName:''
  }
  getCategory = async (categoryId) =>{
    const result = await reqCategory (categoryId)
    if(result.status ===0){
      const categoryName = result.data.name
      this.setState({categoryName})
    }
  }
  componentDidMount(){
    const product =memoryUtils.product
    this.getCategory(product.categoryId)
  }
  render() {
    const {categoryName} =this.state
    const product =memoryUtils.product
    if(!product || !product._id){
      return <Redirect to="/product" />
    }
    const title = (
      <span>
        <LinkButton onClick={()=>this.props.history.goBack()}>
          <Icon type="arrow-left" />
        </LinkButton>
        <span>商品详情</span>
      </span>
    )
    return (
     <Card title={title} className="detail">
      <List>
        <Item>
          <span className="detail-left">商品名称:</span>
          <span>{product.name}</span>
        </Item>
        <Item>
          <span className="detail-left">商品描述:</span>
          <span>{product.desc}</span>
        </Item>
        <Item>
          <span className="detail-left">商品价格:</span>
          <span>{product.price}</span>
        </Item>
        <Item>
          <span className="detail-left">所属分类:</span>
          <span>{categoryName}</span>
          </Item>
          <Item >
          <span className="detail-left">商品图片:</span>
          <span>
           {
             product.imgs.map(img =><img className="detail-img" key={img} src={BASE_IMG+img} alt="img"/>)
           }
          </span>
        </Item>
        <Item>
        <span className="detail-left">商品详情:</span>
        <div dangerouslySetInnerHTML={{__html:product.detail}}></div>
      </Item>
      </List>
     </Card>
    )
  }
}
