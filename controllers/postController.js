const Post = require('../models/postModel');

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      status: 'get all posts success',
      results: posts.length,
      data: {
        posts,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: 'fail',
    });
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json({
      status: 'get post success',
      data: {
        post,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
    });
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const post = await Post.create(req.body);
    res.status(200).json({
      status: 'create post success',
      data: {
        post,
      },
    });
  } catch (error) {
    console.log(e);
    res.status(400).json({
      status: 'fail',
    });
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      status: 'update post success',
      data: {
        post,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
    });
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'delete post success',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
    });
  }
};
