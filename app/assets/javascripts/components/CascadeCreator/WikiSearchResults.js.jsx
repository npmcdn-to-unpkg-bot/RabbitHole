(function(root) {
  'use strict';

  var MyComponents = root.MyComponents = root.MyComponents || {};

  MyComponents.WikiSearchResults = React.createClass({
    render: function(){
      var resultList, i, that, className;

      if (this.props.results.length === 0) {
        return <span></span>;
      }
      i = -1;
      that = this;
      resultList = (this.props.results || []).map(function(result){
        i += 1;

        className = "";
        if (i == that.props.selectIDX) {
          className = "selected";
        }

        return <li key={i} data-id={i} className={className}>{result.title}</li>;
      });

      return (
            <ul className="wiki-search-results absolute" onMouseOver={this.props.onMouseOver} onClick={this.props.onSelect}>
              {resultList}
            </ul>
          );
    }
  });

}(this));
