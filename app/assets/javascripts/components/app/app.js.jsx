(function(root) {
  'use strict';
  var MyComponents = root.MyComponents = root.MyComponents || {};

  MyComponents.App = React.createClass({

    render: function(){
      return ( <div>
                <MyComponents.Background />
                <div className="container-fluid">
                  {this.props.children}
                </div>
               </div>
             )
    }
  });

}(this));
