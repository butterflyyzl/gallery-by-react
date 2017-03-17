require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
//获取图片相关的数据
let imageDatas=require('../data/imageDatas.json');
let yeomanImage = require('../images/yeoman.png');
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
  render() {
    var controllerUnits = [];
    var imgFigures=[];
    imageDatas.forEach(function(value, index){
      imgFigures.push(<ImgFigure data={value} key={'imgFigures'+index}/>);
    });
    return (
      <div className="index">
        <img className="img-sec" />
           {imgFigures}
        <div className="controller-nav">
          {controllerUnits}
        </div>
      </div>
    );
  }
}





AppComponent.defaultProps = {
};

export default AppComponent;
