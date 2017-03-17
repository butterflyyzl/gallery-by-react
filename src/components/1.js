require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
//获取图片相关的数据
var imageDatas=require('../data/imageDatas.json');
// let yeomanImage = require('../images/yeoman.png');
//
// 利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas=( function genImageURL(imageDatasArr){
  for (var i = 0,j=imageDatasArr.length; i < j; i++) {
    var singleImageData=imageDatasArr[i];
    singleImageData.imageURL=require('../images/'+singleImageData.fileName);
    imageDatasArr[i]=singleImageData;
  }
  return imageDatasArr;
})(imageDatas);


var ImgFigure =React.createClass({
  render: function (){
    return (
      <figure>
        <img src={this.props.data.imageURL}
             alt={this.props.data.title} />
        <figcaption>
          <h2>{this.props.data.title}</h2>
        </figcaption>
      </figure>
      )
  }
})
class AppComponent extends React.Component {
  Constant:{
    centerPos:{
      left:0,
      right:0
    },
    // 水平方向的取值范围
    hPosRange:{
      leftSecX:[0,0],
      rightSecx:[0,0],
      y:[0,0]
    },
    // 垂直方向的取值范围
    vPosRange:{
      x:[0,0],
      topY:[0,0]
    }
  },
  // 重新布局所有巨田
  // @
  rearrange:function (centerIndex){

  },
  getInitalStage: function (){}{
    return {
       imgsArrangeArr:[
          // {
          //   pos:{
          //     left:'0',
          //     top:'0'
          //   }
          // }
       ]
    }
  }
  // 组件加载以后，为每张图片计算其位置的范围
  componentDidMount: function(){

    // 首先拿到舞台的大小
    //
    var stageDOM=React.findDOMNode(this.refs.stage),
        stageW=stageDOM.scrollWidth,
        stageH=stageDOM.scrollHeight,
        halfStageW=Math.ceil(stageW/2),
        halfStageH=Math.ceil(stageH/2);
      // 拿到i一个imageFigure的大小
    var imgFigureDOM=React.findDOMNode(this.refs.imgFigure0),
        imgW=imgFigureDOM.scrollWidth,
        imgH=imgFigureDOM.scrollHeight,
        halfImgW=Math.ceil(imgW/2),
        halfImgH=Math.ceil(imgH/2);
        // 计算中心图片的位置点
    this.Constant.centerPos={
      left:halfStageW-halfImgW,
      top:halfStageH-halfImgH
    }
    // 计算左侧，右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0]= -halfImgW;
    this.Constant.hPosRange.leftSecX[1]=halfStageW-halfImgW * 3;
    this.Constant.hPosRange.rightSecx[0]=halfStageW+halfImgW;
    this.Constant.hPosRange.rightSecx[1]=stageW-halfimgW;
    this.Constant.hPosRange.y[0]= -halfImgH;
    this.Constant.hPosRange.y[1]= stageW-halfImgH;
    // 计算上册区域图片排布取值范围
    this.Constant.vPosRange.topY[0]=halfImgH;
    this.Constant.vPosRange.topY[1]=halfStageH-halfImgH * 3;
    this.Constant.vPosRange.x[0]=halfImgW-imgW;
    this.Constant.vPosRange.x[1]=halfImgW;

    this.rearrange(0);

  },



  render() {
    var controllerUnits = [];
    var imgFigures=[];
    imageDatas.forEach(function(value,index){
      if (!this.state.imgsArrangeArr[index]) {
        this.stage.imgsArrangeArr[index]={
          pos:{
            left:0,
            top:0
          }
        }
      }
      imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index}/>);
    }.bind(this));
    return (
      <div className="stage" ref="stage">
        <img className="img-sec" />
           {imgFigures}
        <div className="controller-nav">
          {controllerUnits}
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
