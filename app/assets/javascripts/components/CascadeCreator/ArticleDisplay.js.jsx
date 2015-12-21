(function(root) {
  'use strict';

  var MyComponents = root.MyComponents = root.MyComponents || {};

  MyComponents.ArticleDisplay = React.createClass({
    getWikiHTML: function(){
      return {__html: this.props.content};
    },

    handleClick: function(e){
      switch (e.target.tagName) {
        case "A":
          e.stopPropagation();
          this.props.handleLink(e);
          break;
        default:
          break;
      }
    },


    render: function(){
      return <article onClick={this.handleClick} className="clear-fix" dangerouslySetInnerHTML={this.getWikiHTML()} ></article>;
    }
  });

}(this));
