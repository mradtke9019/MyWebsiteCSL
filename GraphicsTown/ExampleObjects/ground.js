/**
 * Created by gleicher on 10/9/2015.
 */

/**
 this is even simpler than the simplest object - it's a ground plane underneath
 the objects (at Z=0) - just a big plane. all coloring handled in the vertex
 shader. no normals. it's just a checkerboard that is simple.

 no normals, but a funky shader

 however, I am going to do it with TWGL to keep the code size down
 **/

// this defines the global list of objects
    // if it exists already, this is a redundant definition
    // if it isn't create a new array
var grobjects = grobjects || [];

// a global variable to set the ground plane size, so we can easily adjust it
// in the html file (before things run
// this is the +/- in the X and Z direction (so things will go from -5 to +5 by default)
var groundPlaneSize = groundPlaneSize || 5;
var shaderProgram = undefined;
// now, I make a function that adds an object to that list
// there's a funky thing here where I have to not only define the function, but also
// run it - so it has to be put in parenthesis
(function() {
    "use strict";
    var image = new Image();
    image.crossOrigin = "anonymous";
    image.src = "https://i.imgur.com/DxLsDEh.jpg";

    // putting the arrays of object info here as well
//    var vertexPos = [
//        -groundPlaneSize, 0, -groundPlaneSize,
//         groundPlaneSize, 0, -groundPlaneSize,
//         groundPlaneSize, 0,  groundPlaneSize,
//        -groundPlaneSize, 0, -groundPlaneSize,
//         groundPlaneSize, 0,  groundPlaneSize,
//        -groundPlaneSize, 0,  groundPlaneSize
//    ];
    var vertexPos = [
        -5, 0, -5,
        -5, 0, 5,
        5, 0,  -5,
        5, 0, 5
    ];

    // since there will be one of these, just keep info in the closure

    var buffers = undefined;

    // define the pyramid object
    // note that we cannot do any of the initialization that requires a GL context here
    // we define the essential methods of the object - and then wait
    //
    // another stylistic choice: I have chosen to make many of my "private" variables
    // fields of this object, rather than local variables in this scope (so they
    // are easily available by closure).
    var ground = {
        // first I will give this the required object stuff for it's interface
        // note that the init and draw functions can refer to the fields I define
        // below
        name : "Ground Plane",
        // the two workhorse functions - init and draw
        // init will be called when there is a GL context
        // this code gets really bulky since I am doing it all in place
        init : function(drawingState) {
            // an abbreviation...
            var gl = drawingState.gl;
            if (!shaderProgram) {
                shaderProgram = twgl.createProgramInfo(gl,["ground-vs","ground-fs"]);
            }
            var arrays = {
                vpos : {numComponents:3, data: [
                    -5, 0, -5,
                    -5, 0, 5,
                    5, 0, -5,
                    5, 0, 5
                ]},
                vTexCoord : {numComponents: 2, data : [
                    0, 0,   0, 1,   1, 0,   1, 1
                ]},
                indices : [0,1,2, 1,2,3]
            };
            buffers = twgl.createBufferInfoFromArrays(gl,arrays);
            
            this.texture = gl.createTexture();        
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            
            
            shaderProgram.program.texSampler = gl.getUniformLocation(shaderProgram.program, "texSampler");
       },
        draw : function(drawingState) {
            var gl = drawingState.gl;
            gl.useProgram(shaderProgram.program);
            
            twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
            twgl.setUniforms(shaderProgram,{
                view:drawingState.view, proj:drawingState.proj
            });
            
            
            gl.uniform1i(shaderProgram.program.texSampler,0);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            
            twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
        },
        center : function(drawingState) {
            return [0,0,0];
        }

    };

    // now that we've defined the object, add it to the global objects list
    grobjects.push(ground);
})();