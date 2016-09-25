var app = app || {};

/* The Application 
 * ----------------
 * This contains the core application logic that resides in each view.
 * We'll use the element controller pattern, which has two views: one for the
 * collection of items while the other is for each individual item.
 * --> `AppView` will handle the creation of new todos and rendering of the initial list
 * --> `TodoView` will be associated with each individual Todo record.
 * Todo instances can handle editing, updating, and destroying their associated todo
 */

app.AppView = Backbone.View.extend({

    // Choose the element to bind to
    el: '#todoapp',

    // Then choose the template we'll be using with underscore
    statsTemplate: _.template( $('#stats-template').html() ),

    // At initialization, we bind to the relevant events on the `Todos`
    // collection, when items are added or changed
    initialize: function() {
        // Remember, this.$() finds elements relative to this.$el
        
        this.allCheckbox = this.$('#toggle-all')[0];

        // These bind to the main DOM
        this.$input = this.$('#new-todo');
        this.$footer = this.$('#footer');
        this.$main = this.$('#main');

        // We add listener events, binding to elements
        this.listenTo(app.Todos, 'add', this.addOne);
        this.listenTo(app.Todos, 'reset', this.addAll);
    },

    // Add a single todo item to the list by creating a view for it and
    // appending its element to the `<ul>`
    addOne: function( todo ) {
        var view = app.TodoView({ model: todo });
        $('#todo-list').append( view.render().el );
    },

    // Add all items in the Todos collection at one
    addAll: function() {
        // we are able to use `this` implicitly because the listenTo() implicitly sets
        // the callback's context to this view when it created the binding.
        this.$('#todo-list').html('');
        app.Todos.each(this.addOne, this);
    }
});
