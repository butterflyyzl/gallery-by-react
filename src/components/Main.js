require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
//获取图片相关的数据
let imageDatas=require('../data/imageDatas.json');

// 利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas=( function genImageURL(imageDatasArr){
  for (var i = 0,j=imageDatasArr.length; i < j; i++) {
    var singleImageData=imageDatasArr[i];
    singleImageData.imageURL=require('../images/'+singleImageData.fileName);
    imageDatasArr[i]=singleImageData;
  }
  return imageDatasArr;
})(imageDatas);
// 获取区间内的一个随机值
function getRangeRandom(low,high) {
  return Math.ceil(Math.random() * (high - low) + low);
}
function get30DegRandom () {
    return (Math.random()>0.5 ?'':'-')+Math.ceil(Math.random() * 30);
  }
class ImgFigure extends React.Component {
 handleClick(e) {
    if(this.props.arrange.isCenter){
      this.props.inverse();
    } else {
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
}
  render () {
    var styleObj={};

    //如果props有指定值侧使用
    if (this.props.arrange.pos) {
      // console.log(this.props.arrange.pos);
      styleObj=this.props.arrange.pos;
    }

    //如果图片的旋转角度有值并且不为0， 添加旋转角度
    if (this.props.arrange.rotate) {
      // (['-moz-','-ms-','-webkit-',''])
      ['MozTransform','msTransform','WebkitTransform','transform'].forEach(function (value){


      styleObj[value]='rotate('+this.props.arrange.rotate+'deg)';
    }.bind(this));
    }

     //添加z-index 避免遮盖
    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
    } else {
      styleObj.zIndex = 0;
    }


    var igmFigureClassName = "img-figure";
        igmFigureClassName += this.props.arrange.isInverse?' is-inverse':'';

    return ( <figure className={igmFigureClassName}
      style={styleObj}
      onClick={this.handleClick.bind(this)}
      ref="figure">
        <img
        src={this.props.data.imageURL}
        alt={this.props.data.title}
        />
        <figcaption>
          <h2 className="img-title">
          {this.props.data.title}
          </h2>
          <div className="img-back" onClick={this.handleClick.bind(this)}>
            <p>{this.props.data.desc}</p>
          </div>
        </figcaption>
      </figure>
      )
  }
}

class ControllerUnit extends React.Component {
  handleClick(e){
    //如果点击的居中图片，则翻转；否则居中
    if(this.props.arrange.isCenter){
      this.props.inverse();
    } else {
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  }
  render () {
    var controllerUintClassName='controller-unit';
    if(this.props.arrange.isCenter) {
      controllerUintClassName += ' is-center';
    }
    if (this.props.arrange.isInverse) {
      controllerUintClassName += 'is-inverse';
    }
    return (  <span
     className={controllerUintClassName}
     onClick={this.handleClick.bind(this)}>
     </span>
      )
  }
}
class AppComponent extends React.Component {
  constructor (props) {
      super(props)
      this.state = {
             imgsArrangeArr:[
               /*
          {
            pos: {
              left: 0,
              right: 0
            },
            rotate: 0,
            isInverse: false //图片正反面
          },
          isCenter:false //图片默认不居中
          */

    this.Constant = { //常量Key
    centerPos : {
      left: 0,
      right: 0
    },
    // 水平方向的取值范围
    hPosRange : {
      leftSecX : [0, 0],
      rightSecx : [0, 0],
      y : [0, 0]
    },
    // 垂直方向的取值范围
    vPosRange : {
      x: [0, 0],
      topY: [0, 0]
    }
  }]
  };
}
  // 重新布局所有图片
  // @param centerIndex 指定居中排布那个图片



  // 组件加载以后，为每张图片计算其位置的范围
  componentDidMount () {

    // 首先拿到舞台的大小
    //React.findDOMNode ES6不需要
    var stageDOM=this.refs.stage,
        stageW=stageDOM.scrollWidth,
        stageH=stageDOM.scrollHeight,
        halfStageW=Math.ceil(stageW/2),
        halfStageH=Math.ceil(stageH/2);
      // 拿到i一个imageFigure的大小
    var imgFigureDom=this.refs.imgFigure0.refs.figure;
      console.log(imgFigureDom,this.refs.imgFigure0,stageDOM.scrollWidth,halfStageW)
    var imgW = imgFigureDom.scrollWidth,
        imgH = imgFigureDom.scrollHeight,
        halfImgW = Math.ceil(imgW/2),
        halfImgH = Math.ceil(imgH/2);
        // 计算中心图片的位置点
        // console.log(imgW);
    this.Constant.centerPos={
      left : halfStageW-halfImgW,
      top : halfStageH-halfImgH
    };
    // 计算左侧，右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0]= -halfImgW;
    this.Constant.hPosRange.leftSecX[1]=halfStageW-halfImgW * 3;
    this.Constant.hPosRange.rightSecx[0]=halfStageW+halfImgW;
    this.Constant.hPosRange.rightSecx[1]=stageW-halfImgW;
    this.Constant.hPosRange.y[0]= -halfImgH;
    this.Constant.hPosRange.y[1]= stageW-halfImgH;
    // 计算上册区域图片排布取值范围
    this.Constant.vPosRange.topY[0]=-halfImgH;
    this.Constant.vPosRange.topY[1]=halfStageH-halfImgH * 3;
    this.Constant.vPosRange.x[0]=halfStageW-imgW;
    this.Constant.vPosRange.x[1]=halfStageW;
    // console.log(this.state.imgsArrangeArr)
    this.rearrange(0);

  }
  rearrange (centerIndex) {
    // console.log( this.state.imgsArrangeArr);
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecx = hPosRange.leftSecX,
        hPosRangeRightSecx = hPosRange.rightSecx,
        // hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,
        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2),
// 取一个或者不取

        topImgSpliceIndex = 0,
        imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex, 1);
        // console.log(topImgNum,hPosRange,hPosRangeRightSecx);

        //首先居中centerIndex的图片
        imgsArrangeCenterArr[0] ={
          pos: centerPos,
          rotate : 0, //不需要旋转
          isCenter: true
        }
        // 取出药布局上侧的图片状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length-topImgNum));
        imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

        imgsArrangeTopArr.forEach(function (value,index){
         imgsArrangeTopArr[index] = {
        pos :{
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
        }
        });
        // console.log(imgsArrangeArr[2]);
        // 布局左右两侧的图片
        for (var i=0,j=imgsArrangeArr.length,k = j /2;i < j; i++){
          var  hPosRangeLORX=null;
          if (i < k) {
            hPosRangeLORX=hPosRangeLeftSecx;
          } else {
            hPosRangeLORX=hPosRangeRightSecx;
          }
          imgsArrangeArr[i] ={
            pos : {
              top: getRangeRandom(hPosRange.y[0], hPosRange.y[1]),
              left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
            },
            rotate:  get30DegRandom(),
            isCenter: false
          };

          // console.log(hPosRange.y[0],imgsArrangeArr[i]);
        }
        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
          imgsArrangeArr.splice(topImgSpliceIndex, 0,imgsArrangeTopArr[0]);
        }
        imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
        this.setState({
          imgsArrangeArr: imgsArrangeArr
        });
  }
// 翻转图片
// @param index 输入当前被执行的inverse操作的图片对应的图片信息数组的index值
// @return{function}这是一个闭包函数，其中return一个真正待被执行的函数
  inverse(index) {
    return function (){
      var imgsArrangeArr = this.state.imgsArrangeArr;
      // console.log(imgsArrangeArr[index].isInverse);
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      // console.log(imgsArrangeArr[index].isInverse);
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }.bind(this);
  }
  /* 利用rearrange函数，居中对应index的图片
  * @param index ，需要居中的图片index
  * @return {Function}
  */
  center(index) {
    return function(){
      this.rearrange(index);
    }.bind(this);
  }
  render () {
    var controllerUnits = [];
    var imgFigures=[];
    imageDatas.forEach(function(value, index){
       if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos:{
            left : 0,
            top : 0
          },
          rotate:0,
          isInverse: false,
          isCenter: false
        }
      }
      // console.log(this.state.imgsArrangeArr);
      imgFigures.push(<ImgFigure
      data={value}
      key={index}
      ref={'imgFigure'+index}
      arrange={this.state.imgsArrangeArr[index]}
      inverse = {this.inverse(index).bind(this)}
      center={this.center(index).bind(this)} />);
       //多次修改this绑定！！
      controllerUnits.push(<ControllerUnit
       key={index}
       arrange={this.state.imgsArrangeArr[index]}
       inverse={this.inverse(index).bind(this)}
       center={this.center(index).bind(this)}
        />
       )
    }.bind(this));
    // console.log(imgFigures);
    return ( <section className="stage" ref="stage">
                <section className="img-sec">
                   {imgFigures}
                </section>
                <nav className="controller-nav">
                  {controllerUnits}
                </nav>
      </section>
    );
  }

}





AppComponent.defaultProps = {};

export default AppComponent;
