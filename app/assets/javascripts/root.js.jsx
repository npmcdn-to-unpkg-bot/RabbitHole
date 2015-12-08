(function(root) {
  'use strict';

  $(document).ready(function(){
    var ReactRouter, Route, Router, IndexRoute, MyComponents;

    ReactRouter = root.ReactRouter;
    Route = ReactRouter.Route;
    Router = ReactRouter.Router;
    IndexRoute = ReactRouter.IndexRoute;

    MyComponents = root.MyComponents;

    ReactDOM.render((
       <Router>
         <Route path="/" component={MyComponents.App} location={history.pushState ? 'history' : 'hash'}>
         <IndexRoute component={MyComponents.CascadeCreator} />
         </Route>
       </Router>
    ), document.getElementById("content"));
  });
}(this));
