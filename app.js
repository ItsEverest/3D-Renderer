let cubeOrigin = document.getElementById("cubeOrigin");
let cubePos = document.getElementById("cubePos");
let cubeRotation = document.getElementById("cubeRotation");
let cubeVerticies = document.getElementById("cubeVerticies");
let cubeEdges = document.getElementById("cubeEdges");


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
    [0, 1], [1, 2], [2, 3], [3, 0], // bottom edges
    [4, 5], [5, 6], [6, 7], [7, 4], // top edges
    [0, 4], [1, 5], [2, 6], [3, 7]  // vertical edges
];

// Tak ChatGPT nie chciało mi się pisać tabelek
cube.faces = [
    [0, 1, 2, 3], // Front face
    [4, 5, 6, 7], // Back face
    [0, 3, 7, 4], // Left face
    [1, 2, 6, 5], // Right face
    [0, 1, 5, 4], // Bottom face
    [3, 2, 6, 7]  // Top face
];

//Stats
cubeVerticies.innerHTML = "cube.verticies: " + cube.vertices;
cubeEdges.innerHTML = "cube.edges: " + cube.edges;

let anim = -380;
let animreverse = 10;
let rotationX = 0;
let rotationY = 0;
let rotationZ = 0;
let rotationSpeed = 0.01;
function animate(){

    if(anim < 10){
        cube.pos[0] = -380;
        drawCube();
        rotationX += rotationSpeed;
        rotationY += rotationSpeed;
        rotationZ += rotationSpeed;
        //anim+=5;
        requestAnimationFrame(animate);
    } else if(animreverse>-380){
        cube.pos[0] = animreverse;
        drawCube();
        rotationX += rotationSpeed;
        rotationY += rotationSpeed;
        rotationZ += rotationSpeed;
        animreverse-=5;
        requestAnimationFrame(animate);
    } else {
        anim = -380;
        animreverse = 10;
        requestAnimationFrame(animate);
    }

    //Stats
    cubePos.innerHTML = "cube.pos: " + cube.pos;
    cubeRotation.innerHTML = "rotation: " + rotationX + " " + rotationY + " " + rotationZ;
}

animate();

function drawCube(){
    ctx.clearRect(0, 0, c.width, c.height);

    //Calculating origin point

    const centerOffset = [
        (cube.vertices[6][0] + cube.vertices[0][0]) / 2,
        (cube.vertices[6][1] + cube.vertices[0][1]) / 2,
        (cube.vertices[6][2] + cube.vertices[0][2]) / 2
    ];


    // Edges
    const tempVerticies = [];
    for(let i = 0; i<(cube.edges).length; i++){
        const edgeStart = cube.edges[i][0];
        const edgeEnd = cube.edges[i][1];
        
        const startVertex = [...cube.vertices[edgeStart]];
        const endVertex = [...cube.vertices[edgeEnd]];

        const rotatedStart = rotateVertex(startVertex, centerOffset);
        const rotatedEnd = rotateVertex(endVertex, centerOffset);

        const startX = projectedX(rotatedStart) * scale + c.width / 2;
        const startY = projectedY(rotatedStart) * scale + c.height / 2;
        const endX = projectedX(rotatedEnd) * scale + c.width / 2;
        const endY = projectedY(rotatedEnd) * scale + c.height / 2;


        ctx.strokeStyle = "blue";
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        
    }

}



function rotateVertex(vertex, centerOffset){
   // Create a copy of the vertex coordinates
    let x = vertex[0] - centerOffset[0];
    let y = vertex[1] - centerOffset[1];
    let z = vertex[2] - centerOffset[2];

    // Rotate around X axis
    let newY = y * Math.cos(rotationX) - z * Math.sin(rotationX);
    let newZ = y * Math.sin(rotationX) + z * Math.cos(rotationX);
    y = newY;
    z = newZ;

    // Rotate around Y axis
    let newX = x * Math.cos(rotationY) + z * Math.sin(rotationY);
    newZ = -x * Math.sin(rotationY) + z * Math.cos(rotationY);
    x = newX;
    z = newZ;

    // Rotate around Z axis
    newX = x * Math.cos(rotationZ) - y * Math.sin(rotationZ);
    newY = x * Math.sin(rotationZ) + y * Math.cos(rotationZ);
    x = newX;
    y = newY;

    // Translate back
    x += centerOffset[0];
    y += centerOffset[1];
    z += centerOffset[2];

    return [x + cube.pos[0], y + cube.pos[1], z + cube.pos[2]];
}

function projectedX(pos){
    return (pos[0] - camera.pos[0]) * FOV / (pos[2] - camera.pos[2] + FOV);
}

function projectedY(pos){
    return (pos[1] - camera.pos[1]) * FOV / (pos[2] - camera.pos[2] + FOV);
}










// Camera Steering

window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
      return;
    }
    switch (event.key) {
      case "ArrowDown":
        console.log("down");
        camera.pos[1] += 10;
        break;
      case "ArrowUp":
        console.log("up");
        camera.pos[1] -= 10;
        break;
      case "ArrowLeft":
        console.log("left");
        camera.pos[0] -= 10;
        break;
      case "ArrowRight":
        console.log("right");
        camera.pos[0] += 10;
        break;
      case "s":
        console.log("s");
        camera.pos[2] -= 10;
        break;
      case "w":
        console.log("w");
        camera.pos[2] += 10;
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }
  
    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
  }, true);