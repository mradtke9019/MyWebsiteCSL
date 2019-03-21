function start() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    var gl = canvas.getContext("webgl");
    var m4 = twgl.m4;
    var angle  = 0;
    var time = 0;
    
    var slider1 = document.getElementById('slider1');
    slider1.value = 0;
    var slider3 = document.getElementById("slider3");
    slider3.value = 0;
    
    //gather the shader sources
    var vertexSource = document.getElementById("vs").text;
    var fragmentSource = document.getElementById("fs").text;
    
    //compile the vertex shader with webGL
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,vertexSource);
    gl.compileShader(vertexShader);
    
    if(!gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS)) {
        //alert(gl.getShaderInfoLog(vertexShader)); return null;
    }
    
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentSource);
    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(fragmentShader)); return null;
    }
    
    //combine the shaders to create the program
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if(!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS)) {
        alert("Could not initialize shaders");
    }
    gl.useProgram(shaderProgram);
    
    //pass positions as an attribute in next lines of code
    shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.enableVertexAttribArray(shaderProgram.PositionAttribute);
    
    shaderProgram.ColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");
    gl.enableVertexAttribArray(shaderProgram.ColorAttribute);
    
    shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram,"uMVP");
    
    
    //vert positions
    var vertexPos = new Float32Array ([
        0.0, 2.0, 0.0,  1.0, 0.0, 0.0,  0.0, 0.0, -1.0,
        0.0, 2.0, 0.0,  1.0, 0.0, 0.0,  0.0, 0.0, 1.0,
        0.0, 2.0, 0.0,  -1.0, 0.0, 0.0,  0.0, 0.0, -1.0,
        0.0, 2.0, 0.0,  -1.0, 0.0, 0.0,  0.0, 0.0, 1.0,
        
        0.0, -2.0, 0.0,  1.0, 0.0, 0.0,  0.0, 0.0, -1.0,
        0.0, -2.0, 0.0,  1.0, 0.0, 0.0,  0.0, 0.0, 1.0,
        0.0, -2.0, 0.0,  -1.0, 0.0, 0.0,  0.0, 0.0, -1.0,
        0.0, -2.0, 0.0,  -1.0, 0.0, 0.0,  0.0, 0.0, 1.0,
        
    ]);
    
    //have each vertex just be RBG
    var vertexColors = new Float32Array ([
        1.0, 0.0, 0.0,  0.0, 1.0, 0.0,  0.0, 0.0, 1.0,
        1.0, 0.0, 0.0,  0.0, 1.0, 0.0,  0.0, 0.0, 1.0,
        1.0, 0.0, 0.0,  0.0, 1.0, 0.0,  0.0, 0.0, 1.0,
        1.0, 0.0, 0.0,  0.0, 1.0, 0.0,  0.0, 0.0, 1.0,
        1.0, 0.0, 0.0,  0.0, 1.0, 0.0,  0.0, 0.0, 1.0,
        
        1.0, 0.0, 0.0,  0.0, 1.0, 0.0,  0.0, 0.0, 1.0,
        1.0, 0.0, 0.0,  0.0, 1.0, 0.0,  0.0, 0.0, 1.0,
        1.0, 0.0, 0.0,  0.0, 1.0, 0.0,  0.0, 0.0, 1.0,
        1.0, 0.0, 0.0,  0.0, 1.0, 0.0,  0.0, 0.0, 1.0,
        1.0, 0.0, 0.0,  0.0, 1.0, 0.0,  0.0, 0.0, 1.0,
        
    ]);
    
    //put them in the buffer to allow the gpu and cpu to communicate the data
    var trianglePosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW);
    trianglePosBuffer.itemSize = 3;
    trianglePosBuffer.numItems = 24;
    
    var colorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW);
    colorBuffer.itemSize = 3;
    colorBuffer.numItems = 24;
    
    function draw() {
        //change this value to have it rotate slowly
        angle = 0;
        time = time + 0.005;
        
        var eye = [500*Math.sin(slider1.value * 0.05), 300.0, 500*Math.cos(slider1.value * 0.05)];
        var target = [0,0,0];
        var up = [0,1,0];
        
        var tModel = m4.multiply(m4.scaling([Math.cos(slider3.value * 0.025) * 100,Math.cos(slider3.value * 0.025) * 100,Math.cos(slider3.value * 0.025) * 100]), m4.axisRotation([0,1,0], angle));
        var tCamera = m4.inverse(m4.lookAt(eye,target,up));
        var tProjection = m4.perspective(Math.PI/4,1,10,1000);
        
        var tMVP = m4.multiply(m4.multiply(tModel,tCamera),tProjection);
        
        //set up the screen
        gl.clearColor(0.678431, 0.847059, 0.901961, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        //set variables from the shader sources
        gl.uniformMatrix4fv(shaderProgram.MVPmatrix, false, tMVP);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.drawArrays(gl.TRIANGLES, 0, trianglePosBuffer.numItems);
        
    }
    slider1.addEventListener("input",draw);
    slider3.addEventListener("input",draw);
    draw();
}