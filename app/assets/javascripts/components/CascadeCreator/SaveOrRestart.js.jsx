(function(root) {
  'use strict';

  var MyComponents = root.MyComponents = root.MyComponents || {};

  MyComponents.SaveOrRestart = React.createClass({

    render: function(){
        return (
          <div className="button-holder">
            <button onClick={this.save}>Save</button>
            <button onClick={this.props.toggleSearch}>New</button>
          </div>
        )
    }
  });

}(this));
