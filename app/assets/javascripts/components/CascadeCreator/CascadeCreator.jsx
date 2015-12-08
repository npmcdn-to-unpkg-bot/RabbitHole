(function(root) {
  'use strict';

  var MyComponents = root.MyComponents = root.MyComponents || {};

  MyComponents.CascadeCreator = React.createClass({

    createCascade: function(data){
      var articleContent, title, redirected;

      [articleContent, title, redirected] = this.extractArticle(data, true);
      if (articleContent) {
        this.setState({content: articleContent, title: title, conductingSearch: false, date: Date.now()});
        window.scrollTo(0,0);
      }
    },

    extractArticle: function(data, validate) {
      var articleContent, title, redirectMsg, tempDiv, redirected;

      tempDiv = document.createElement("div");
      tempDiv.innerHTML = data.contents;

      articleContent = tempDiv.querySelector("#bodyContent");
      if (!articleContent && !validate) {
        this.restartSearch();
        return;
      } else {
        this.setState({numSearches: 0});
      }

      articleContent = articleContent.innerHTML;
      if (validate) {
        if (!this.validate(articleContent)) {
          this.setState({conductingSearch: true});
          return [null,null,null];
        }
      }

      redirectMsg = tempDiv.querySelector(".mw-redirectedfrom");
      redirected = !!redirectMsg;

      if (!validate) {
        redirectMsg = "";
        title = null;
      } else {
        articleContent = this.process(articleContent, redirectMsg);
        title = tempDiv.querySelector("#section_0").textContent;
      }


      return [articleContent, title, redirected];
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

    process: function(articleContent, redirectMsg){
      var temp, redirect;

      temp = this.filterCrud(articleContent);

      redirect = document.createElement("div");
      redirect = redirect.appendChild(document.createElement("p"));

      if (redirectMsg && redirectMsg.textContent) {
        redirectMsg = redirectMsg.textContent;
        redirect.innerHTML = $.trim(redirectMsg);
        temp.insertBefore(redirect, temp.firstChild);
      }

      articleContent = temp.innerHTML;
      articleContent.replace(/<a(.*?)>(.*?)<\/a>/g, "");

      return articleContent;
    },

    filterCrud: function(articleContent){
      var temp;

      temp = document.createElement("div");
      temp.innerHTML = articleContent;

      this.$$(temp,".navbox, br, \
      strong.error, .hatnote, .edit-page, .metadata, \
      .mbox-small, .portal, #see-also", function(node) {
        node.parentNode.removeChild(node);
      });

      this.$$(temp, ".infobox", function(node){
        node.style.borderSpacing = "2px 5px";
      });

      this.$$(temp, "a[href^='/wiki/']", function(node){
        node.setAttribute("href", "https://en.m.wikipedia.org" + node.getAttribute("href"));
      });

      this.$$(temp, 'p, span', function(node){
        if ($.trim(node.innerHTML).length === 0) {
          node.parentNode.removeChild(node);
        }
      });

      return temp;
    },

    setTitle: function(title){
      this.setState({title: title});
    },

    toggleSearch: function(){
      this.setState({toggle: !this.state.toggle});
    },

    getInitialState: function(){
      return {date: 0, content: "", title: "", conductingSearch: true, toggle: true, e: null, numSearches: 0, urls: []};
    },

    getHTML: function(e) {

    },

    getParent: function(e) {
      var parent;
      parent = e.target.parentNode;

      while (["I","B"].indexOf(parent.tagName) > -1) {
        parent = parent.parentNode;
      }

      return parent;
    },

    getParagraphs: function(html) {
      console.log(html);
    },

    handleLink: function(e){
      var html, parent, paragraphs;

      var searchURL, html;
      searchURL = window.location.origin + '/wiki/' +
      e.target.getAttribute("href").split("/wiki/")[1];

      $.get(searchURL, function(data){
        html = data;
        parent = this.getParent(e);

        paragraphs = this.getParagraphs(html);
      }.bind(this));


      // alert('got here');
      // var search;
      // e.preventDefault();
      // if (this.state.urls.length === 0 || this.state.urls.indexOf(e.target.getAttribute("href")) > -1) {
      //   if (search = document.getElementById(e.target.getAttribute("href"))) {
      //     search.scrollIntoView(true);
      //     return;
      //   }
      // };
      // setTimeout(
      //   function(){
      //     this.setState({date: Date.now()});
      //     var searchURL, that, title;
      //
      //     this.setState({searches: this.state.urls.concat(e.target.getAttribute("href"))});
      //

      //       // var articleContent, title2, paragraph, temp, parent, redirect, firstParagraph;
      //       // temp = $(data);
      //       //
      //       // [articleContent, title2, redirect] = that.extractArticle(data, false);
      //       // paragraph = that.extractParagraph(articleContent, title);
      //       // temp = document.createElement("div");
      //       // $(temp).append(paragraph);
      //       // temp.setAttribute("id", e.target.getAttribute("href"));
      //       // temp.className = "bordered-paragraph";
      //       //
      //       // parent = $(e.target).parent();
      //       // if (parent.prop("tagName") === "I" || parent.prop("tagName") === "B") {
      //       //   parent = parent.parent();
      //       // }
      //       //
      //       // $(temp).insertAfter(parent);
      //       // that.setState({e: null});
      //       // // temp.scrollIntoView();
      //     });
      //   }.bind(this), Date.now() - this.state.date - 5

    },

    extractParagraph: function(articleContent, title, redirect){
      var temp, temp2, firstParagraph, condition, i;
      temp2 = document.createElement("div");
      temp = document.createElement("div");
      temp.appendChild(temp2);
      temp2.innerHTML = articleContent;

      firstParagraph = temp.querySelectorAll("div > p");
      i = 0;
      while (firstParagraph[i].firstChild.style &&
             firstParagraph[i].firstChild.style.fontSize === "small") {
        i += 1;
      }

      firstParagraph = Array.prototype.slice.call(firstParagraph, i, i+3);
      console.log("here is the content of the first paragraph");
      console.log(firstParagraph[i].textContent);
      if (firstParagraph[i].textContent.indexOf("list") > -1) {
        return this.myFind(temp, 'div > p, dd', function(node){
          condition = $.trim(node.textContent).indexOf(title) === 0;
          console.log("Found " + title + "? " + condition);
          return condition;
        }) || firstParagraph;
      } else {
        return firstParagraph;
      }
    },

    handleParagraph: function(){

    },

    render: function(){
      return (
              <div className="centered-column relative">
                <MyComponents.WikiSearch toggleSearch={this.toggleSearch} toggle={this.state.toggle} createCascade={this.createCascade} setTitle={this.setTitle} />
                <MyComponents.Title value={this.state.title || "Create a Cascade"} />
                <MyComponents.ArticleDisplay handleLink={this.handleLink} handleParagaph={this.handleParagraph} content={this.state.content} />
              </div>
              );
    }
  });

}(this));
