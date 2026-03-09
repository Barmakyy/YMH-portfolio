import BlogPost from '../models/BlogPost.js';
import slugify from 'slugify';

// GET /api/blog (public — published only)
export const getPublicPosts = async (req, res, next) => {
  try {
    const { tag } = req.query;
    const filter = { status: 'published', publishDate: { $lte: new Date() } };
    if (tag) filter.tags = tag;

    const posts = await BlogPost.find(filter)
      .sort({ publishDate: -1 })
      .select('-body');
    res.status(200).json({ status: 'success', results: posts.length, data: posts });
  } catch (error) {
    next(error);
  }
};

// GET /api/blog/:slug (public)
export const getPublicPost = async (req, res, next) => {
  try {
    const filter = { slug: req.params.slug };
    if (req.query.preview !== 'true') {
      filter.status = 'published';
      filter.publishDate = { $lte: new Date() };
    }

    const post = await BlogPost.findOne(filter);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    post.views += 1;
    await post.save({ validateBeforeSave: false });

    res.status(200).json({ status: 'success', data: post });
  } catch (error) {
    next(error);
  }
};

// GET /api/blog/tags (public — list all tags)
export const getAllTags = async (req, res, next) => {
  try {
    const tags = await BlogPost.distinct('tags', { status: 'published' });
    res.status(200).json({ status: 'success', data: tags });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/blog (all)
export const getAllPosts = async (req, res, next) => {
  try {
    const { status, tag, search, sort = '-createdAt' } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (tag) filter.tags = tag;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const posts = await BlogPost.find(filter).sort(sort).select('-body');
    res.status(200).json({ status: 'success', results: posts.length, data: posts });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/blog/:id
export const getPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    res.status(200).json({ status: 'success', data: post });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/blog
export const createPost = async (req, res, next) => {
  try {
    if (req.body.slug) {
      req.body.slug = slugify(req.body.slug, { lower: true, strict: true });
    }
    if (req.body.status === 'published' && !req.body.publishDate) {
      req.body.publishDate = new Date();
    }
    const post = await BlogPost.create(req.body);
    res.status(201).json({ status: 'success', data: post });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/blog/:id
export const updatePost = async (req, res, next) => {
  try {
    if (req.body.slug) {
      req.body.slug = slugify(req.body.slug, { lower: true, strict: true });
    }
    if (req.body.status === 'published' && !req.body.publishDate) {
      req.body.publishDate = new Date();
    }
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    res.status(200).json({ status: 'success', data: post });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/blog/:id
export const deletePost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    res.status(204).json(null);
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/blog/:id/duplicate
export const duplicatePost = async (req, res, next) => {
  try {
    const original = await BlogPost.findById(req.params.id);
    if (!original) return res.status(404).json({ message: 'Post not found.' });

    const duplicate = original.toObject();
    delete duplicate._id;
    delete duplicate.createdAt;
    delete duplicate.updatedAt;
    duplicate.title = `${original.title} (Copy)`;
    duplicate.slug = slugify(duplicate.title, { lower: true, strict: true });
    duplicate.status = 'draft';
    duplicate.views = 0;

    const newPost = await BlogPost.create(duplicate);
    res.status(201).json({ status: 'success', data: newPost });
  } catch (error) {
    next(error);
  }
};
