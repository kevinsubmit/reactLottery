import React, { Component} from 'react';
import {LotteryCommon} from '../components/common';
import GameMmc from '../mmc/game_mmc'
import "./mmc.scss"
class Mmc extends Component {

  constructor(props) {
      super(props);
      this.state = {
      }
  }




    //计算注数，参数cart： 购物车数组
    calcItem(cart){
        //=============计算注数 start=============
        let md = this.props.md;
        if(!md) {
            return null;
        }


        const game = new GameMmc(this.props);
        let zhushu = 0;
        let content=[];
        cart.map((item,i)=>{
            if(item){
                item.sort()//排序
            }
        });
        if(md.name === 'WXDW') {
            md.field_def.map((num,i)=>{
                let data="";
                if(cart[i]){
                    data =cart[i].join('')
                }
                content.push(data);
            });
        } else if(md.cname.indexOf("和值") !== -1) {
            md.field_def.map((num,i)=>{
                let data="";
                if(cart[i]){
                    data += cart[i].join("_")
                }
                content.push(data);
            });
        } else {
            md.field_def.map((num,i)=>{
                let data="";
                if(cart[i]){
                    data += cart[i].join("")
                }
                content.push(data);
            });
        }
        if(content.length === md.field_def.length) {
            zhushu = game.isLegalCode(content, md.name)['singleNum'];
        }
        return {
            content:content,
            zhushu:zhushu,
        };
        //=============计算注数end=============
    }

    //设置购物车
    setCart(i,num,arr,type){
        let cart = this.props.cart;
        let buttonType = this.props.buttonType;
        cart = JSON.parse(JSON.stringify(cart));

        if(num===""){//点击 全单双大小
            cart[i]=arr;
            buttonType = JSON.parse(JSON.stringify(buttonType));
            buttonType[i]=type;
        }else{//点击 单个球
            if([24,25].indexOf(this.props.md.method_id)!==-1){//单独判断点击球
                cart[i]=[num]
            }else{
                if(cart[i]&&cart.length>0){
                    if(cart[i].indexOf(num)===-1){
                        cart[i].push(num)
                    }else{
                        cart[i].splice(cart[i].indexOf(num),1)
                    }
                }else{
                    cart[i]=[num];
                }
            }

        }
        let item = this.calcItem(cart);
        let cartItem ={
            buttonType:buttonType,//记录按钮大小单双
            zhushu:item.zhushu,//注数
            content:item.content,//content
            cart:cart//购物车
        };
        this.props.setCartItem(cartItem);
    }

    render(){
      let md=this.props.md;


      if(!md) {
          return null;
      }
        return (
            <div>
                <NumList
                    cur_method={this.props.cur_method}//当前玩法数据
                    handlechooseNum={(i,num,arr,type)=>{this.setCart(i,num,arr,type)}}
                    cart={this.props.cart}//当前购物车
                    prize={(parseFloat(this.props.md.prize[1])*this.props.gamePrize).toFixed(3)}//赔率
                    gamePrize={this.props.gamePrize}
                   buttonType={this.props.buttonType}
                  game_key={this.props.game_key}
                />
            </div>
        )
    }
  }





class NumList extends Component{
  constructor(props) {
      super(props);
      this.state={

      }

  }

  // 全大小奇偶清，渲染按钮
  renderTypeButton(index){
      let typeArr=["全","大","小","奇","偶","清"];
      let renderArr=[];
      let buttonType=this.props.buttonType;
      typeArr.map((item,i)=>{
          renderArr.push(<button key={i} onClick={()=>{this.handleFilter(index,i)}} className={buttonType&&buttonType[index]===i?"on":""}>{item}</button>)
      });
      return renderArr;
  }

  //点击筛选
  handleFilter(i,type){//选号
      let num;
      // "全","大","小","奇","偶","清"
      switch (type){
          case 0:
              num = ["0","1","2","3","4","5","6","7","8","9"];
              break;
          case 1:
              num = ["5","6","7","8","9"];
              break;
          case 2:
              num = ["0","1","2","3","4"];
              break;
          case 3:
              num = ["1","3","5","7","9"];
              break;
          case 4:
              num = ["2","4","6","8","0"];
              break;
          case 5:
              num = [];
              break;
      }

      this.props.handlechooseNum(i,"",num,type);
  }

  render(){


      let cur_method = this.props.cur_method;
      let cart = this.props.cart;
      let renderNumList=[];
      cur_method.map((item,i)=>{
          let codeArr = item.nums.split(" ");

          renderNumList.push(
              <div className="ch_chart" key={i}>
                  <div className="ch_num_w">
                      {item.prompt}
                    <span>赔率：{this.props.prize}</span>
                  </div>
                  <div className="ch_num_box">
                      {item.has_filter_btn==1?<div className="ch_num_btns">
                            {this.renderTypeButton(i)} {/*//渲染按钮*/}
                      </div>:null
                      }

                      <ul className="ch_num_show">
                          {codeArr.map((num,j)=>{



                              return(<li key={j}>

                                <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button" className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off ant-btn-primary"}>
                                    {num}
                                </button>

                              </li>)
                          })
                          }
                      </ul>
                  </div>
              </div>
          )
      });
      return(
          <div>
              {renderNumList}
          </div>
      )
  }
}


export default LotteryCommon(Mmc);
