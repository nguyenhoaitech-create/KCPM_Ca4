
exports.getSurveys = (req, res) => {
    return res.status(200).json({
        total: 1,
        page: 1,
        limit: 100,
        data: [
            { id: 1, title: "Khảo sát vị trí GPS", status: "Active" }
        ]
    });
};

exports.createSurvey = (req, res) => {
    const newSurvey = { id: Date.now(), ...req.body };
    return res.status(201).json(newSurvey);
};

exports.deleteSurvey = (req, res) => {
    return res.status(200).json({ message: "Đã xóa thành công" });
};