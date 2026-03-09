import Message from '../models/Message.js';

// POST /api/messages (public — contact form)
export const createMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message, budget, source, honeypot } = req.body;

    // Honeypot spam check
    if (honeypot) {
      return res.status(200).json({ status: 'success', message: 'Message sent.' });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    const msg = await Message.create({ name, email, subject, message, budget, source });
    res.status(201).json({ status: 'success', data: { id: msg._id } });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/messages
export const getAllMessages = async (req, res, next) => {
  try {
    const { status, sort = '-createdAt' } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const messages = await Message.find(filter).sort(sort);
    const unreadCount = await Message.countDocuments({ status: 'new' });
    res.status(200).json({ status: 'success', results: messages.length, unreadCount, data: messages });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/messages/:id
export const getMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found.' });

    // Mark as read if new
    if (message.status === 'new') {
      message.status = 'read';
      message.readAt = new Date();
      await message.save();
    }

    res.status(200).json({ status: 'success', data: message });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/messages/:id
export const updateMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!message) return res.status(404).json({ message: 'Message not found.' });
    res.status(200).json({ status: 'success', data: message });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/messages/:id
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found.' });
    res.status(204).json(null);
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/messages/bulk-update
export const bulkUpdateMessages = async (req, res, next) => {
  try {
    const { ids, status } = req.body;
    await Message.updateMany({ _id: { $in: ids } }, { status });
    res.status(200).json({ status: 'success', message: `${ids.length} messages updated.` });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/messages/bulk
export const bulkDeleteMessages = async (req, res, next) => {
  try {
    const { ids } = req.body;
    await Message.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ status: 'success', message: `${ids.length} messages deleted.` });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/messages/unread-count
export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Message.countDocuments({ status: 'new' });
    res.status(200).json({ status: 'success', data: { count } });
  } catch (error) {
    next(error);
  }
};
