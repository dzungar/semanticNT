/**
 * Module dependencies
 */

var mongoose = require('mongoose'),
    sanitize = require('validator').sanitize;

/**
 * Schemas
 */

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId; //Schema.ObjectId

var TopicSchema = new Schema({
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    courseid: { type: String, required: true },
    author: {type: String, required: true}
});
TopicSchema.pre('save', function (next) {
    var decoded = sanitize(this.title).entityDecode();
    this.title = sanitize(decoded).entityEncode();
    next();
});

var PostSchema = new Schema({
    body: { type: String, required: true },
    date: { type: Date, default: Date.now },
    stars: [String], //Array of usernames
    author: { type: String, required: true },
    topic: { type: ObjectId, required: true }
});
PostSchema.pre('save', function (next) {
    var decoded = sanitize(this.body).entityDecode();
    this.body = sanitize(decoded).entityEncode();
    next();
});

var Topic = mongoose.model('Topic', TopicSchema),
    Post = mongoose.model('Post', PostSchema);

/*
 * Serve JSON to our AngularJS client
 */

exports.getTopics = function (req, res) {
    var offset = req.params.offset || 0;

    Topic.find({ courseid: req.params.courseId })
        .sort({ date: 1 })
        .skip(offset)
        .exec(function (err, topics) {
            if (!err) {
                res.json(topics); // 200 OK + data
            } else {
                res.send(500); // 500 Internal Server Error
                console.log(err);
            }
        });
};

exports.getTopicById = function (req, res) {
    Topic.findById(req.params.topicId, function(err, topic) {
        if (!err) {
            res.json(topic); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.addTopic = function (req, res) {
    if (!req.user) {
        return res.send(401); // 401 Unauthorized
    }

    var topic = new Topic({
        title: req.body.title,
        courseid: req.params.courseId,
        author: req.user
    });

    topic.save(function (err, topic) {
        if (!err) {
            res.json(topic); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.updateTopic = function (req, res) {
    if (!req.user) {
        return res.send(401); // 401 Unauthorized
    }

    Topic.findById(req.params.topicId, function (err, topic) {
        if (!err) {
            if(!topic) {
                return res.send(400); //Bad request
            }
            if (topic.author !== req.user) {
                return res.send(403); // 401 Access forbidden
            }

            topic.set({ title: req.body.title });
            topic.save(function (err) {
                if (!err) {
                    res.json(topic); // 200 OK + data
                } else {
                    res.send(500); // 500 Internal Server Error
                    console.log(err);
                }
            });
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.removeTopic = function (req, res) {
    if (!req.user) {
        return res.send(401); // 401 Unauthorized
    }

    var topicId = req.params.topicId;

    Topic.findById(topicId, function (err, topic) {
        if (!err) {
            if(!topic) {
                return res.send(400); //Bad request
            }
            if (topic.author !== req.user) {
                return res.send(403);  // 401 Access forbidden
            }

            topic.remove(function (err) {
                if (!err) {
                    Post.remove({ topic: topicId }, function (err) {
                        if (!err) {
                            res.send(200); // 200 OK
                        } else {
                            res.send(500); // 500 Internal Server Error
                            console.log(err);
                        }
                    });
                } else {
                    res.send(500); // 500 Internal Server Error
                    console.log(err);
                }
            });
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.getPosts = function (req, res) {
    var offset = req.params.offset || 0;

    Post.find({ topic: req.params.topicId })
        .sort({ date: 1 })
        .skip(offset)
        .exec(function (err, posts) {
            if (!err) {
                res.json(posts); // 200 OK + data
            } else {
                res.send(500); // 500 Internal Server Error
                console.log(err);
            }
        });
};

exports.getPostById = function (req, res) {
    Post.findById(req.params.postId, function(err, post) {
        if (!err) {
            res.json(post); // 200 OK + data
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.addPost = function (req, res) {
    if (!req.user) {
        return res.send(401); // 401 Unauthorized
    }

    Topic.findById(req.params.topicId, function(err, topic) {
        if(err) {
            return res.send(500); // Internal server error
        }
        if(!topic) {
            return res.send(400); // Bad request
        }

        var post = new Post({
            body: req.body.body,
            topic: req.params.topicId,
            author: req.user
        });

        post.save(function (err, post) {
            if (!err) {
                res.json(post); // 200 OK + data
            } else {
                res.send(500); // 500 Internal Server Error
                console.log(err);
            }
        });
    });
};

exports.updatePost = function (req, res) {
    if (!req.user) {
        return res.send(401); // 401 Unauthorized
    }

    Post.findById(req.params.postId, function (err, post) {
        if (!err) {
            if(!post) {
                return res.send(400); //Bad request
            }
            if (post.author !== req.user) {
                return res.send(403); // 401 Access forbidden
            }

            post.set({ body: req.body.body });
            post.save(function (err) {
                if (!err) {
                    res.json(post); // 200 OK + data
                } else {
                    res.send(500); // 500 Internal Server Error
                    console.log(err);
                }
            });
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.removePost = function (req, res) {
    if (!req.user) {
        return res.send(401); // 401 Unauthorized
    }

    Post.findById(req.params.postId, function (err, post) {
        if (!err) {
            if(!post) {
                return res.send(400); //Bad request
            }
            if (post.author !== req.user) {
                return res.send(403); // 401 Access forbidden
            }

            post.remove(function (err) {
                if (!err) {
                    res.send(200); // 200 OK
                } else {
                    res.send(500); // 500 Internal Server Error
                    console.log(err);
                }
            });
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.starPost = function (req, res) {
    if (!req.user) {
        return res.send(401); // 401 Unauthorized
    }

    Post.findById(req.params.postId, function (err, post) {
        if (!err) {
            if (post &&
                req.user !== post.author &&
                post.stars.indexOf(req.user) === -1) {

                post.stars.push(req.user);
                post.save(function (err) {
                    if (!err) {
                        res.json(post); // 200 OK + data
                    } else {
                        res.send(500); // 500 Internal Server Error
                        console.log(err);
                    }
                });
            } else {
                res.send(400); //Already starred, not allowed or not found
            }
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};

exports.unstarPost = function (req, res) {
    if (!req.user) {
        return res.send(401); // 401 Unauthorized
    }

    Post.findById(req.params.postId, function (err, post) {
        if (!err) {
            var index;
            if (post &&
                (index = post.stars.indexOf(req.user)) !== -1) {
                post.stars.splice(index, 1);
                post.save(function (err) {
                    if (!err) {
                        res.json(post); // 200 OK + data
                    } else {
                        res.send(500); // 500 Internal Server Error
                        console.log(err);
                    }
                });
            } else {
                res.send(400); //Not starred or not found
            }
        } else {
            res.send(500); // 500 Internal Server Error
            console.log(err);
        }
    });
};