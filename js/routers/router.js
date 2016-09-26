// js/routers/router.js

/* Todo Router:
 * ------------
 * When a route changes, the todo list will be filtered on a model leve and 
 * selected class on the filter links in the footer will be toggled. When an 
 * item is updated while a filter is active, it will be updated accordingly.
 * The active filter is psersisted on reload.
 */

var app = app || {};

var workspace = Backbone.Router.extend({
    routes: {
        // Our router uses a *splat to set up a default route which passes the
        // string after '#/' in the URL to setFilter() which sets app.TodoFilter
        // to that string.
        '*filter': 'setFilter'
    },

    // function called for routing
    setFilter: function( param ) {

        // if we have a param, we can trim it and later use it
        if (param) {
            param = param.trim();
        }

        // For either a blank param or the param itself, whichever exists
        app.TodoFilter = param || '';

        // Then we trigger filter on our collection to toggle which items are
        // visible and which are not. I don't think this is meant to work quite
        // yet. 
        app.Todos.trigger('filter');
    }
});

app.TodoRouter = new workspace();
Backbone.history.start(); // initial URL routing during page load
