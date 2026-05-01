const mongoose = require("mongoose");
const Task = require("../models/Task");
const { AppError } = require("../utils/AppError");

function normalizeStatus(status) {
  if (status == null) return undefined;
  const s = String(status).toLowerCase().trim();
  if (s !== "pending" && s !== "completed") return undefined;
  return s;
}

function getSafeMessage(error, fallback) {
  return error instanceof Error ? error.message : fallback;
}

function validateCreatePayload(body) {
  if (!body || typeof body !== "object") throw new AppError("Request body is required.", 400);
  const title = body.title == null ? "" : String(body.title).trim();
  const description = body.description == null ? "" : String(body.description).trim();

  if (!title) throw new AppError("Title is required.", 400);

  return { title, description };
}

function validateUpdatePayload(body) {
  if (!body || typeof body !== "object") throw new AppError("Request body is required.", 400);

  const update = {};
  if (body.title !== undefined) {
    const title = String(body.title).trim();
    if (!title) throw new AppError("Title cannot be empty.", 400);
    update.title = title;
  }

  if (body.description !== undefined) {
    update.description = body.description == null ? "" : String(body.description).trim();
  }

  if (body.status !== undefined) {
    const normalized = normalizeStatus(body.status);
    if (!normalized) throw new AppError('Status must be "pending" or "completed".', 400);
    update.status = normalized;
  }

  if (Object.keys(update).length === 0) {
    throw new AppError("Provide at least one field to update.", 400);
  }

  return update;
}

exports.createTask = async (req, res, next) => {
  try {
    const { title, description } = validateCreatePayload(req.body);

    const task = await Task.create({ title, description });
    res.status(201).json(task);
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(getSafeMessage(error, "Failed to create task."), 500));
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const statusQuery = req.query?.status;
    if (statusQuery !== undefined && !normalizeStatus(statusQuery)) {
      throw new AppError('Status filter must be "pending" or "completed".', 400);
    }

    const status = normalizeStatus(statusQuery);
    const filter = status ? { status } : {};

    const tasks = await Task.find(filter).sort({ createdAt: -1 }).lean();
    res.json(tasks);
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(getSafeMessage(error, "Failed to fetch tasks."), 500));
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new AppError("Invalid task id.", 400);
    }

    const update = validateUpdatePayload(req.body);

    const task = await Task.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!task) throw new AppError("Task not found.", 404);
    res.json(task);
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(getSafeMessage(error, "Failed to update task."), 500));
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new AppError("Invalid task id.", 400);
    }

    const task = await Task.findByIdAndDelete(id);
    if (!task) throw new AppError("Task not found.", 404);

    res.status(204).send();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(getSafeMessage(error, "Failed to delete task."), 500));
  }
};

