_.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
};

$(function() {
  Models = {};
  Collections = {};
  Templates = {};
  Views = {};


  /*********************************************************************
   * Comment
   *********************************************************************/
  Models.Comment = Backbone.Model.extend({
  });


  Collections.Comments = Backbone.Collection.extend({
    model: Models.Comment
  });


  Templates.Comment = _.template([
    '<p>{{ content }}</p>',
  ].join(''));


  Templates.CreateComment = _.template([
    '<div id="new_comment" class="modal hide fade" tabindex="-1" role="dialog">',
    '  <div class="modal-header">',
    '    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>',
    '    <h3>Comment</h3>',
    '  </div>',
    '  <div class="modal-body">',
    '   <label>Your comment</label>',
    '   <textarea name="comment"></textarea>',
    '  </div>',
    '  <div class="modal-footer">',
    '    <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>',
    '    <button class="btn btn-primary">Comment!</button>',
    '  </div>',
    '</div>',
  ].join(''));


  Views.CreateComment = Backbone.View.extend({

    events: {
      'click .btn-primary': 'create',
    },

    initialize: function(options) {
      this.post = options.post;
      this.render();
    },

    render: function() {
      this.$el = $(Templates.CreateComment());
      this.$el.show().modal();
    },

    create: function() {
      var comment = new Models.Comment({ content: this.$('[name="comment"]').val()});
      this.post.get('comments').add(comment);
      this.$el.modal('hide');
      this.remove();
    }

  });


  /*********************************************************************
   * Post 
   *********************************************************************/
  Models.Post = Backbone.Model.extend({

    defaults: {
      title: 'No title',
      content: 'No content',
      comments: new Collections.Comments()
    },

    initialize: function() {
      this.get('comments').on('all', function() { this.trigger('change') }, this);
    }

  });


  Collections.Posts = Backbone.Collection.extend({
    model: Models.Post
  });


  Templates.Post = _.template([
    '<h2>{{ title }}</h2>',
    '<p>',
    '{{ content }}',
    '</p>',
    '<p>',
    '  <a href="#" class="showComments btn">Show comments</a>',
    '  <a href="#" class="comment btn btn-primary">Comment!</a>',
    '</p>',
  ].join(''));


  Views.Post = Backbone.View.extend({
    tagName: 'div',

    events: {
      'click .showComments': 'showComments',
      'click .comment': 'createComment'
    },

    initialize: function() {
      this.model.on('all', this.render, this);
      this.render();
    },

    render: function() {
      this.$el.html(Templates.Post(this.model.toJSON()));
      var n_comments = this.model.get('comments').length;
      this.$el.append($('<p>').html('' + n_comments + ' comments'));
      return this;
    },

    showComments: function() {
      var comments = $('#comments');
      var body = comments.find('.modal-body').empty();
      this.model.get('comments').each(function(comment) {
        body.append(Templates.Comment(comment.toJSON()));
      });
      comments.modal('show');
    },

    createComment: function() {
      var view = new Views.CreateComment({ post: this.model });
    },

  });


  Views.PostList = Backbone.View.extend({
    events: {
      'click #publish': 'publish'
    },

    initialize: function() {
      this.listenTo(this.collection, 'add', this.addOne);
      this.listenTo(this.collection, 'reset', this.addAll);

      this.addAll();
    },

    addOne: function(post) {
      var view = new Views.Post({ model: post });
      this.$el.find('#postList').append(view.render().el);
    },

    addAll: function() {
      this.collection.each(this.addOne, this);
    },

    publish: function() {
      var view = new Views.CreatePost({ collection: this.collection });
    }

  });

  Templates.CreatePost = _.template([
    '<div id="new_post" class="modal hide fade" tabindex="-1" role="dialog">',
    '  <div class="modal-header">',
    '    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>',
    '    <h3>post</h3>',
    '  </div>',
    '  <div class="modal-body">',
    '   <p>',
    '     <label>Your post</label>',
    '     <input type="text" name="title">',
    '   </p>',
    '   <p>',
    '     <label>Content</label>',
    '     <textarea name="content"></textarea>',
    '   </p>',
    '  </div>',
    '  <div class="modal-footer">',
    '    <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>',
    '    <button class="btn btn-primary">Post!</button>',
    '  </div>',
    '</div>',
  ].join(''));


  Views.CreatePost = Backbone.View.extend({

    events: {
      'click .btn-primary': 'create',
    },

    initialize: function(options) {
      this.render();
    },

    render: function() {
      this.$el = $(Templates.CreatePost());
      this.$el.show().modal();
    },

    create: function() {
      var post = new Models.Post({
        title: this.$('[name="title"]').val(),
        content: this.$('[name="content"]').val()
      });
      this.collection.add(post);
      this.$el.modal('hide');
      this.remove();
    }

  });


  /*********************************************************************
   * Examples
   *********************************************************************/
  var posts = new Collections.Posts([
    new Models.Post({
      title: 'Title 1',
      content: 'Content 1',
      comments: new Collections.Comments([
        new Models.Comment({ content: 'Comment 1' }),
        new Models.Comment({ content: 'Comment 2' }),
        new Models.Comment({ content: 'Comment 3' }),
        new Models.Comment({ content: 'Comment 4' })
      ])
    }),
    new Models.Post({
      title: 'Title 2',
      content: 'Content 2',
      comments: new Collections.Comments([
        new Models.Comment({ content: 'Comment 1' }),
        new Models.Comment({ content: 'Comment 2' }),
        new Models.Comment({ content: 'Comment 3' }),
        new Models.Comment({ content: 'Comment 4' })
      ])
    }),
    new Models.Post({
      title: 'Title 3',
      content: 'Content 3',
      comments: new Collections.Comments([
        new Models.Comment({ content: 'Comment 1' }),
        new Models.Comment({ content: 'Comment 2' }),
        new Models.Comment({ content: 'Comment 3' }),
        new Models.Comment({ content: 'Comment 4' })
      ])
    }),
    new Models.Post({
      title: 'Title 4',
      content: 'Content 4',
      comments: new Collections.Comments([
        new Models.Comment({ content: 'Comment 1' }),
        new Models.Comment({ content: 'Comment 2' }),
        new Models.Comment({ content: 'Comment 3' }),
        new Models.Comment({ content: 'Comment 4' })
      ])
    }),
  ]);

  postList = new Views.PostList({ el: $('body'), collection: posts });

});
