(function(root) {
  'use strict';

  var MyComponents = root.MyComponents = root.MyComponents || {};

  MyComponents.CascadeCreator = React.createClass({

    createCascade: function(data){
      var articleContent, title, redirected;

      [articleContent, title] = this.extractArticle(data, true);
      if (articleContent) {
        this.setState({content: articleContent, title: title, conductingSearch: false, date: Date.now()});
        window.scrollTo(0,0);
      }
    },

    extractArticle: function(data, validate) {
      var articleContent, title, redirect;

      articleContent = this.filterCrud(data.parse["text"]["*"], false);

      title = data.parse["title"];

      redirect = data.parse["redirects"];
      if (redirect[0]) {
        articleContent = this.addRedirect(articleContent, redirect);
      }

      return [articleContent, title];
    },

    addRedirect: function(content, redirect){
      return '<div class="redirected"><p><em>Redirected from ' + redirect[0]["from"] + '.</em></p></div>' + content;
    },

    restartSearch: function(){
      this.setState(({numSearches: this.state.numSearches + 1}));
      this.handleLink(this.state.e);
    },

    validate: function(articleContent){
      var msg;

      if (articleContent.indexOf("Wikipedia does not have an article") > -1) {
        msg = "Sorry, we could not find the article. Check out Wikipedia to make sure you have the name right." +
        articleContent;
      }

      if (articleContent.indexOf("page lists articles associated with the") > -1) {
        msg = "The search term is too ambiguous - you hit a disambiguation!";
      }

      if (msg) { alert(msg); return false; }

      return true;
    },

    $$: function(ctx, queryString, callback){
      Array.prototype.forEach.call(ctx.querySelectorAll(queryString) || [], callback);
    },

    myFind: function(ctx, queryString, callback){
      return Array.prototype.find.call(ctx.querySelectorAll(queryString) || [], callback);
    },

    filterCrud: function(articleContent, child){
      var div, filterString;

      div = document.createElement("div");
      div.innerHTML = articleContent;

      filterString = ".navbox, br, \
      strong.error, .hatnote, .edit-page, .metadata, \
      .mbox-small, .ambox, .portal, #see-also";

      if (child) {
        filterString += ", .infobox, .references, .vertical-navbox";
      }

      this.$$(div, filterString, function(node) {
        node.parentNode.removeChild(node);
      });

      this.$$(div, ".infobox", function(node){
        node.style.borderSpacing = "2px 5px";
      });

      this.$$(div, "a[href^='/wiki/']", function(node){
        node.setAttribute("href", "https://en.m.wikipedia.org" + node.getAttribute("href"));
      });

      this.$$(div, 'p, span', function(node){
        if ($.trim(node.innerHTML).length === 0) {
          node.parentNode.removeChild(node);
        }
      });

      return div.innerHTML;
    },

    setTitle: function(title){
      this.setState({title: title});
    },

    toggleSearch: function(){
      this.setState({toggle: !this.state.toggle});
    },

    getInitialState: function(){
      return {date: 0, content: "", title: "", forceSearch:"", conductingSearch: true, toggle: true, e: null, numSearches: 0};
    },


    getParent: function(e) {
      var parent;
      parent = e.target.parentNode;
      while (["B", "I", "SPAN"].indexOf(parent.tagName) > -1) {
        parent = parent.parentNode;
      }
      return parent;
    },

    alreadyClicked: function(url) {
      var search;
      if (search = document.getElementById(url)) {
        search.scrollIntoView(true);
        return true;
      }
      return false;
    },

    shouldSearch: function(e){
      var url, search;

      url = e.target.getAttribute("href");

      if (this.alreadyClicked(url)) {
        return false;
      }

      search = url.split("/wiki/")[1];

      if (typeof search === "undefined") {
        return false;
      }

      return search;
    },

    handleLink: function(e){
      var searchURL, search, callback;
      e.preventDefault();

      search = this.shouldSearch(e);

      if (!search) {
        return;
      }

      searchURL = "https://en.wikipedia.org/w/api.php?action=parse&format=json&redirects&prop=text&section=0&page=" + search;

      callback = function(data){
        this.appendResult(data,e);
      }.bind(this);

      $.ajax(this.buildParams(e,searchURL,callback));
    },

    buildParams: function(e, searchURL, callback){
      return {
        method: 'GET',
        headers: {"Origin": "www.cascades.online"},
        url: searchURL,
        dataType: "jsonp",
        success: callback
      };
    },

    appendResult: function(data,e){
      var div;

      div = document.createElement("div");
      div.innerHTML = this.filterCrud(data.parse.text["*"], true);
      if (this.validate(div.innerHTML)) {
        div.id = e.target.getAttribute("href");
        parent = this.getParent(e);

        $(div).addClass("bordered-paragraph clear-fix").insertAfter(parent);
      }
    },

    render: function(){
      return (
              <div className="centered-column relative">
                <MyComponents.WikiSearch forceSearch={this.state.forceSearch} toggleSearch={this.toggleSearch} toggle={this.state.toggle} createCascade={this.createCascade} setTitle={this.setTitle} />
                <MyComponents.Title value={this.state.title || "Create a Rabbit Hole."} />
                <MyComponents.ArticleDisplay handleLink={this.handleLink} handleParagaph={this.handleParagraph} content={this.state.content} />
              </div>
              );
    }
  });

}(this));
