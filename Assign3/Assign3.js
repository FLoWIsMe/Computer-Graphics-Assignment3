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
var triangleLocationBuffer = Array(0);


//JIEQIONG: This function is going to initialize our stuff
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //-------------------------------------------------
    //  Load shaders and initialize attribute buffers
    shaderProgram = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( shaderProgram );

    //JIEQIONG: Once we have attached the shader, we want to tell it 
    //what the vertex attributes are because WebGL needs us to 
    //tell it what those values are.
    //It may even be smart to write an InitializeShaders function
    //First, I get all of my attribute variables from my shader 
    //program, look there and come back
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");

    //I need to enable my vertex attributes    
    gl.enableVertexAttribArray( shaderProgram.vertexPositionAttribute );

    //JIEQIONG: I also need to tell the shader program where my 
    //uniform variables are
    //HINT: I left this uncommented part out as an example
    //See how forgiving .js is, I can just tack on .xxx things
    //to my vars and it will save those
    //Here, the .mvMatrixUniform is just a variable name I use
    //You will need to get the uniformLocation of several things
    //shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "MVMatrix");

    
    //---------------------------------------------------
    //JIEQIONG: Now I need to load the data into the GPU
    //First, I bind an ID to my triangle data
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, triangleVertexPositionBuffer );

    //JIEQIONG: Then I define the vertices
    var triangleVertices = [
        vec3(  0,  1, 0 ),
        vec3(  -1,  -1, 0 ),
        vec3( 1,  -1, 0 ),
    ];

    //JIEQIONG: Then I load those vertices into the buffer
    gl.bufferData( gl.ARRAY_BUFFER, flatten(triangleVertices), gl.STATIC_DRAW );

    //JIEQIONG: Then I save some other features of the buffer
    //First, itemSize is the dimensions of my vertex
    //numItems is the number of vertices
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = 3;


    //JIEQIONG: Repeat something similar below for a triangle

    //--------------------------------------
    //JIEQIONG: Initialize my event listeners
    canvas.addEventListener("mousedown", function(event) {
    
       //JIEQIONG: Will this work for everything?  You need to think 
       //really really hard about why I did the next two lines
       //and what these positions mean.  HINT: Come to class
       var posX = 2*event.clientX/canvas.width-1;
       var posY = 2*(canvas.height-event.clientY)/canvas.height-1;

    });

 
    render();
};

//------------------------------------------------------------
function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    //JIEQIONG: Draw the triangle
    //First, tell it which data buffer to use
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);

    //Next, tell it where the attributes are
    gl.vertexAttribPointer( shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0 );


    //Next, if you want to pass a uniform you need to pass it
    //Hint: I commented this out because this uniform doesn't
    //exist (yet). Note the flatten() command.  Data has to be 
    //passed a certain way and our MV.js lib helps with that
    //     gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, flatten(modelView));

    //Finally, draw the triangle array
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, triangleVertexPositionBuffer.numItems );
	
    window.requestAnimFrame(render);
}