/**
 * Created by Yusef.
 */

/**
 A Very Simple Textured Plane using native WebGL. 

 Notice that it is possible to only use twgl for math. 

 Also, due to security restrictions the image was encoded as a Base64 string. 
 It is very simple to use somthing like this (http://dataurl.net/#dataurlmaker) to create one
 then its as simple as 
     var image = new Image()
     image.src = <base64string>


 **/

var grobjects = grobjects || [];

(function() {
    "use strict";

    var vertexSource = ""+
        "precision highp float;" +
        "attribute vec3 aPosition;" +
        "attribute vec2 aTexCoord;" +
        "varying vec3 vTexCoord;" +
        "uniform mat4 pMatrix;" +
        "uniform mat4 vMatrix;" +
        "uniform mat4 mMatrix;" +
        "void main(void) {" +
        "  gl_Position = pMatrix * vMatrix * mMatrix * vec4(aPosition, 1.0);" +
        "  vTexCoord = aPosition;" +
        "}";

    var fragmentSource = "" +
        "precision highp float;" +
        "varying vec3 vTexCoord;" +
        "uniform samplerCube uTexture;" +
        "void main(void) {" +
        "  gl_FragColor = textureCube(uTexture, vTexCoord);" +
        "}";


    var vertices = new Float32Array([

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

    ]);

    var uvs = new Float32Array([


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
        
    ]);

    //useful util function to simplify shader creation. type is either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
    var createGLShader = function (gl, type, src) {
        var shader = gl.createShader(type)
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            console.log("warning: shader failed to compile!")
            console.log(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }
    
    // I will use the regular puppy image since I cannot find compatible images and images that arent
    //already formatted for being used as a skybox
    var images = [];
    var top = new Image();
    top.crossOrigin = "anonymous";
    top.src = "https://farm6.staticflickr.com/5564/30725680942_e3bfe50e5e_b.jpg";
    var right = new Image();
    right.crossOrigin = "anonymous";
    right.src = "https://farm6.staticflickr.com/5564/30725680942_e3bfe50e5e_b.jpg";
    var left = new Image();
    left.crossOrigin = "anonymous";
    left.src = "https://farm6.staticflickr.com/5564/30725680942_e3bfe50e5e_b.jpg";
    var front = new Image();
    front.crossOrigin = "anonymous";
    front.src = "https://farm6.staticflickr.com/5564/30725680942_e3bfe50e5e_b.jpg";
    var bottom = new Image();
    bottom.crossOrigin = "anonymous";
    bottom.src = "https://farm6.staticflickr.com/5564/30725680942_e3bfe50e5e_b.jpg";
    var back = new Image();
    back.crossOrigin = "anonymous";
    back.src = "https://farm6.staticflickr.com/5564/30725680942_e3bfe50e5e_b.jpg";

    
    images[0] = right;
    images[1] = left;
    images[2] = top;
    images[3] = bottom;
    images[4] = back;
    images[5] = front;



    var image = new Image();
    image.src = "https://farm6.staticflickr.com/5564/30725680942_e3bfe50e5e_b.jpg";

        //useful util function to return a glProgram from just vertex and fragment shader source.
    var createGLProgram = function (gl, vSrc, fSrc) {
        var program = gl.createProgram();
        var vShader = createGLShader(gl, gl.VERTEX_SHADER, vSrc);
        var fShader = createGLShader(gl, gl.FRAGMENT_SHADER, fSrc);
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);

        if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
            console.log("warning: program failed to link");
            return null;

        }
        return program;
    }

    //creates a gl buffer and unbinds it when done. 
    var createGLBuffer = function (gl, data, usage) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, usage);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return buffer;
    }

    var findAttribLocations = function (gl, program, attributes) {
        var out = {};
        for(var i = 0; i < attributes.length;i++){
            var attrib = attributes[i];
            out[attrib] = gl.getAttribLocation(program, attrib);
        }
        return out;
    }

    var findUniformLocations = function (gl, program, uniforms) {
        var out = {};
        for(var i = 0; i < uniforms.length;i++){
            var uniform = uniforms[i];
            out[uniform] = gl.getUniformLocation(program, uniform);
        }
        return out;
    }

    var enableLocations = function (gl, attributes) {
        for(var key in attributes){
            var location = attributes[key];
            gl.enableVertexAttribArray(location);
        }
    }

    //always a good idea to clean up your attrib location bindings when done. You wont regret it later. 
    var disableLocations = function (gl, attributes) {
        for(var key in attributes){
            var location = attributes[key];
            gl.disableVertexAttribArray(location);
        }
    }

    //creates a gl texture from an image object. Sometiems the image is upside down so flipY is passed to optionally flip the data.
    //it's mostly going to be a try it once, flip if you need to. 
    var createGLTexture = function (gl, image, flipY) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        if(flipY){
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        }

        for(var i = 0; i < images.length; i++) {
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[i]);
        }
        //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        // gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // Prevents s-coordinate wrapping (repeating).
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // Prevents t-coordinate wrapping (repeating).
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,  gl.LINEAR);
        //gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        return texture;
    }

     var Skybox = function () {
        this.name = "Skybox"
        this.position = new Float32Array([0, 0, 0]);
        this.scale = new Float32Array([1, 1, 1]);
        this.program = null;
        this.attributes = null;
        this.uniforms = null;
        this.buffers = [null, null]
        this.texture = null;
    }

    Skybox.prototype.init = function (drawingState) {
        var gl = drawingState.gl;
        //videoElement = document.getElementById("video");

        this.program = createGLProgram(gl, vertexSource, fragmentSource);
        this.attributes = findAttribLocations(gl, this.program, ["aPosition", "aTexCoord"]);
        this.uniforms = findUniformLocations(gl, this.program, ["pMatrix", "vMatrix", "mMatrix", "uTexture"]);

        this.texture = createGLTexture(gl, image, false);

        this.buffers[0] = createGLBuffer(gl, vertices, gl.STATIC_DRAW);
        this.buffers[1] = createGLBuffer(gl, uvs, gl.STATIC_DRAW);
    }

    Skybox.prototype.center = function () {
        return this.position;
    }

    Skybox.prototype.draw = function (drawingState) {
        var gl = drawingState.gl;

        gl.useProgram(this.program);
        gl.disable(gl.CULL_FACE);

        var modelM = twgl.m4.scaling([this.scale[0],this.scale[1], this.scale[2]]);
        twgl.m4.setTranslation(modelM,this.position, modelM);

        gl.uniformMatrix4fv(this.uniforms.pMatrix, gl.FALSE, drawingState.proj);
        gl.uniformMatrix4fv(this.uniforms.vMatrix, gl.FALSE, drawingState.view);
        gl.uniformMatrix4fv(this.uniforms.mMatrix, gl.FALSE, modelM);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[1]);
        gl.uniform1i(this.uniforms.uTexture, 0);

        enableLocations(gl, this.attributes)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[0]);
        gl.vertexAttribPointer(this.attributes.aPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[1]);
        gl.vertexAttribPointer(this.attributes.aTexCoord, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 36);

        disableLocations(gl, this.attributes);
    }


    var test = new Skybox();
        test.position[0] = 0;
        test.position[1] = 5;
        test.position[2] = -10;
        test.scale = [64,64, 64];

    grobjects.push(test);

})();