const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.style.border = '1px solid black';

let points = [];
let bezierIndex = [];
let grabbedPoint = null;

points.push({x: 200, y: 400, w: 20, c: 'red', name: 'P0'});
points.push({x: 400, y: 200, w: 20, c: 'blue', name: 'P1'});
points.push({x: 600, y: 600, w: 20, c: 'blue',  name: 'P2'});
points.push({x: 800, y: 400, w: 20, c: 'red', name: 'P3'});

bezierIndex.push(0);

let isDragging = false;

function getMousePos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    scaleX = canvas.width / rect.width;
    scaleY = canvas.height / rect.height;
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

function mouseDown(e) {
    e.preventDefault();
    const pos = getMousePos(canvas, e);
    for(let point of points) {
        if(isMouseTouching(point, pos)){
            grabbedPoint = point;
            isDragging = true;
            return;
        }
    }
}

function rightClick(e) {
    e.preventDefault();
    const pos = getMousePos(canvas, e);
    bezierIndex.push(bezierIndex[bezierIndex.length - 1] + 3);

    let i = points.length - 1;

    let interPos1 = {x: (pos.x - points[i].x) / 3 + points[i].x, y: points[i].y - 2 * (points[i].y - pos.y) / 3};
    let interPos2 = {x: 2 * (pos.x - points[i].x) / 3 + points[i].x, y: points[i].y + 2 * (points[i].y - pos.y) / 3};

    if(interPos1.x < 0) interPos1.x = 20;
    if(interPos1.x > canvas.width) interPos1.x = canvas.width - 20;
    if(interPos1.y < 0) interPos1.y = 20;
    if(interPos1.y > canvas.height) interPos1.y = canvas.height - 20;

    if(interPos2.x < 0) interPos2.x = 20;
    if(interPos2.x > canvas.width) interPos2.x = canvas.width - 20;
    if(interPos2.y < 0) interPos2.y = 20;
    if(interPos2.y > canvas.height) interPos2.y = canvas.height - 20;

    points.push({x: interPos1.x, y: interPos1.y, w: 20, c: 'blue', name: `P${i+1}`});
    points.push({x: interPos2.x, y: interPos2.y, w: 20, c: 'blue',  name: `P${i+1}`});
    points.push({x: pos.x, y: pos.y, w: 20, c: 'red', name: `P${i+3}`});

    drawPoints();
}

function mouseUp(e) {
    if(!isDragging) return;

    e.preventDefault();
    isDragging = false;
}

function mouseMove(e) {

    if(!isDragging) return;

    e.preventDefault();
    const pos = getMousePos(canvas, e);

    grabbedPoint.x = pos.x;
    grabbedPoint.y = pos.y;

    drawPoints();

}

function isMouseTouching(point, pos) {
    return Math.abs(pos.x - point.x) < point.w && Math.abs(pos.y - point.y) < point.w;
}

function drawBezierCurve(controlPoints) {
    let t;
    let x, y;

    controlPoints = points;

    ctx.lineWidth = 5;
    ctx.strokeStyle = 'black';

    for(let i of bezierIndex) {
        ctx.beginPath();
        ctx.moveTo(controlPoints[i].x, controlPoints[i].y);

        for (t = 0; t <= 1; t += 0.01) {
            x = Math.pow(1 - t, 3) * controlPoints[i].x +
                3 * Math.pow(1 - t, 2) * t * controlPoints[i+1].x +
                3 * (1 - t) * Math.pow(t, 2) * controlPoints[i+2].x +
                Math.pow(t, 3) * controlPoints[i+3].x;
            y = Math.pow(1 - t, 3) * controlPoints[i].y +
                3 * Math.pow(1 - t, 2) * t * controlPoints[i+1].y +
                3 * (1 - t) * Math.pow(t, 2) * controlPoints[i+2].y +
                Math.pow(t, 3) * controlPoints[i+3].y;

            ctx.lineTo(x, y);
        }

        ctx.stroke();
    }
}

function drawConnectingLines() {

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'gray';

    for(let i of bezierIndex) {
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[i+1].x, points[i+1].y);
        ctx.lineTo(points[i+2].x, points[i+2].y);
        ctx.lineTo(points[i+3].x, points[i+3].y);
        ctx.stroke();
    }
}

function drawPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showPointInfo();
    drawConnectingLines();
    drawBezierCurve();
    for(let point of points) {
        ctx.beginPath();
        ctx.fillStyle = point.c;
        ctx.arc(point.x, point.y, point.w, 0, 2 * Math.PI);
        ctx.fill();
    }
}

drawPoints();
canvas.onmousedown = mouseDown;
canvas.onmouseup = mouseUp;
canvas.onmousemove = mouseMove;
canvas.oncontextmenu = rightClick;

// elements

function showPointInfo() {

    const pointInfo = document.getElementById('pointInfo');
    pointInfo.innerHTML = '';

    for(let point of points) {
        let newPoint = document.createElement('div');
        newPoint.id = point.x + '-' + point.y;
        newPoint.className = 'point';
        newPoint.innerHTML = `${point.name} = (${point.x.toFixed(2)}, ${point.y.toFixed(2)})`;
        pointInfo.appendChild(newPoint);
    }

}

showPointInfo();
