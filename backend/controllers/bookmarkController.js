import Bookmark from "../models/bookmarkModel.js";
import User from "../models/User.js";

// @desc    Get all bookmarks for user
// @route   GET /api/questions/bookmarks/all
// @access  Private
export const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id });
    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookmarks", error });
  }
};

// @desc    Create new bookmark
// @route   POST /api/questions/bookmarks
// @access  Private
export const createBookmark = async (req, res) => {
  try {
    const { title, url, description, category } = req.body;

    const bookmark = new Bookmark({
      user: req.user.id,
      title,
      url,
      description,
      category,
    });

    const createdBookmark = await bookmark.save();
    res.status(201).json(createdBookmark);
  } catch (error) {
    res.status(500).json({ message: "Error creating bookmark", error });
  }
};

// @desc    Delete bookmark
// @route   DELETE /api/questions/bookmarks/:id
// @access  Private
export const deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    // Verify user owns the bookmark
    if (bookmark.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await bookmark.remove();
    res.status(200).json({ message: "Bookmark removed" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bookmark", error });
  }
};

// @desc    Update bookmark
// @route   PUT /api/questions/bookmarks/:id
// @access  Private
export const updateBookmark = async (req, res) => {
  try {
    const { title, url, description, category } = req.body;
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    // Verify user owns the bookmark
    if (bookmark.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    bookmark.title = title || bookmark.title;
    bookmark.url = url || bookmark.url;
    bookmark.description = description || bookmark.description;
    bookmark.category = category || bookmark.category;

    const updatedBookmark = await bookmark.save();
    res.status(200).json(updatedBookmark);
  } catch (error) {
    res.status(500).json({ message: "Error updating bookmark", error });
  }
};
