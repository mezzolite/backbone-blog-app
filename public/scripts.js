//Backbone Model

const Blog = Backbone.Model.extend({
    defaults: {
        author: '',
        title: '',
        URL: ''
    }
})

//Backbone Collection

const Blogs = Backbone.Collection.extend({})

//instantiate two blogs

// const blog1 = new Blog({
//     author: 'Mez',
//     title: 'Mez\'s Blog',
//     URL: 'http://mezsblog.com'
// })

// const blog2 = new Blog({
//     author: 'Stacey',
//     title: 'Stacey\'s Blog',
//     URL: 'http://staceysblog.com'
// })

//instantiate a Collection

const blogs = new Blogs()

//Backbone View for one blog

const BlogView = Backbone.View.extend({
    model: new Blog(),
    tagName: 'tr',
    initialize: function(){
        this.template = _.template($('.blogs-list-template').html())
    },
    events: {
        'click .edit-blog': 'edit',
        'click .update-blog': 'update',
        'click .cancel-blog': 'cancel',
        'click .delete-blog': 'delete'
    },
    edit: function(){
        $('.edit-blog').hide()
        $('.delete-blog').hide()
        this.$('.update-blog').show()
        this.$('.cancel-blog').show()

        let author = this.$('.author').html()
        let title = this.$('.title').html()
        let URL = this.$('.URL').html()

        this.$('.author').html('<input type="text" class="form-control author-update" value="' + author +'">')
        this.$('.title').html('<input type="text" class="form-control title-update" value="' + title +'">')
        this.$('.URL').html('<input type="text" class="form-control URL-update" value="' + URL +'">')
    },
    update: function(){
        this.model.set('author', $('.author-update').val())
        this.model.set('title', $('.title-update').val())
        this.model.set('URL', $('.URL-update').val())
    },
    cancel: function(){
        blogsView.render()
    },
    delete: function(){
        this.model.destroy()
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()))
        return this
    }
})

//Backbone View for all blogs

const BlogsView = Backbone.View.extend({
    model: blogs,
    el: $('.blogs-list'),
    initialize: function() {
        let self = this
        this.model.on('add', this.render, this)
        this.model.on('change', function(){
            setTimeout(function() {
                self.render()
            }, 30)
        }, this)
        this.model.on('remove', this.render, this)
    },
    render: function(){
        const self = this
        this.$el.html('')
        _.each(this.model.toArray(), function(blog){
            self.$el.append((new BlogView({model: blog})).render().$el)
        })
        return this
    }
})

const blogsView = new BlogsView

$(document).ready(function() {
    $('.add-blog').on('click', function() {
        let blog = new Blog({
            author: $('.author-input').val(),
            title: $('.title-input').val(),
            URL: $('.URL-input').val()
        })
        $('.author-input').val('')
        $('.title-input').val('')
        $('.URL-input').val('')
        console.log(blog.toJSON())
        blogs.add(blog)
    })
})