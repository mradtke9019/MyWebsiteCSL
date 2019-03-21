/**
 * Created by gleicher on 10/9/15.
 */
/*
 a second example object for graphics town
 check out "simplest" first

 the cube is more complicated since it is designed to allow making many cubes

 we make a constructor function that will make instances of cubes - each one gets
 added to the grobjects list

 we need to be a little bit careful to distinguish between different kinds of initialization
 1) there are the things that can be initialized when the function is first defined
    (load time)
 2) there are things that are defined to be shared by all cubes - these need to be defined
    by the first init (assuming that we require opengl to be ready)
 3) there are things that are to be defined for each cube instance
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var Cube = undefined;
var SpinningCube = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";
    
    
    var posy = new Image();
    posy.crossOrigin = "anonymous";
    posy.src = "https://farm6.staticflickr.com/5564/30725680942_e3bfe50e5e_b.jpg";
    var posx = new Image();
    posx.crossOrigin = "anonymous";
    posx.src = "https://farm6.staticflickr.com/5564/30725680942_e3bfe50e5e_b.jpg";
    var negx = new Image();
    negx.crossOrigin = "anonymous";
    negx.src = "https://i.imgur.com/7zfmPF6.png";
    var posz = new Image();
    posz.crossOrigin = "anonymous";
    posz.src = "https://farm6.staticflickr.com/5564/30725680942_e3bfe50e5e_b.jpg";
    var negy = new Image();
    negy.crossOrigin = "anonymous";
    negy.src = "https://farm6.staticflickr.com/5564/30725680942_e3bfe50e5e_b.jpg";
    var negz = new Image();
    negz.crossOrigin = "anonymous";
    negz.src = "https://farm6.staticflickr.com/5564/30725680942_e3bfe50e5e_b.jpg";
    

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Cubes
    Cube = function Cube(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
    }
    Cube.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["sky-vs", "sky-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    -0.5, -0.5, -0.5,  
                     0.5, -0.5, -0.5,  
                     0.5,  0.5, -0.5,  
                     0.5,  0.5, -0.5,  
                    -0.5,  0.5, -0.5,  
                    -0.5, -0.5, -0.5,  

                    -0.5, -0.5,  0.5,  
                     0.5, -0.5,  0.5,  
                     0.5,  0.5,  0.5,  
                     0.5,  0.5,  0.5,  
                    -0.5,  0.5,  0.5,  
                    -0.5, -0.5,  0.5,

                    -0.5,  0.5,  0.5,  
                    -0.5,  0.5, -0.5,  
                    -0.5, -0.5, -0.5,  
                    -0.5, -0.5, -0.5,  
                    -0.5, -0.5,  0.5,  
                    -0.5,  0.5,  0.5, 

                     0.5,  0.5,  0.5,  
                     0.5,  0.5, -0.5,  
                     0.5, -0.5, -0.5,  
                     0.5, -0.5, -0.5,  
                     0.5, -0.5,  0.5,  
                     0.5,  0.5,  0.5,

                    -0.5, -0.5, -0.5,  
                     0.5, -0.5, -0.5,  
                     0.5, -0.5,  0.5,  
                     0.5, -0.5,  0.5,  
                    -0.5, -0.5,  0.5,  
                    -0.5, -0.5, -0.5, 

                    -0.5,  0.5, -0.5,  
                     0.5,  0.5, -0.5,  
                     0.5,  0.5,  0.5,  
                     0.5,  0.5,  0.5,  
                    -0.5,  0.5,  0.5,  
                    -0.5,  0.5, -0.5 
                ] },
                vnormal : {numComponents:3, data: [
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
                ]},
                vTexCoord : {numComponents: 2, data: [
                    0.0, 0.0,
                    1.0, 0.0,
                    1.0, 1.0,
                    1.0, 1.0,
                    0.0, 1.0,
                    0.0, 0.0,

                    0.0, 0.0,
                    1.0, 0.0,
                    1.0, 1.0,
                    1.0, 1.0,
                    0.0, 1.0,
                    0.0, 0.0,

                    1.0, 0.0,
                    1.0, 1.0,
                    0.0, 1.0,
                    0.0, 1.0,
                    0.0, 0.0,
                    1.0, 0.0,

                    1.0, 0.0,
                    1.0, 1.0,
                    0.0, 1.0,
                    0.0, 1.0,
                    0.0, 0.0,
                    1.0, 0.0,

                    0.0, 1.0,
                    1.0, 1.0,
                    1.0, 0.0,
                    1.0, 0.0,
                    0.0, 0.0,
                    0.0, 1.0,

                    0.0, 1.0,
                    1.0, 1.0,
                    1.0, 0.0,
                    1.0, 0.0,
                    0.0, 0.0,
                    0.0, 1.0  
                ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }
        var texID = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texID);
        
        // Pos X
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, posx);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Neg X
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, negx);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Pos Z
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, posz);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Neg Z
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, negz);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Pos Y
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, posy);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Neg Y
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, negy);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        //gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

    };
    Cube.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });

        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Cube.prototype.center = function(drawingState) {
        return this.position;
    }
})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.
grobjects.push(new Cube("cube1",[0,0,0],20) );