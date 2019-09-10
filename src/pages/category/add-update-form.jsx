import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,Input
} from 'antd'
/**
 * 添加或者修改的组件
 */
 const Item =Form.Item
 class AddUpdateForm extends Component {
  /**NOTE:
   * 将函数作为对象使用
   * 加了static，就是等于说是给 AddUpdateForm（函数对象或者说类对象，类就是函数）
   * 没加就等于说是给实例（给组件对象）加
   * 传了个属性要声明接收
   */
  static propTypes ={
    setForm:PropTypes.func.isRequired,
    categoryName:PropTypes.string
  }
  componentWillMount(){
    this.props.setForm(this.props.form)
  }


  render() {
    const { getFieldDecorator } =this.props.form
    const {categoryName} = this.props
    return (
      
      <Form>
        <Item>
          {
            getFieldDecorator('categoryName',{
              initialValue:categoryName || '',
              rules:[
                {required:true,message:'分类名不能为空'}
              ]
            }) (
              <Input type="text" placeholder="请输入分类名称" />
              )
          }
         
        </Item>
      </Form>
    )
  }
}
export default Form.create()(AddUpdateForm)
