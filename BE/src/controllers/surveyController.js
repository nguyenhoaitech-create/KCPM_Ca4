const surveyModel = require("../models/surveyModel");

exports.getSurveys = (req, res) => {
  const surveys = surveyModel.getAll();

  // Vá BUG-04: Xử lý phân trang
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedSurveys = surveys.slice(startIndex, endIndex);

  res.json({
    total: surveys.length,
    page: page,
    limit: limit,
    data: paginatedSurveys,
  });
};

exports.createSurvey = (req, res) => {
  const newSurvey = { id: Date.now(), ...req.body };
  const saved = surveyModel.add(newSurvey);
  res.status(201).json(saved);
};

exports.deleteSurvey = (req, res) => {
  surveyModel.delete(req.params.id);
  res.json({ message: "Đã xóa thành công" });
};
