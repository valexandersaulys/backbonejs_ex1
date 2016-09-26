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

    // Delegated events for creating new items and clearing completed ones
    events: {
        'keypress #new-todo': 'createOnEnter',
        'click #clear-completed': 'clearCompleted',
        'click #toggle-all': 'toggleAllComplete'
    },

    // At initialization, we bind to the relevant events on the `Todos`
    // collection, when items are added or changed
    initialize: function() {
        // Remember, this.$() finds elements relative to this.$el
        
        this.allCheckbox = this.$('#toggle-all')[0];

        // These bind to the main DOM
        this.$input = this.$('#new-todo');
        this.$footer = this.$('#footer');
        this.$main = this.$('#main');

        // We add listener events
        this.listenTo(app.Todos, 'add', this.addOne);
        this.listenTo(app.Todos, 'reset', this.addAll);

        this.listenTo(app.Todos, 'change:completed', this.filterOne);
        this.listenTo(app.Todos, 'filter', this.filterAll); //These two are for binding for routes

        this.listenTo(app.Todos, 'all', this.render);

        app.Todos.fetch();
    },

    // For re-rendering the app - refreshing statistics and all that
    // rest of the app doesn't change. Called whenever a change is noted 
    render: function() {
        var completed = app.Todos.completed().length;
        var remaining = app.Todos.remaining().length;

        if ( app.Todos.length ) {
            this.$main.show();
            this.$footer.show();

            this.$footer.html( this.statsTemplate({
                completed: completed,
                remaining: remaining
            }));

            this.$('#filters li a')
                .removeClass('selected')
                .filter('[href="#/'+ ( app.TodoFilter || '' ) + '"]')
                .addClass('selected');
        } else {
            this.$main.hide();
            this.$footer.hide();
        }

        this.allCheckbox.checked = !remaining;
    },

    // Add a single todo item to the list by creating a view for it and
    // appending its element to the `<ul>`
    addOne: function( todo ) {
        var view = new app.TodoView({ model: todo });
        $('#todo-list').append( view.render().el );
    },

    // Add all items in the Todos collection at one
    addAll: function() {
        // we are able to use `this` implicitly because the listenTo() implicitly sets
        // the callback's context to this view when it created the binding.
        this.$('#todo-list').html('');
        app.Todos.each(this.addOne, this);
    },

    // * * * * * * * These get called if the view is .trigger('filter'), which
    // it is in the router.js file
    filterOne: function (todo) {
        todo.trigger('visisble');
    },
    filterAll: function () {
        app.Todos.each(this.filterOne, this);
    },
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 

    // Gets attributes binded to DOM elements, which were declared in initialize()
    newAttributes: function() {
        return {
            title: this.$input.val().trim(),
            order: app.Todos.nextOrder(),
            completed: false
        };
    },

    // the `event` is the keypress. This function was bound to that in events()
    createOnEnter: function( event ) {
        if ( event.which !== ENTER_KEY || !this.$input.val().trim() ) {
            return;
        }

        app.Todos.create( this.newAttributes() );
        this.$input.val('');
    },

    // This will clear bits on the screen
    clearCompleted: function() {
        // calls the function 'destroy' on all elements in the list passed
        _.invoke(app.Todos.completed(), 'destroy');
        return false;
    },

    // get all checkbox values, set each model in the collection to the
    // value given
    toggleAllComplete: function() {
        var completed = this.allCheckbox.checked;

        app.Todos.each(function( todo ) {
            todo.save({
                'completed': completed
            });
        });
    }
});
