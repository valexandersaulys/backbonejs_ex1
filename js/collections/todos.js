var app = app || {}   // what is this for?

/*
 * A `TodoList` collection is used to group our models. This collection
 * uses the LocalStorage adapter to override Backbone's default `sync()` 
 * operation with one that will persist our Todo records to HTML5 Local
 * Local Storage. Through local storage, they're saved between page 
 * requests
 */

var TodoList = Backbone.Collection.extend({
//app.Todos = Backbone.Collection.extend({

    // Reference to this collection's model
    model: app.Todo,

    // Implement LocalStorage
    localStorage: new Backbone.LocalStorage('todos-backbone'),
    //localStorage: true,  // This was wrong in the documentation

    // Filter down the list for those that are finished
    completed: function() {
        // this.filter() takes a function and returns all values that
        // pass the `truth test`, which in this case is a list of true/false
        // values
        return this.filter( function(todo) {
            // this.get() gets a model specified by 'id' within the parenthesis
            return todo.get('completed');
        });
    },

    // Filter down the list for those that are not finished
    remaining: function() {
        // this.without() returns a copy of the array with all instances of the
        // values removed. `apply()` is apparently native to javascript and
        // applies some universal function against them. In this case, completed()
        // is called and all objects in the array are returned to without() 
        return this.without.apply( this, this.completed() );
    },

    // Keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items
    nextOrder: function() {
        // sequence generator. Each array gets a number equal to whatever was the
        // last item plus 1. If first (i.e. nobody before), then a 1 is used. 
        if ( !this.length ) {
            return 1;
        }
        return this.last().get('order') + 1;
    },

    // Todos are sorted by their original insertion order
    comparator: function(todo) {
        // not sure shere 'order' attribute comes from
        return todo.get('order');
    }
});

// Create a new global collection of Todos
app.Todos = new TodoList();
