const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.style.border = '1px solid black';

let points = [];
let grabbedPoint = null;

points.push({x: 200, y: 400, w: 20, c: 'red'});
points.push({x: 400, y: 200, w: 20, c: 'blue'});
points.push({x: 600, y: 600, w: 20, c: 'blue'});
points.push({x: 800, y: 400, w: 20, c: 'red'});

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

    controlPoints = controlPoints || points;

    ctx.lineWidth = 5;
    ctx.strokeStyle = 'black';
    
    ctx.beginPath();
    ctx.moveTo(controlPoints[0].x, controlPoints[0].y);

    for (t = 0; t <= 1; t += 0.01) {
        x = Math.pow(1 - t, 3) * controlPoints[0].x +
            3 * Math.pow(1 - t, 2) * t * controlPoints[1].x +
            3 * (1 - t) * Math.pow(t, 2) * controlPoints[2].x +
            Math.pow(t, 3) * controlPoints[3].x;
        y = Math.pow(1 - t, 3) * controlPoints[0].y +
            3 * Math.pow(1 - t, 2) * t * controlPoints[1].y +
            3 * (1 - t) * Math.pow(t, 2) * controlPoints[2].y +
            Math.pow(t, 3) * controlPoints[3].y;

        ctx.lineTo(x, y);
    }

    ctx.stroke();
}

function drawConnectingLines() {

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'gray';

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.stroke();
}

function drawPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
