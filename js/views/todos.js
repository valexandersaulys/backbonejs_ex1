/* 
 * This is for an individual Todo View
 */
var app = app || {};

app.TodoView = Backbone.View.extend({
    tagName: 'li',
    template: _.template( $('#item-template').html() ),
    events: {
        'dblclick label': 'edit',
        'keypress .edit': 'updateOnEnter',
        'blur .edit': 'close'
    },
    initialize: function() {
        // this.listenTo(object, 'event_name', function to call)
        // 'event_name', if in quotes, calls some default that backbone has listed
        this.listenTo(this.model, 'change', this.render);
    },
    render: function() {
        // we popular the template with the attributes of the model for this
        // individual view. Then we set the binding element to show this html
        this.$el.html( this.template( this.model.attributes ) );

        // bind the DOM element
        this.$input = this.$('.edit');

        // Return the object
        return this;
    },
    edit: function() {
        // The binding element gets a class of 'editing' for editing mode
        this.$el.addClass('editing');

        // Then we focus on that aspect
        this.$input.focus();
    },
    close: function() {
        // Get the new value from this.$input, called earlier in render()
        var value = this.$input.val().trim();

        // Save the new model
        if ( value ) {
            this.model.save({ title: value });
        }
        
        // close the 'editing' mode
        this.$el.removeClass('editing');
    },
    updateOnEnter: function( e ) {
        // if the 'enter' key is pressed via a keypress event (see in events),
        // then call the close() function.
        if ( e.which === ENTER_KEY ) {
            this.close();
        }
    }
});
