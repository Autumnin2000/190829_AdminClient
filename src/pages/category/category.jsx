import React, { Component } from 'react'
import { Card ,Table, Button, Icon, Modal, message} from 'antd'
import LinkButton from '../../components/link-button'
import AddUpdateForm from './add-update-form'
import { reqCategorys, reqAddCategorys,reqUpdateCategory } from '../../api'
/**
 * 分类管理
 */




export default class Category extends Component {
  
  state = {
    categorys:[],
    loading:false,//是否正在加载中
    showStatus:0//0:不显示,1：显示添加,2:显示修改
  }

  /**
   * 点击确定的回调：去添加/修改分类
   */
  handleOk = () =>{
    // 进行表单验证
    this.form.validateFields(async (err,values) =>{
      if(!err){
        this.form.resetFields()//重置输入数据（变成了初始值,相当于你没有输入）

        const {categoryName } =values

        //NOTE:const是块级作用域，外面的result是看不到里面的result的
        // 而const必须在声明时初始化，所以用let
        let result
        const {showStatus}=this.state
        if(showStatus === 1){
          //发送添加分类的请求
           result = await reqAddCategorys(categoryName)
        }else{//修改
          //TODO:
          const categoryId =this.category._id
          result = reqUpdateCategory({categoryId,categoryName})
        }
        
        this.setState({
          showStatus:0
        })
        const action = showStatus ===1? '添加':'修改'
        if(result.status === 0){
          this.getCategorys()
          message.success(action+'成功')
        }else{
          message.error(action+'失败')
        }
      }
    })
    //发送添加分类的请求
    
  }
  /**
   * 点击取消的回调
   */
  handleCancel = () =>{
    this.form.resetFields()
    this.setState({
      showStatus:0
    })
  }
  /**
   * 异步获取分类列表显示
   */
  getCategorys = async () =>{
    //显示loading
    this.setState({loading:true})
    // 发送ajax请求
    const result = await reqCategorys()
    // 一旦有了结果，无论成功还是失败，都要隐藏
    this.setState({loading:false})
    if(result.status === 0){
      const categorys = result.data
      this.setState({
        categorys
      })
    }else{
      message.error('获取分类失败')
    }
  }
  /**
   * 因为只是要第一次渲染，没有必要放到render里面去
   * 一般不会在生命周期函数内写太多的代码
   */
  initColums = () =>{
    this.columns = [
      {
        title: '分类的名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        width:300,
        render:(category)=><LinkButton
          onClick={()=>{
            this.category =category //保存当前分类，其它地方都可以读取到
            this.setState({showStatus:2})}}
        >修改分类</LinkButton>,
        key: 'age',
      },
     
    ];
  } 

 

  UNSAFE_componentWillMount(){
    this.initColums()
  }
  componentDidMount(){
    this.getCategorys()
  }
  render() {
    const {showStatus ,loading}= this.state

    /**NOTE:
     * 读取更新的分类名称
     * 但是它可能有也可能没有
     * 为了避免报错
     */
    const category = this.category || {}
    const extra = (
      <Button type="primary" onClick={() =>{
        this.category ={}//null也行，前面已经做了统一的处理了
        this.setState({showStatus :1})}}>
        <Icon type="plus" />添加
      </Button>
    )
    return (
      <Card extra={extra}>
        <Table 
          bordered={true}
          rowKey="_id"
          columns={this.columns}
          loading={loading}
          dataSource={this.state.categorys}
          pagination={{defaultPageSize:6,showQuickJumper:true}}
        />
        <Modal
          title={showStatus ===1 ? "添加分类":"修改分类"}
          visible={showStatus!==0}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
        {/**
          想拿到子组件的数据，函数属性！
          向下面这个组件传递一个能够接受form的函数
        */}
        <AddUpdateForm setForm={form => this.form =form } categoryName ={category.name}

        />
        </Modal>
      </Card>
    )
  }
}
