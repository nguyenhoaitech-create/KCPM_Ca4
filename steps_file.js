export default function () {
  return actor({
    login: function () {
      this.amOnPage("/FE/index.html");
      this.wait(2);
      this.fillField("#login-username", "admin");
      this.fillField("#login-password", "password123");
      this.click('button[onclick="handleLogin()"]');
      this.wait(2);
    },
  });
}
