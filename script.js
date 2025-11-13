// 导航条交互
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// 滚动时导航条样式变化
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
});

// 滚动到指定区域
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// 进度条动画
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
    });
}

// 使用Intersection Observer API来触发进度条动画
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateProgressBars();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

observer.observe(document.getElementById('achievements'));

// 磁共振成像知识图谱
function createKnowledgeGraph() {
    const width = document.getElementById('mri-knowledge-graph').clientWidth;
    const height = document.getElementById('mri-knowledge-graph').clientHeight;
    
    // 清除现有内容
    d3.select("#mri-knowledge-graph").html("");
    
    // 创建SVG
    const svg = d3.select("#mri-knowledge-graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    
    // 创建缩放行为
    const zoom = d3.zoom()
        .scaleExtent([0.5, 3])
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });
    
    svg.call(zoom);
    
    // 创建组用于缩放
    const g = svg.append("g");
    
    // 定义节点和链接数据
    const nodes = [
        { id: "mri", name: "磁共振成像", group: "imaging" },
        { id: "t1", name: "T1加权", group: "imaging" },
        { id: "t2", name: "T2加权", group: "imaging" },
        { id: "flair", name: "FLAIR序列", group: "imaging" },
        { id: "diffusion", name: "弥散加权", group: "imaging" },
        { id: "brain", name: "脑部", group: "anatomy" },
        { id: "spine", name: "脊柱", group: "anatomy" },
        { id: "abdomen", name: "腹部", group: "anatomy" },
        { id: "ms", name: "多发性硬化", group: "pathology" },
        { id: "tumor", name: "脑肿瘤", group: "pathology" },
        { id: "stroke", name: "脑卒中", group: "pathology" },
        { id: "herniation", name: "椎间盘突出", group: "pathology" },
        { id: "diagnosis", name: "疾病诊断", group: "clinical" },
        { id: "treatment", name: "治疗规划", group: "clinical" },
        { id: "monitoring", name: "疗效监测", group: "clinical" }
    ];
    
    const links = [
        { source: "mri", target: "t1" },
        { source: "mri", target: "t2" },
        { source: "mri", target: "flair" },
        { source: "mri", target: "diffusion" },
        { source: "t1", target: "brain" },
        { source: "t2", target: "brain" },
        { source: "flair", target: "brain" },
        { source: "diffusion", target: "brain" },
        { source: "t1", target: "spine" },
        { source: "t2", target: "spine" },
        { source: "t1", target: "abdomen" },
        { source: "t2", target: "abdomen" },
        { source: "brain", target: "ms" },
        { source: "brain", target: "tumor" },
        { source: "brain", target: "stroke" },
        { source: "spine", target: "herniation" },
        { source: "ms", target: "diagnosis" },
        { source: "tumor", target: "diagnosis" },
        { source: "stroke", target: "diagnosis" },
        { source: "herniation", target: "diagnosis" },
        { source: "diagnosis", target: "treatment" },
        { source: "treatment", target: "monitoring" }
    ];
    
    // 颜色映射
    const color = d3.scaleOrdinal()
        .domain(["imaging", "anatomy", "pathology", "clinical"])
        .range(["#3498db", "#2ecc71", "#e74c3c", "#f39c12"]);
    
    // 创建力导向图模拟
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(50));
    
    // 创建链接
    const link = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 2);
    
    // 创建节点
    const node = g.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 20)
        .attr("fill", d => color(d.group))
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    
    // 添加节点标签
    const labels = g.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .text(d => d.name)
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr("font-size", 12)
        .attr("fill", "#333");
    
    // 鼠标悬停效果
    node.on("mouseover", function(event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 25);
        
        // 高亮相关节点和链接
        link.attr("stroke", l => 
            l.source.id === d.id || l.target.id === d.id ? color(d.group) : "#999"
        ).attr("stroke-width", l => 
            l.source.id === d.id || l.target.id === d.id ? 3 : 2
        );
    })
    .on("mouseout", function(event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 20);
        
        // 恢复链接样式
        link.attr("stroke", "#999")
            .attr("stroke-width", 2);
    });
    
    // 更新模拟时的位置
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
        
        labels
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    });
    
    // 拖拽函数
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    
    // 图谱控制按钮
    document.getElementById('graph-reset').addEventListener('click', () => {
        svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity);
    });
    
    document.getElementById('graph-zoom-in').addEventListener('click', () => {
        svg.transition()
            .duration(750)
            .call(zoom.scaleBy, 1.5);
    });
    
    document.getElementById('graph-zoom-out').addEventListener('click', () => {
        svg.transition()
            .duration(750)
            .call(zoom.scaleBy, 0.75);
    });
}

// 联系表单提交
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 获取表单数据
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // 这里可以添加表单提交逻辑，比如发送到服务器
    alert(`感谢 ${name} 的留言！我会尽快回复您。`);
    
    // 重置表单
    this.reset();
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 创建知识图谱
    createKnowledgeGraph();
    
    // 窗口大小变化时重新绘制知识图谱
    window.addEventListener('resize', createKnowledgeGraph);
});
