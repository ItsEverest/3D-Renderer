var c = document.getElementById("renderCanvas");
var ctx = c.getContext("2d");
const scale = 2;
const FOV = 280;

const camera = { pos: [0, 0, 0] };

const cube = new Object();
cube.pos = [-150, -150, -200];
cube.vertices = [
    [100, 100, 100],[200, 100, 100],[200, 200, 100],[100, 200, 100],
    [100, 100, 200],[200, 100, 200],[200, 200, 200],[100, 200, 200]];
cube.edges = [
    [0, 1], [1, 2], [2, 3], [3, 0], // bottom face edges
    [4, 5], [5, 6], [6, 7], [7, 4], // top face edges
    [0, 4], [1, 5], [2, 6], [3, 7]  // vertical edges connecting top and bottom faces
];

let anim = -380;
let animreverse = 10;
let rotationX = 0;
let rotationY = 0;
let rotationZ = 0;
let rotationSpeed = 0.01;
function animate(){
    if(anim < 10){
        cube.pos[0] = anim;
        drawCube();
        rotationX += rotationSpeed;
        rotationY += rotationSpeed;
        rotationZ += rotationSpeed;
        anim+=10;
        requestAnimationFrame(animate);
    } else if(animreverse>-380){
        cube.pos[0] = animreverse;
        drawCube();
        rotationX += rotationSpeed;
        rotationY += rotationSpeed;
        rotationZ += rotationSpeed;
        animreverse-=10;
        requestAnimationFrame(animate);
    } else {
        anim = -380;
        animreverse = 10;
        requestAnimationFrame(animate);
    }
}

animate();

function drawCube(){
    ctx.clearRect(0, 0, c.width, c.height);
    for(let i = 0; i<(cube.edges).length; i++){
        const edgeStart = cube.edges[i][0];
        const edgeEnd = cube.edges[i][1];
        
        const startVertex = rotateVertex([...cube.vertices[edgeStart]], rotationX, rotationY, rotationZ);
        const endVertex = rotateVertex([...cube.vertices[edgeEnd]], rotationX, rotationY, rotationZ);


        const startX = projectedX(startVertex) * scale + c.width / 2;
        const startY = projectedY(startVertex) * scale + c.height / 2;
        const endX = projectedX(endVertex) * scale + c.width / 2;
        const endY = projectedY(endVertex) * scale + c.height / 2;

        ctx.strokeStyle = "blue";
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();        
    }
}

function rotateVertex(vertex, rotationX, rotationY, rotationZ){
    let x = vertex[0];
    let y = vertex[1];
    let z = vertex[2];

    vertex[1] = y * Math.cos(rotationX) - z * Math.sin(rotationX);
    vertex[2] = y * Math.sin(rotationX) + z * Math.cos(rotationX);

    y = vertex[1];
    z = vertex[2];
    vertex[0] = x * Math.cos(rotationY) + z * Math.sin(rotationY);
    vertex[2] = -x * Math.sin(rotationY) + z * Math.cos(rotationY);

    x = vertex[0];
    y = vertex[1];
    vertex[0] = x * Math.cos(rotationZ) - y * Math.sin(rotationZ);
    vertex[1] = x * Math.sin(rotationZ) + y * Math.cos(rotationZ);

    return vertex;
}

function projectedX(pos){
    console.log(pos[2]-cube.pos[2]-camera.pos[2]+FOV);
    let projectedX = ((pos[0]+cube.pos[0]-camera.pos[0])*FOV)/(pos[2]+cube.pos[2]-camera.pos[2]+FOV)
    console.log(projectedX)
    return projectedX;
}

function projectedY(pos){
    let projectedY = ((pos[1]+cube.pos[1]-camera.pos[1])*FOV)/(pos[2]+cube.pos[2]-camera.pos[2]+FOV)
    return projectedY;
}


