//JIEQIONG: My Global Variables
var canvas;
var gl;

//JIEQIONG: This keeps track of all the shader code
var shaderProgram;

//JIEQIONG: These are your global variables for the geometry
//HINT: You will need to add more!
var triangleVertexPositionBuffer;

//JIEQIONG: Here you want variables for animation
//HINT: The modelView is a matrix
var modelView;

//HINT: I would probably use a bunch of these for storing
//all the stuff I need from the mouse clicks, the arrays let
//you push stuff, very useful!
// var triangleLocationBuffer = Array(0);

var shapes = []; // Daelyn: Store details: position, type, color, scale, rotation
var mvMatrixUniform; // Daelyn: Uniform location for the model-view matrix
var fragColorUniform; // Daelyn: Uniform location for the fragment color
var triangleVertexColorBuffer; // Daelyn: Adding buffers for the colors of triangle
var squareVertexColorBuffer; // Daelyn: Adding buffers for the colors of square



// Daelyn: Initializes WebGL context, shaders, and starts the render loop
function init() {
    canvas = document.getElementById("gl-canvas"); // Daelyn: Get canvas element by its ID
    gl = WebGLUtils.setupWebGL(canvas); // Daelyn: Initialize the WebGL context
    if (!gl) { alert("WebGL isn't available"); } // Daelyn: Alert if WebGL is not available

    gl.viewport(0, 0, canvas.width, canvas.height); // Daelyn: Set the viewport to cover the canvas
    gl.clearColor(1.0, 1.0, 1.0, 1.0); // Daelyn: Set the clear color to white

    // Daelyn: Initialize shader program and use it
    shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(shaderProgram);

    // Daelyn: Get and enable the vertex position attribute location
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    // Daelyn: Get and enable the vertex color attribute location
    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);


    // Daelyn: Getting uniform locations for the model-view matrix and the fragment color
    mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    // fragColorUniform = gl.getUniformLocation(shaderProgram, "uFragColor");

    initializeBuffers(); // Daelyn: Initialize buffers for storing vertices of triangles and squares
    initializeEventListeners(); // Daelyn: Setup event listener for mouse clicks to create shapes

    render(); // Daelyn: Start the rendering loop
}

//------------------------------------------------------------
// Daelyn: Initializes vertex buffers for triangle and square shapes
function initializeBuffers() {
    // Daelyn: Initialize triangle vertex buffer and define vertices
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    var triangleVertices = [0.0, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = 3;

    // Daelyn: Initialize triangle color buffer
    triangleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    var triangleColors = [];
    for (var i = 0; i < 3; i++) {
        // Daelyn: Generate random colors for each vertex of the triangle
        triangleColors = triangleColors.concat([Math.random(), Math.random(), Math.random(), 1.0]);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleColors), gl.STATIC_DRAW);
    triangleVertexColorBuffer.itemSize = 4;
    triangleVertexColorBuffer.numItems = 3;

    // Daelyn: Initialize square vertex buffer and define vertices
    squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    var squareVertices = [-0.5, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, 0.5, 0.0, 0.5, -0.5, 0.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = 4; // Daelyn: Defined to make two triangles forming a square

     // Daelyn: Initialize square color buffer
     squareVertexColorBuffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
     var squareColors = [];
     for (var i = 0; i < 4; i++) {
        // Generate random colors for each vertex of the square
        squareColors = squareColors.concat([Math.random(), Math.random(), Math.random(), 1.0]);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareColors), gl.STATIC_DRAW);
    squareVertexColorBuffer.itemSize = 4;
    squareVertexColorBuffer.numItems = 4;
}

// Daelyn: Sets up event listener for mouse clicks to create shapes at click locations
function initializeEventListeners() {
    canvas.addEventListener("mousedown", function(event) {
        var rect = canvas.getBoundingClientRect(); // Daelyn: Get canvas position and size
        var x = event.clientX - rect.left; // Daelyn: Calculate x position within the canvas
        var y = event.clientY - rect.top; // Daelyn: Calculate y position within the canvas
        var posX = 2 * x / canvas.width - 1; // Daelyn: Normalize x to [-1, 1]
        var posY = 2 * (canvas.height - y) / canvas.height - 1; // Daelyn: Normalize y to [-1, 1]

        // Daelyn: Randomly choose between a triangle and a square, assign a random color, scale, and rotation speed
        var shapeType = Math.random() < 0.5 ? "triangle" : "square";
        var color = [Math.random(), Math.random(), Math.random(), 1.0];
        var scale = Math.random() * 0.5 + 0.5;
        var rotationSpeed = Math.random() * 2 * Math.PI;

        // Daelyn: Add the new shape to the shapes array with its properties
        shapes.push({
            type: shapeType,
            position: [posX, posY],
            color: color,
            scale: scale,
            rotationSpeed: rotationSpeed,
            rotation: 0
        });
    });
}

// Daelyn: Render loop to draw the shapes and handle animations
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT); // Daelyn: Clear the canvas
    shapes.forEach(function(shape) {
        var positionBuffer = shape.type === "triangle" ? triangleVertexPositionBuffer : squareVertexPositionBuffer;
        
        // Daelyn: Dynamically create and bind the color buffer for the current shape
        var colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        var colors = [];
        for (var i = 0; i < (shape.type === "triangle" ? 3 : 4); i++) {
            colors = colors.concat([Math.random(), Math.random(), Math.random(), 1.0]);
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);


        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, positionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // Daelyn: Bind the dynamically created color buffer and set the attribute pointer
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

        // Daelyn: Prepare the model-view matrix for each shape
        var mvMatrix = mat4(); // Daelyn: Create a new identity matrix
        mvMatrix = mult(mvMatrix, translate(shape.position[0], shape.position[1], 0.0));
        mvMatrix = mult(mvMatrix, rotate(shape.rotation, [0, 0, 1]));
        mvMatrix = mult(mvMatrix, scalem(shape.scale, shape.scale, 1.0));

        // Daelyn: Update shape rotation based on its speed
        shape.rotation += shape.rotationSpeed / 60.0; // Daelyn: Assuming 60 FPS for consistent animation speed

        // Daelyn: Pass the model-view matrix to the shader
        gl.uniformMatrix4fv(mvMatrixUniform, false, flatten(mvMatrix));

        // Daelyn: Draw the shape. Use `positionBuffer.numItems` for the count parameter.
        gl.drawArrays(shape.type === "triangle" ? gl.TRIANGLES : gl.TRIANGLE_STRIP, 0, positionBuffer.numItems);
    });

    requestAnimationFrame(render); // Daelyn: Request the next frame for animation
}
// // Daelyn: Alternate render function that does not have colors changing every ms (basically the version to run for those with epilepsy)
// // Daelyn: Render loop to draw the shapes and handle animations
// function render() {
//     gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas

//     shapes.forEach(function(shape) {
//         var positionBuffer = shape.type === "triangle" ? triangleVertexPositionBuffer : squareVertexPositionBuffer;

//         // Dynamically create and bind the color buffer for the current shape using its stored color
//         var colorBuffer = gl.createBuffer();
//         gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
//         var colors = [];
//         // Use the color stored in the shape's data for all its vertices
//         for (var i = 0; i < (shape.type === "triangle" ? 3 : 4); i++) {
//             colors = colors.concat(shape.color);
//         }
//         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

//         gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//         gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, positionBuffer.itemSize, gl.FLOAT, false, 0, 0);

//         gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
//         gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);


//         // Daelyn: Prepare the model-view matrix for each shape
//         var mvMatrix = mat4(); // Daelyn: Create a new identity matrix
//         mvMatrix = mult(mvMatrix, translate(shape.position[0], shape.position[1], 0.0));
//         mvMatrix = mult(mvMatrix, rotate(shape.rotation, [0, 0, 1]));
//         mvMatrix = mult(mvMatrix, scalem(shape.scale, shape.scale, 1.0));

//         // Daelyn: Update shape rotation based on its speed
//         shape.rotation += shape.rotationSpeed / 60.0; // Daelyn: Assuming 60 FPS for consistent animation speed

//         // Daelyn: Pass the model-view matrix to the shader
//         gl.uniformMatrix4fv(mvMatrixUniform, false, flatten(mvMatrix));

//         // Daelyn: Draw the shape. Use `positionBuffer.numItems` for the count parameter.
//         var drawMode = shape.type === "triangle" ? gl.TRIANGLES : gl.TRIANGLE_STRIP;
//         gl.drawArrays(drawMode, 0, positionBuffer.numItems);
//     });

//     requestAnimationFrame(render); // Daelyn: Request the next frame for animation
// }

window.onload = init; // Daelyn: Start the initialization function when the window loads
