(function(){
    var stage,textStage;
    var circles,textPixels,strArray,kissed,apps,snowed;
    var despIndex=0,endSnowIndex=0;
    var offsetX,offsetY,text;
    var imgnum=24,appnum=1,despnum=0,intnum;
    var input="👤";
    var scale1=0.09 ,scale2=0.03;
    var fontsize=400;
    function bobobo() {
        initStage();
        initCircles();
        step();
        addListeners();
    }
    function initStage() {
        // $("#gogo").hide();
        input=input.toUpperCase();
        offsetX = (window.innerWidth-fontsize)/2;
        // offsetY = (window.innerHeight-fontsize)/2;
        offsetY=100;
        // console.log(offsetX+' '+offsetY)
        textStage = new createjs.Stage("text");
        textStage.canvas.width = fontsize;
        textStage.canvas.height = fontsize+100;
        stage = new createjs.Stage("stage");
        stage.canvas.width = window.innerWidth;
        stage.canvas.height = window.innerHeight;
        text = new createjs.Text("", fontsize+"px 'Source Sans Pro'", "#eee");
        text.alpha=0.01;
        //就是要两遍。。不然有bug。。。
        createText(input);
        createText(input);
    }
    //加入很多app
    function initCircles() {
        strArray = [];
        circles = [];
        for(var i=0; i<appnum; i++) {
            var img = new Image();
            var x = window.innerWidth*Math.random();
            var y = window.innerHeight*Math.random();
            img.src = "img/" + Math.floor(Math.random()*imgnum) + ".png";
            var appp = new createjs.Bitmap(img);
            appp.x=x;
            appp.y=y;
            appp.scaleX=scale1;
            appp.scaleY=scale1;
            appp.alpha=0.2 + Math.random()*0.5;
            circles.push(appp);
            stage.addChild(appp);
            appp.movement = 'float';
            dynamicGo(appp);
        }
    }
    //使用回调函数渲染
    function step() {
        stage.update();
        requestAnimationFrame(step);
    }
    //元素浮动
    function dynamicGo(c, dir) {
        if(c.tween) c.tween.kill();
        if(dir == 'in') {
            c.tween = TweenLite.to(c, 1, {x: c.originX, y: c.originY, ease:Quad.easeInOut, alpha: 1, scaleX: scale2, scaleY: scale2, onComplete: function() {
                c.movement = 'jiggle';
                dynamicGo(c);
            }});
        } 
        else if(dir == 'out') {
            c.tween = TweenLite.to(c, 1, {x: window.innerWidth*Math.random(), y: window.innerHeight*Math.random(), ease:Quad.easeInOut, alpha: 0.2 + Math.random()*0.5, scaleX: scale1, scaleY: scale1, onComplete: function() {
                c.movement = 'float';
                dynamicGo(c);
            }});
        }
        else if(dir == 'down'){
            //todo
            c.tween = TweenLite.to(c, Math.random()*2+1, {x: c.x, y: window.innerHeight, ease:Quad.easeInOut, alpha: 0.4 + Math.random()*0.5, scaleX: scale2+Math.random()*(scale1-scale2), scaleY: scale2+Math.random()*(scale1-scale2), onComplete: function(){
                // showDesp();
            }});
        }
        else if(dir == 'enddown'){
            c.tween = TweenLite.to(c, Math.random()*10+10, {x: c.x, y: window.innerHeight, ease:Quad.easeInOut, alpha: 0.2 + Math.random()*0.5, scaleX: scale2+Math.random()*(scale1-scale2), scaleY: scale2+Math.random()*(scale1-scale2), onComplete: function(){
                // showDesp();
            }});
        }
        else {
            //在外面飘
            if(c.movement == 'float') {
                c.tween = TweenLite.to(c, 5 + Math.random()*3.5, {x: c.x + -100+Math.random()*200, y: c.y + -100+Math.random()*200, ease:Quad.easeInOut, alpha: 0.2 + Math.random()*0.5,
                    onComplete: function() {
                        dynamicGo(c);
                    }});
            } 
            //在中间抖
            else if(c.movement == 'jiggle'){
                c.tween = TweenLite.to(c, 0.05, {x: c.originX + Math.random()*3, y: c.originY + Math.random()*3, ease:Quad.easeInOut,
                    onComplete: function() {
                        dynamicGo(c);
                    }});
            }
        }
    }
    //根据小人构造位置数组
    function createText(t) {
        text.text = t;
        text.font = fontsize+"px 'Source Sans Pro'";
        text.textAlign = 'center';
        text.x = 200;
        text.y = 0;
        textStage.addChild(text);
        textStage.update();
        var ctx = document.getElementById('text').getContext('2d');
        var pix = ctx.getImageData(0,0,400,400).data;
        // 位置数组，从下到上从左到右填充
        textPixels = [];
        for (var i = pix.length; i >= 0; i -= 4) {
            if (pix[i] != 0) {
                var x = (i / 4) % 400;
                var y = Math.floor(Math.floor(i/400)/4);
                if((x && x%8 == 0) && (y && y%8 == 0)) textPixels.push({x: x, y: y});
            }
        }
        // console.log(textPixels.length);
        appnum=textPixels.length;
    }
    //改变点的坐标到小人
    function formText() {
        for(var i=0, l=textPixels.length; i<l; i++) {
            circles[i].originX = offsetX + textPixels[i].x;
            circles[i].originY = offsetY + textPixels[i].y;
            dynamicGo(circles[i], 'in');
        }
        // console.log(circles.length+' '+textPixels.length)
        kissed = true;
        snowed=false;
    }
    //放出去变成app
    function explode() {
        for(var i=0;i<textPixels.length;i++){
            dynamicGo(circles[i],'out');
        }
    }
    //雪崩
    function snow(){
        for(var i=0;i<textPixels.length;i++){
            dynamicGo(circles[i],'down');
        }
    }
    function endSnow(){
        circles[endSnowIndex%appnum].x=window.innerWidth*Math.random();
        circles[endSnowIndex%appnum].y=-5;
        dynamicGo(circles[endSnowIndex%appnum],'enddown');
        if(endSnowIndex<=10)console.log(circles[endSnowIndex]);
        endSnowIndex++;
        setTimeout(endSnow,300);
    }
    // 最后展示的文字s
    function showDesp(){
        document.getElementById("p"+despIndex).style.display="none";
        document.getElementById("p"+despIndex).innerText=strArray[despIndex];
        $("#p"+despIndex).fadeIn(1500);
        despIndex++;
        if(despIndex==despnum-1){
            // $("#gogo").fadeIn(1500);
            setTimeout(endSnow,300);
        }
        if(despIndex<despnum)setTimeout(showDesp,1500);
    }
    function dealWithWords(){
        var strr=document.getElementById("desp").innerText;
        strArray=strr.split(/[(\r\n)\r\n]+/);
        despnum=strArray.length;
        for(var i=0;i<despnum;i++){
            var despchild=document.createElement("p");
            despchild.id="p"+i;
            despchild.innerText=" ";
            document.getElementById("despall").appendChild(despchild);
        }
    }
    //点击页面监听
    function addListeners() {
        document.onclick=function(e){
            e.preventDefault();
            if(kissed){
                // explode();
                if(snowed==false){
                    snow();
                    snowed=true;
                    dealWithWords();
                    setTimeout(showDesp,1500);
                }
                // kissed=false;
            }
            else{
                // createText(input);
                formText();
            }
        }
    }
    window.onload = function() { 
        bobobo() 
    };
})();