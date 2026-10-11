Feature("SurveyMap");

Scenario(
  "TC-SUR-01: Thêm điểm khảo sát thành công khi đã có vị trí",
  ({ I }) => {
    // 1. Chỉ cần gọi 1 dòng này, bot sẽ tự động mở trang và đăng nhập!
    I.login();

    // 2. Click lấy vị trí GPS
    I.click('[data-testid="btn-get-location"]');
    I.wait(2);

    // 3. Bấm nút Thêm điểm khảo sát
    I.waitForElement('[data-testid="btn-add-marker-floating"]', 5);
    I.click('[data-testid="btn-add-marker-floating"]');

    // 4. Điền thông tin vào form khảo sát
    I.fillField('[data-testid="input-point-name"]', "Ngã tư Hàng Xanh");
    I.selectOption('[data-testid="select-point-category"]', "intersection");

    // 5. Gửi dữ liệu
    I.click('[data-testid="btn-submit-survey"]');

    // 6. Xác minh hệ thống báo thành công
    I.waitForText("Đã thêm: Ngã tư Hàng Xanh", 5);
  },
);
