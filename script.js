// 项目动态生成
const projects = [
  { name: "医学影像知识图谱", desc: "基于超声影像构建的知识图谱" },
  { name: "虚假新闻检测系统", desc: "多模态深度学习项目" },
  { name: "MRI图像处理项目", desc: "磁共振图像分析与重建" }
];

const container = document.getElementById("project-container");
projects.forEach(p => {
  const div = document.createElement("div");
  div.innerHTML = `<h3>${p.name}</h3><p>${p.desc}</p>`;
  container.appendChild(div);
});

// Cytoscape.js 医学影像知识图谱
const cy = cytoscape({
  container: document.getElementById('cy'),
  elements: [
    { data: { id: '超声' } },
    { data: { id: 'MRI' } },
    { data: { id: 'X线' } },
    { data: { id: '核医学' } },
    { data: { source: '超声', target: 'MRI', label: '辅助诊断' } },
    { data: { source: 'MRI', target: 'X线', label: '比较分析' } }
  ],
  style: [
    { selector: 'node', style: { 'background-color': '#0074D9', 'label': 'data(id)', 'color': '#fff', 'text-valign': 'center', 'text-halign': 'center' } },
    { selector: 'edge', style: { 'width': 2, 'line-color': '#ccc', 'target-arrow-color': '#ccc', 'target-arrow-shape': 'triangle', 'label': 'data(label)', 'font-size': '10px' } }
  ],
  layout: { name: 'circle' }
});
