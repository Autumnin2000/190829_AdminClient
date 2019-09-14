import React, { Component } from 'react'
import {Card,Icon,Form,Input,Select,Button, message} from 'antd'
import LinkButton from '../../components/link-button'
import {reqCategorys,reqAddUpdateProduct} from '../../api'
import PicturesWall from './pictures-wall'
import memoryUtils from '../../utils/memoryUtils'
import RichTextEditor from './rich-text-editor'
const Item =Form.Item
const Option =Select.Option
 class ProductAddUpdate extends Component {
  state={
    categorys:[]
  }

  constructor(props){
    super(props)
    //创建ref容器，并保存到组件对象上
    this.pwRef =React.createRef()
    this.editorRef =React.createRef()
  }
  getCategorys = async () =>{
    const result = await reqCategorys ()
    if(result.status ===0){
      const categorys= result.data
      this.setState({categorys})
    }
  }
  UNSAFE_componentWillMount(){
    this.product =memoryUtils.product
    //判断是否修改
    this.isUpdate = !!this.product._id
  }
  componentDidMount(){
    this.getCategorys()
  }
  /**
   * 对价格进行自定义验证
   */
  validatePrice = (rule,value,cb) =>{
    if(value===''){
      cb()
    }else if(value * 1 <= 0){
      cb('价格必须大于0')
    }else{
      cb()
    }
  }

  /**
   * 处理提交的回调
   */
  handleSubmit = (event) =>{
    event.preventDefault()
    this.props.form.validateFields(async (err,values)=>{
      if(!err){
        const {name ,desc,price,categoryId} =values
        //收集上传的图片名称数组
        const imgs =this.pwRef.current.getImgs()
        //输入的商品的详情的标签字符串
        const detail =this.editorRef.current.getDetail()
        //封装product对象
        const product ={name,desc,price,categoryId,imgs,detail}
        if(this.isUpdate){
          product._id = this.product._id
        }
        //发请求添加或修改
        const result = await reqAddUpdateProduct(product)
        if(result.status ===0){
          message.success(`${this.isUpdate ?'修改':'添加'}商品成功`)
          this.props.history.goBack()
        }else{
          message.error(result.msg)
        }
      }
    })
  }
  render() {
    const {categorys} =this.state
    const {getFieldDecorator} = this.props.form
    const {isUpdate,product} =this
    const title = (
      <span>
        <LinkButton onClick={()=>this.props.history.goBack()}>
          <Icon type="arrow-left" />
        </LinkButton>
        <span>{isUpdate?'修改商品':'添加商品'}</span>
      </span>
    )
    const formLayout = {
      labelCol:{span:2},
      wrapperCol:{span:8}
    }
    return (
      <Card title={title}>
        <Form {...formLayout} onSubmit={this.handleSubmit}>
            <Item label="商品名称">
            {getFieldDecorator('name', {
              initialValue:product.name,
              rules: [
                {
                  required:true,
                  message: '商品名称不能为空'
                }
              ]
            })(<Input placeholder="商品名称" />)}
            </Item>
            <Item label="商品描述">
            {getFieldDecorator('desc', {
              initialValue:product.desc,
              rules: [
                {
                  required:true,
                  message: '商品描述不能为空'
                }
              ]
            })(<Input placeholder="商品描述" />)}
            </Item>
            <Item label="商品价格">
            {getFieldDecorator('price', {
              initialValue:product.price,
              rules: [
                
                  { 
                   required:true,message: '商品价格不能为空'
                  },
                { validator:this.validatePrice}
                
              ]
            })(<Input type="number" placeholder="商品价格" addonAfter="元" />)}
            </Item>
            <Item label="商品分类">
            {getFieldDecorator('categoryId', {
              initialValue:product.categoryId || '',
              rules: [
                {
                  required:true,
                  message: '商品分类不能为空'
                }
              ]
            })(
              <Select>
                <Option value="">未选择</Option>
                {
                  categorys.map(c => <Option value={c._id} key={c._id}>{c.name}</Option>)
                }
              </Select>
            )}
            </Item>
            <Item label="商品图片">
            {/**将容器交给需要标记的标签对象，在解析时会自动把标签对象保存到容器中（属性名为current，属性值为标签对象） */}
                <PicturesWall ref={this.pwRef} imgs={product.imgs}/>
            </Item>
            <Item label="商品详情" wrapperCol={{span:20}} >
                <RichTextEditor ref={this.editorRef} detail ={product.detail} />
            </Item>
            <Item >
                <Button type="primary" htmlType="submit">提交</Button>
            </Item>
        </Form>
      </Card>
    )
  }
}
export default Form.create()(ProductAddUpdate)