export class User {
  constructor({
    id = null,
    username,
    yourname,
    email,
    phone = "",
    dob = "", // ngày sinh
    province = "",
    district = "",
    password = "",
    role = ""
  }) {
    //username
    const usernameRegex = /^[a-zA-Z0-9]{4,12}$/;
    if (!username || !usernameRegex.test(username)) {
      throw new Error("Tên tài khoản phải từ 4-12 ký tự, chỉ gồm chữ và số");
    }

    //họ tên
    const nameRegex = /^[\p{L}\s]+$/u;
    if (!yourname || !nameRegex.test(yourname)) {
      throw new Error("Họ và tên chỉ được chứa chữ cái và khoảng trắng");
    }

    //email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error("Email không hợp lệ");
    }

    //số điện thoại
    const phoneRegex = /^\+84\d{9,10}$/;
    if (phone && !phoneRegex.test(phone)) {
      throw new Error("Số điện thoại phải có định dạng +84xxxxxxxxx");
    }

    //mật khẩu
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!password || !passwordRegex.test(password)) {
      throw new Error("Mật khẩu phải ít nhất 8 ký tự, gồm chữ và số");
    }

    //role
    if (!["student", "teacher"].includes(role)) {
      throw new Error("Vai trò phải là 'student' hoặc 'teacher'");
    }

    //ngày sinh
    if (dob && isNaN(Date.parse(dob))) {
      throw new Error("Ngày sinh không hợp lệ");
    }

    this.id = id || Date.now().toString();
    this.username = username;
    this.yourname = yourname;
    this.email = email;
    this.phone = phone;
    this.dob = dob;
    this.province = province;
    this.district = district;
    this.password = password;
    this.role = role;
  }

  save() {
    const users = UserManager.getAllUsers();

    // kiểm tra trùng username
    const exists = Object.values(users).some((u) => u.username === this.username);
    if (exists) {
      throw new Error("Tên tài khoản đã tồn tại");
    }

    if (UserManager.isEmailTaken(this.email)) {
      throw new Error("Email đã được sử dụng");
    }

    users[this.id] = this; // lưu theo id
    UserManager.saveAllUsers(users);
  }

  static loadCurrent() {
    const id = UserManager.getCurrentUser();
    const users = UserManager.getAllUsers();
    if (id && users[id]) {
      return new User(users[id]);
    }
    return null;
  }
}

export class UserManager {
  static getAllUsers() {
    try {
      return JSON.parse(localStorage.getItem("listusers")) || {};
    } catch (e) {
      console.error("Lỗi đọc dữ liệu:", e);
      return {};
    }
  }

  static saveAllUsers(users) {
    localStorage.setItem("listusers", JSON.stringify(users));
  }

  static getCurrentUser() {
    return localStorage.getItem("currentUser");
  }

  static setCurrentUser(id) {
    localStorage.setItem("currentUser", id);
  }

  static userExistsById(id) {
    return !!this.getAllUsers()[id];
  }

  static userExistsByUsername(username) {
    return Object.values(this.getAllUsers()).some((u) => u.username === username);
  }

  static isEmailTaken(email) {
    return Object.values(this.getAllUsers()).some((u) => u.email === email);
  }

  static validateLogin(username, password, role = null) {
    const users = this.getAllUsers();
    const user = Object.values(users).find((u) => u.username === username);
    if (!user) return false;
    if (user.password !== password) return false;
    if (role && user.role !== role) return false;
    return true;
  }

  static getPasswordByEmail(email) {
    const users = this.getAllUsers();
    const user = Object.values(users).find((u) => u.email === email);
    return user ? user.password : null;
  }

  static getUserById(id) {
    return this.getAllUsers()[id] || null;
  }

  static getUserByUsername(username) {
    return Object.values(this.getAllUsers()).find((u) => u.username === username) || null;
  }
}
