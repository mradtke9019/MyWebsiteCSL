var grobjects = grobjects || [];

(function() {
    "use strict";

    var vertexSource = ""+
        "precision highp float;" +
        "attribute vec3 aPosition;" +
        "attribute vec2 aTexCoord;" +
        "varying vec2 vTexCoord;" +
        "uniform mat4 pMatrix;" +
        "uniform mat4 vMatrix;" +
        "uniform mat4 mMatrix;" +
        "void main(void) {" +
        "  gl_Position = pMatrix * vMatrix * mMatrix * vec4(aPosition, 1.0);" +
        "  vTexCoord = aTexCoord;" +
        "}";

    var fragmentSource = "" +
        "precision highp float;" +
        "varying vec2 vTexCoord;" +
        "uniform sampler2D uTexture;" +
        "void main(void) {" +
        "  gl_FragColor = texture2D(uTexture, vTexCoord);" +
        "}";


    var vertices = new Float32Array([
         1.0,  1.0,  0.0,
        -1.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,

         1.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0

    ]);

    var uvs = new Float32Array([
       1.0, 1.0,
       0.0, 1.0,
       0.0, 0.0,

       1.0, 1.0,
       0.0, 0.0,
       1.0, 0.0
    ]);

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
    
    var image = new Image();
    image.src = "data:image/jpeg;base64,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";
    
    var createGLProgram = function(gl, vSrc, fSrc) {
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
        gl.bindTexture(gl.TEXTURE_2D, texture);
        if(flipY){
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        }
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,  gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
    
    var WelcomeSign = function() {
        this.name = "WelcomeSign";
        this.position = new Float32Array([0, 0, 0]);
        this.scale = new Float32Array([1, 1]);
        this.program = null;
        this.attributes = null;
        this.uniforms = null;
        this.buffers = [null, null]
        this.texture = null;
    }
    
    WelcomeSign.prototype.init = function (drawingState) {
        var gl = drawingState.gl;

        this.program = createGLProgram(gl, vertexSource, fragmentSource);
        this.attributes = findAttribLocations(gl, this.program, ["aPosition", "aTexCoord"]);
        this.uniforms = findUniformLocations(gl, this.program, ["pMatrix", "vMatrix", "mMatrix", "uTexture"]);

        this.texture = createGLTexture(gl, image, true);

        this.buffers[0] = createGLBuffer(gl, vertices, gl.STATIC_DRAW);
        this.buffers[1] = createGLBuffer(gl, uvs, gl.STATIC_DRAW);
    }
    WelcomeSign.prototype.center = function () {
        return this.position;
    }
    
    WelcomeSign.prototype.draw = function (drawingState) {
        var gl = drawingState.gl;

        gl.useProgram(this.program);
        gl.disable(gl.CULL_FACE);

        var modelM = twgl.m4.scaling([this.scale[0],this.scale[1], 1]);
        twgl.m4.setTranslation(modelM,this.position, modelM);

        gl.uniformMatrix4fv(this.uniforms.pMatrix, gl.FALSE, drawingState.proj);
        gl.uniformMatrix4fv(this.uniforms.vMatrix, gl.FALSE, drawingState.view);
        gl.uniformMatrix4fv(this.uniforms.mMatrix, gl.FALSE, modelM);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(this.uniforms.uTexture, 0);



        enableLocations(gl, this.attributes)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[0]);
        gl.vertexAttribPointer(this.attributes.aPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[1]);
        gl.vertexAttribPointer(this.attributes.aTexCoord, 2, gl.FLOAT, false, 0, 0);

        

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        disableLocations(gl, this.attributes);
    }
    
    var sign = new WelcomeSign();
    sign.position[1] = 3;
    sign.scale = [2,2];
    
    grobjects.push(sign);
    
})();
 