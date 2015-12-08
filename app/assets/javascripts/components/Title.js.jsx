(function(root) {
  'use strict';

  var MyComponents = root.MyComponents = root.MyComponents || {};

  MyComponents.Title = React.createClass({
    render: function(){
      return (<h1 className="title">{this.props.value}</h1>);
    }
  });

}(this));
