const data = [
  { label: "Nghe", value: 120 },
  { label: "Đọc", value: 180 },
  { label: "Viết", value: 90 },
  { label: "Từ vựng", value: 220 },
  { label: "Ngữ pháp", value: 160 },
];

const chart = document.getElementById("chart");
const labelRow = document.getElementById("labelRow");

data.forEach((item, index) => {
  const group = document.createElement("div");
  group.className = "bar-group";

  const bar = document.createElement("div");
  bar.className = "bar";
  bar.style.height = item.value + "px";
  bar.textContent = item.value;

  group.appendChild(bar);
  chart.appendChild(group);

  const label = document.createElement("div");
  label.className = "label";
  label.textContent = item.label;
  labelRow.appendChild(label);
});
