// //JIEQIONG: My Global Variables
// var canvas;
// var gl;

// // Global Variables
// var squareVertexPositionBuffer; // Daelyn: For square geometry
// var shapes = []; // Daelyn: Store details about shapes to draw (position, type, color, rotation)


// //JIEQIONG: This keeps track of all the shader code
// var shaderProgram;

// //JIEQIONG: These are your global variables for the geometry
// //HINT: You will need to add more!
// var triangleVertexPositionBuffer;

// //JIEQIONG: Here you want variables for animation
// //HINT: The modelView is a matrix
// var modelView;

// //HINT: I would probably use a bunch of these for storing
// //all the stuff I need from the mouse clicks, the arrays let
// //you push stuff, very useful!
// var triangleLocationBuffer = Array(0);


// //JIEQIONG: This function is going to initialize our stuff
// window.onload = function init()
// {
//     canvas = document.getElementById( "gl-canvas" );

//     gl = WebGLUtils.setupWebGL( canvas );
//     if ( !gl ) { alert( "WebGL isn't available" ); }

//     //  Configure WebGL
//     gl.viewport( 0, 0, canvas.width, canvas.height );
//     gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

//     //-------------------------------------------------
//     //  Load shaders and initialize attribute buffers
//     shaderProgram = initShaders( gl, "vertex-shader", "fragment-shader" );
//     gl.useProgram( shaderProgram );

//     //JIEQIONG: Once we have attached the shader, we want to tell it 
//     //what the vertex attributes are because WebGL needs us to 
//     //tell it what those values are.
//     //It may even be smart to write an InitializeShaders function
//     //First, I get all of my attribute variables from my shader 
//     //program, look there and come back
//     shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");

//     //I need to enable my vertex attributes    
//     gl.enableVertexAttribArray( shaderProgram.vertexPositionAttribute );

//     //JIEQIONG: I also need to tell the shader program where my 
//     //uniform variables are
//     //HINT: I left this uncommented part out as an example
//     //See how forgiving .js is, I can just tack on .xxx things
//     //to my vars and it will save those
//     //Here, the .mvMatrixUniform is just a variable name I use
//     //You will need to get the uniformLocation of several things
//     //shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "MVMatrix");

    
//     //---------------------------------------------------
//     //JIEQIONG: Now I need to load the data into the GPU
//     //First, I bind an ID to my triangle data
//     triangleVertexPositionBuffer = gl.createBuffer();
//     gl.bindBuffer( gl.ARRAY_BUFFER, triangleVertexPositionBuffer );

//     // //JIEQIONG: Then I define the vertices
//     // var triangleVertices = [
//     //     vec3(  0,  1, 0 ),
//     //     vec3(  -1,  -1, 0 ),
//     //     vec3( 1,  -1, 0 ),
//     // ];

//     // Daelyn: Similar initialization as for the triangle, but with square vertices
//     squareVertexPositionBuffer = gl.createBuffer();
//     // Daelyn: Bind, define vertices for a square, and set itemSize and numItems
//     // TODO
//     // Triangle vertices
//     var triangleVertices = [
//         vec3(0.0,  0.5, 0.0),  // Daelyn: Top left vertexx
//         vec3(-0.5, -0.5, 0.0), // Daelyn: Bottom left vertex
//         vec3(0.5, -0.5, 0.0),  // Daelyn: Bottom right vertex
//     ];

//     //JIEQIONG: Then I load those vertices into the buffer
//     gl.bufferData( gl.ARRAY_BUFFER, flatten(triangleVertices), gl.STATIC_DRAW );

//     //JIEQIONG: Then I save some other features of the buffer
//     //First, itemSize is the dimensions of my vertex
//     //numItems is the number of vertices
//     triangleVertexPositionBuffer.itemSize = 3;
//     triangleVertexPositionBuffer.numItems = 3;


//     //JIEQIONG: Repeat something similar below for a triangle
//     // Daelyn: Define square vertices to form two triangles that make up the square
//     var squareVertices = [
//         -0.5,  0.5, 0.0, // Daelyn: Top left vertex
//         -0.5, -0.5, 0.0, // Daelyn: Bottom left vertex
//         0.5,  0.5, 0.0,  // Daelyn: Top right vertex

//         0.5,  0.5, 0.0,  // Daelyn: Top right vertex (repeated for the second triangle)
//         -0.5, -0.5, 0.0, // Daelyn: Bottom left vertex (repeated for the second triangle)
//         0.5, -0.5, 0.0,  // Daelyn: Bottom right vertex
//     ];

//     // Daelyn: Initialize square vertex buffer
//     squareVertexPositionBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVertices), gl.STATIC_DRAW);
//     squareVertexPositionBuffer.itemSize = 3; // Daelyn: Because we have x, y, z coordinates
//     squareVertexPositionBuffer.numItems = 6; // Daelyn: Six vertices in total



//     //--------------------------------------
//     //JIEQIONG: Initialize my event listeners
//     canvas.addEventListener("mousedown", function(event) {
    
//        //JIEQIONG: Will this work for everything?  You need to think 
//        //really really hard about why I did the next two lines
//        //and what these positions mean.  HINT: Come to class
//        var posX = 2*event.clientX/canvas.width-1;
//        var posY = 2*(canvas.height-event.clientY)/canvas.height-1;
//        // Daelyn: my modifications to event listener
//        var shapeType = Math.random() < 0.5 ? "triangle" : "square"; // Daelyn: Randomly choose shape
//        var color = [Math.random(), Math.random(), Math.random(), 1.0]; // Daelyn: Random RGBA color
//        var rotationSpeed = Math.random() * 0.1; // Daelyn: Random rotation speed
//        shapes.push({type: shapeType, position: [posX, posY], color: color, rotationSpeed: rotationSpeed});

//     });

 
//     render();
// };

// //------------------------------------------------------------
// function render() {

//     // gl.clear( gl.COLOR_BUFFER_BIT );

//     // //JIEQIONG: Draw the triangle
//     // //First, tell it which data buffer to use
//     // gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);

//     // //Next, tell it where the attributes are
//     // gl.vertexAttribPointer( shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0 );


//     // //Next, if you want to pass a uniform you need to pass it
//     // //Hint: I commented this out because this uniform doesn't
//     // //exist (yet). Note the flatten() command.  Data has to be 
//     // //passed a certain way and our MV.js lib helps with that
//     // //     gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, flatten(modelView));

//     // //Finally, draw the triangle array
//     // gl.drawArrays( gl.TRIANGLE_STRIP, 0, triangleVertexPositionBuffer.numItems );
	
//     // window.requestAnimFrame(render);

//     // Daelyn: my own render function
//     var currentTime = Date.now();
//     gl.clear(gl.COLOR_BUFFER_BIT);

//     shapes.forEach(shape => {
//         // Daelyn: Ensure creationTime is stored when the shape is created
//         var elapsedTime = (currentTime - shape.creationTime) / 1000;
//         var rotationAngle = shape.rotationSpeed * elapsedTime;

//         // Daelyn: Choose the buffer based on the shape type
//         var buffer = shape.type === "triangle" ? triangleVertexPositionBuffer : squareVertexPositionBuffer;
//         gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

//         // Daelyn: Associate shader attributes with the current buffer
//         gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, buffer.itemSize, gl.FLOAT, false, 0, 0);

//         // Daelyn: Set up transformations for the shape
//         var modelViewMatrix = mat4.create();
//         mat4.translate(modelViewMatrix, modelViewMatrix, [shape.position[0], shape.position[1], 0]);
//         mat4.rotate(modelViewMatrix, modelViewMatrix, rotationAngle, [0, 0, 1]);
//         mat4.scale(modelViewMatrix, modelViewMatrix, [shape.scale, shape.scale, 1.0]); // Daelyn: Ensure scale is set

//         // Daelyn: Pass transformation matrix to the shader
//         gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, modelViewMatrix);

//         // Daelyn: Set shape color and draw the shape
//         gl.uniform4fv(shaderProgram.fragmentColorUniform, new Float32Array(shape.color));
//         gl.drawArrays(gl.TRIANGLES, 0, buffer.numItems);
//     });

//     window.requestAnimationFrame(render); 
    
// }

// My stuff below:
// Daelyn: Added Global Variables
var canvas;
var gl;
var squareVertexPositionBuffer;
var triangleVertexPositionBuffer;
var shapes = []; // Daelyn: Store details: position, type, color, scale, rotation
var shaderProgram;
var mvMatrixUniform;
var fragColorUniform;

function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    // Daelyn: Getting uniform locations
    mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    fragColorUniform = gl.getUniformLocation(shaderProgram, "uFragColor");

    initializeBuffers(); // Daelyn: Initialize the buffers for triangle and square
    initializeEventListeners(); // Daelyn: Set up the event listener for mouse clicks

    render();
}

function initializeBuffers() {
    // Daelyn: Initialize triangle buffer
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    var triangleVertices = [0.0, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = 3;

    // Daelyn: Initialize square buffer
    squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    var squareVertices = [-0.5, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, 0.5, 0.0, 0.5, -0.5, 0.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = 4; // Daelyn: Two triangles forming a square
}

function initializeEventListeners() {
    canvas.addEventListener("mousedown", function(event) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        var posX = 2 * x / canvas.width - 1;
        var posY = 2 * (canvas.height - y) / canvas.height - 1;

        var shapeType = Math.random() < 0.5 ? "triangle" : "square";
        var color = [Math.random(), Math.random(), Math.random(), 1.0];
        var scale = Math.random() * 0.5 + 0.5;
        var rotationSpeed = Math.random() * 2 * Math.PI;

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

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    shapes.forEach(function(shape) {
        var buffer = shape.type === "triangle" ? triangleVertexPositionBuffer : squareVertexPositionBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, buffer.itemSize, gl.FLOAT, false, 0, 0);

        // Daelyn: Prepare the model-view matrix using MV.js functions
        var mvMatrix = mat4(); // Creates a new identity matrix
        mvMatrix = mult(mvMatrix, translate(shape.position[0], shape.position[1], 0.0));
        mvMatrix = mult(mvMatrix, rotate(shape.rotation, [0, 0, 1]));
        mvMatrix = mult(mvMatrix, scalem(shape.scale, shape.scale, 1.0));

        // Daelyn: Update rotation
        shape.rotation += shape.rotationSpeed / 60.0; // Daelyn: Assuming 60 FPS

        // Pass the model-view matrix and color to the shader
        gl.uniformMatrix4fv(mvMatrixUniform, false, flatten(mvMatrix));
        gl.uniform4fv(fragColorUniform, shape.color);

        gl.drawArrays(shape.type === "triangle" ? gl.TRIANGLES : gl.TRIANGLE_STRIP, 0, buffer.numItems);
    });

    requestAnimationFrame(render);
}

window.onload = init;