let surveys = [
  {
    id: 1,
    name: "Ngã tư Hàng Xanh",
    category: "intersection",
    trafficFlow: "high",
    roadCondition: "good",
    laneCount: 4,
    description: "Khu vực đông đúc",
    lat: 10.8016,
    lng: 106.7112,
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Bến xe Miền Đông",
    category: "station",
    trafficFlow: "congested",
    roadCondition: "fair",
    laneCount: 3,
    description: "Cửa ngõ bến xe",
    lat: 10.8116,
    lng: 106.7162,
    timestamp: new Date().toISOString(),
  },
];

exports.getAll = () => surveys;
exports.add = (survey) => {
  surveys.push(survey);
  return survey;
};
exports.delete = (id) => {
  surveys = surveys.filter((s) => s.id != id);
};
