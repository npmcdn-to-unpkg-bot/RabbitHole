(function(root) {
  'use strict';

  var MyComponents = root.MyComponents = root.MyComponents || {};

  MyComponents.WikiSearchBar = React.createClass({

    render: function(){
      return (<input id="search" className="wiki-search-bar"
                               type="text"
                               {...this.props}>
              </input>);
    }
  });

}(this));
