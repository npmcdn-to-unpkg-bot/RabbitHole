(function(root) {
  'use strict';

  var MyComponents = root.MyComponents = root.MyComponents || {};

  MyComponents.ArticleDisplay = React.createClass({
    getWikiHTML: function(){
      return {__html: this.props.content};
    },

    handleClick: function(e){
      e.preventDefault();
      switch (e.target.tagName) {
        case "A":
          this.props.handleLink(e);
          break;
        case "P":
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
