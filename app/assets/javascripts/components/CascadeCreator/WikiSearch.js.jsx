(function(root) {
  'use strict';

  var MyComponents = root.MyComponents = root.MyComponents || {};

  MyComponents.WikiSearch = React.createClass({
    getInitialState: function(){
      return {search: "Click to search Wikipedia", cleared: false, idx: -1};
    },

    clear: function(){
      if (this.state.cleared) {return;}
      this.setState({waiting: false, search: "", results: [], touched: true});
    },

    update: function(e) {
      var term;
      term = e.target.value;
      this.setState({search: term});
    },

    deferredTitleSearch: function(e){
      if (!this.state.waiting) {
        this.setState({waiting: true});
        this.timeout = setTimeout(this.searchTitles, 1000);
      }
    },

    searchTitles: function() {
      var term, searchURL;
      this.setState({waiting: false});

      term = this.state.search;
      if (term.length === 0) {
        this.setState({results: []});
        return;
      }

      searchURL = 'https://en.wikipedia.org/w/api.php?action=query&list=allpages&apfrom=' +
        encodeURIComponent(term) + '&aplimit=10&format=json';
      $.ajax({
        method: 'GET',
        headers: {"Origin": "www.cascades.online"},
        url: searchURL,
        dataType: "jsonp",
        success: this.updateTitleList
      });
    },

    updateTitleList: function(json){
      if (this.timeout) {
        this.setState({results: json.query.allpages});
      }
    },

    selectTitle: function(e) {
      if (e.target.tagName === "UL") {return;}
      this.conductSearch(e.target.textContent);
    },

    onEnter: function(e){
      var title;

      if (e.keyCode === 13 || e.keyCode === 9) {
        e.preventDefault();
        if (this.state.idx > -1) {
          title = document.querySelector("li.selected").textContent;
          this.setState({idx: -1});
        } else {
          title = e.target.value;
        }
        this.conductSearch(title);
      }

      if (e.keyCode === 38) {
        this.moveUpSelector();
      }

      if (e.keyCode === 40) {
        this.moveDownSelector();
      }
    },

    moveUpSelector: function() {
      this.setState({idx: Math.min(this.state.idx - 1, 11)});
    },

    moveDownSelector: function() {
      this.setState({idx: Math.max(this.state.idx + 1, -1)});
    },

    conductSearch: function(title){
      clearTimeout(this.timeout);
      this.timeout = null;
      var searchURL;

      this.setState({search: title, waiting: true, results: []});

      searchURL = 'https://alloworigin.com/get?url=' +
      'http://en.m.wikipedia.org/wiki/' + encodeURIComponent(title.split(" ").join("_"));
      $.get(searchURL, function(data){
        this.props.createCascade(data);
        this.props.toggleSearch();
      }.bind(this));
    },

    componentDidUpdate: function(){
      (document.getElementById("search") || document.body).focus();
    },

    onMouseOver: function(e){
      this.setState({idx: e.target.dataset.id});
    },

    render: function(){
      if (!this.props.toggle) { return <MyComponents.SaveOrRestart toggleSearch={this.props.toggleSearch} />; }

      return (<div className="wiki relative">
                <MyComponents.WikiSearchBar onKeyDown={this.onEnter} value={this.state.search} onFocus={this.clear} onKeyUp={this.deferredTitleSearch} onChange={this.update} />
                <MyComponents.WikiSearchResults onMouseOver={this.onMouseOver} selectIDX={this.state.idx} results={this.state.results || []}
                                                onSelect={this.selectTitle}/>
              </div>);

    }
  });

}(this));
