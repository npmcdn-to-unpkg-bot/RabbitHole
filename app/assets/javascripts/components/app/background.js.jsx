(function(root) {
  'use strict';
  var MyComponents = root.MyComponents = root.MyComponents || {};

  MyComponents.Background = React.createClass({
    getInitialState: function(){
      return ({url: ""})
      // return ({url: "https://oceanwide-expeditions.com/uploads/media/default/0001/08/d2b17ceea03fd6fdfb7a0f8f6ad4069b607b75c5.jpeg"})
    },

    render: function(){
      var style = {
        backgroundImage: 'url(' + this.state.url + ')',
        backgroundColor: 'rgb(238, 238, 238)'
      };

      return <div style={style} className="back cover"></div>
    }
  });

}(this));
