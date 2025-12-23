/*Fake dashborad */

// Giả lập dữ liệu
const stats = {
  users: 1245,
  courses: 37,
  sessions: 8230,
  revenue: 95600000,
};

const newUsers = [
  { name: "Nguyễn Văn A", email: "a@gmail.com", date: "2025-10-01" },
  { name: "Trần Thị B", email: "b@gmail.com", date: "2025-10-03" },
  { name: "Lê Văn C", email: "c@gmail.com", date: "2025-10-07" },
  { name: "Phạm Thị D", email: "d@gmail.com", date: "2025-10-10" },
];

const chartData = [
  { month: "Tháng 1", value: 120 },
  { month: "Đọc", value: 180 },
  { month: "Viết", value: 90 },
  { month: "Từ vựng", value: 220 },
  { month: "Ngữ pháp", value: 160 },
];

/*fake user-manage */
const users = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "a@gmail.com",
    role: "teacher",
    created: "2024-10-01",
    status: "Hoạt động",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "b@gmail.com",
    role: "student",
    created: "2024-10-03",
    status: "Khóa",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "c@gmail.com",
    role: "student",
    created: "2024-10-05",
    status: "Hoạt động",
  },
];

/* fake course */
const courses = [
  {
    id: 1,
    namecourse: "HTML cơ bản",
    desc: "Toeic 750+",
    role: "TOEIC",
    teacher: "Nguyễn Minh",
  },
  {
    id: 2,
    namecourse: "HTML cơ bản",
    desc: "Toeic 750+",
    role: "TOEIC",
    teacher: "Nguyễn Minh",
  },
  {
    id: 3,
    namecourse: "HTML cơ bản",
    desc: "Toeic 750+",
    role: "TOEIC",
    teacher: "Nguyễn Minh",
  },
];

/*fake test */
const tests = [
  {
    id: 1,
    name: "Kiểm tra giữa kỳ",
    course: "Java Cơ bản",
    date: "2024-10-01",
    status: "Đang hoạt động",
  },
  {
    id: 2,
    name: "Cuối kỳ Python",
    course: "Python Nâng cao",
    date: "2024-11-02",
    status: "Ẩn",
  },
];

/*fake paying */

/*fake report */
const reportData = {
  users: { teachers: 12, students: 105, active: 95, locked: 10 },
  courses: { total: 18, active: 14, upcoming: 3, closed: 1 },
  payments: { revenue: "18,250,000đ", pending: "2,500,000đ" },
};
