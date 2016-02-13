var MainLayer = cc.LayerColor.extend({
    sprite:null,
    lines:[],
    
    ctor:function () {
        this._super(cc.color(200,200, 50,100)); // , cc.winSize.width, 20);
        var self = this;
        var winSize = cc.winSize;
        
        // show my peerID.
        var peerID_txt = new cc.LabelTTF(msg.showPeerID+rtc_manager.getmyid(), "Arial", 38);
        peerID_txt.x = winSize.width / 2;
        peerID_txt.y = winSize.height / 2 + 200;
        this.addChild(peerID_txt, 5);
        
        // real mouse (but unvisible)
        var v_mouse = new cc.Node();
        v_mouse.attr({
            x: winSize.width / 2,
            y: winSize.height / 2,
            scaleX : 100/v_mouse.width,
            scaleY : 100/v_mouse.height,
            anchorX : 0.5,
            anchorY : 0.5,
            touched : false
        });
        this.addChild(v_mouse, 1);
        this.v_mouse = v_mouse;
        
        // real mouse (but unvisible)
        var v_mouseForFlip = new cc.Node();
        v_mouseForFlip.attr({
            x: winSize.width / 2,
            y: winSize.height / 2,
            scaleX : 100/v_mouseForFlip.width,
            scaleY : 100/v_mouseForFlip.height,
            anchorX : 0.5,
            anchorY : 0.5,
            touched : false
        });
        this.addChild(v_mouseForFlip, 1);
        this.v_mouseForFlip = v_mouseForFlip;
        
        this.flipWindow = cc.rect(50, 50, 100, 100 );
        
        // start processig received rtc data.
        // mkmk.frameByFrameSyncManager.startReceiveFrame();
        
        // start frame processig.
        // this.scheduleUpdate();
    },
    
    addCircle : function(){
        
        var node = new cc.DrawNode();
        
        var radius = 100;
        var color = cc.color(0,255,0);
        var pos = cc.p(radius,this.height-radius);
        
        node.drawDot(pos, radius, color);
        
        this.addChild(node);
    },
    
    addRect : function(){
        
        var node = new cc.DrawNode();
        
        var size = cc.size(100,100);
        var fillColor = cc.color(0,255,0);
        var pos = cc.p(0, this.height - size.height);
        var lineWidth = 10;
        var lineColor = fillColor;
        var origin = pos;
        var destination = cc.p( pos.x+size.width,pos.y+size.height );
        
        node.drawRect(origin, destination, fillColor, lineWidth, lineColor);
        
        this.addChild(node);
    },
    
    addTriAngle : function(){
        
        var node = new cc.DrawNode();
        
        var radius = 100;
        
        var pos = cc.p(radius, this.height - radius);
         
        var verts = [cc.p(pos.x, pos.y+radius), cc.p(pos.x-radius/2*Math.sqrt(3), pos.y-radius/2), cc.p(pos.x+radius/2*Math.sqrt(3), pos.y-radius/2)];
        var fillColor = cc.color(0,255,0);
        var lineWidth = 10;
        var color = fillColor;
        
        node.drawPoly(verts, fillColor, lineWidth, color);
        
        this.addChild(node);
    },
    
    removeSketch : function(){
        cc.log("clear");
        for(var key in this.lines) {
            this.removeChild(this.lines[key]);
        }
    },
    
    /**
     * location mouse.
     * @param {cc.Point}
     */
    loc_mouse : function(location){
        
        // todo : clip with Window
        // var x = Math.max( this.clipWindow.minX, Math.min(location.x, this.clipWindow.maxX ));
        // var y = Math.max( this.clipWindow.minY, Math.min(location.y, this.clipWindow.maxY ));
        
        var prevX = this.v_mouse.x;
        var prevY = this.v_mouse.y;
        
        this.v_mouse.attr({
            x: location.x,
            y: location.y,
            touched : location.isTouched,
            prevX : prevX,
            prevY : prevY
        });
    },
    
    loc_mouseForFlip : function(location){
        
        this.v_mouseForFlip.attr({
            x: location.x,
            y: location.y,
            touched : location.isTouched,
            prevX : location.prevX,
            prevY : location.prevY
        });
    },
    
    /*
     * draw line 
     */
    drawLine : function(){
        
        if( !cc.rectContainsPoint(this.flipWindow, cc.p(this.v_mouse.x, this.v_mouse.y)) ){   
            return;
        }
        
        var node = new cc.DrawNode();
        
        node.drawSegment(
            cc.p(this.v_mouse.prevX, this.v_mouse.prevY), 
            cc.p(this.v_mouse.x, this.v_mouse.y), 
            10, 
            cc.color(0,0,0)
        );
            
        this.lines.push(node);
        this.addChild(node);
    },
    
    drawFlip : function(){
        
        var node = new cc.DrawNode();
        
        node.drawSegment(
            cc.p(this.v_mouseForFlip.prevX, this.v_mouseForFlip.prevY), 
            cc.p(this.v_mouseForFlip.x, this.v_mouseForFlip.y), 
            10, 
            cc.color(0,0,0)
        );
            
        this.addChild(node);
    },
    
    
     
    /**
     * processing per frame.
     */
    update : function(dt){
         
        // determine the sync-target frame count.
        var synCnt = mkmk.frameByFrameSyncManager.getSyncCnt();
        
        if(synCnt < 0){
            // delay分は無視　todo:予めマイナスのフレームデータを入れておくという手もある。その場合はこのif文は不要。
            mkmk.frameByFrameSyncManager.incrementFrameCnt();
            return;
        } 
       
        // get current my data.
        var data = mkmk.frameByFrameSyncManager.getMyFrameData(synCnt);
        if( data === undefined ){
            cc.log("MyData Sync lost.");
            return;
        }
        
        // get current enemy data.
        var enemyData = mkmk.frameByFrameSyncManager.getEnemyFrameData(synCnt);
        if( enemyData === undefined ){
            cc.log("EnemyData Sync lost.");
            return;
        }
        
        ///////////////// ▼process per frame▼ /////////////////////
        if( mkmk.frameByFrameSyncManager.isHost ){
            this.loc_mouse(data);
            this.loc_mouseForFlip(enemyData);
        }else{
            this.loc_mouse(enemyData);
            this.loc_mouseForFlip(data);
        }
         
        if( this.v_mouse.touched ){
            this.drawLine();
        }
        if( this.v_mouseForFlip.touched ){
            this.drawFlip();
        }
        ///////////////// ▲process per frame▲ /////////////////////
        
        // frame update success.
        mkmk.frameByFrameSyncManager.incrementFrameCnt();
    }
});

var MenuLayer = cc.LayerColor.extend({
    sprite:null,
    mainLayer:null,
    
    drawCircleCallbackFunc : null,
    drawCircleCallbackTarget : null,
    
    drawRectCallbackFunc : null,
    drawRectCallbackTarget : null,
    
    drawTriCallbackFunc : null,
    drawTriCallbackTarget : null,
    
    ctor:function () {
        this._super(cc.color(200,200, 50,100), cc.winSize.width, 80);
        
        // menus
        var circleMenu = new cc.MenuItemImage(
            res.Puck,  
            res.Puck, 
            res.Puck, 
            function(){
                if( this.drawCircleCallbackFunc == null ){
                    return;
                }
                
                if(this.drawCircleCallbackTarget){
                    this.drawCircleCallbackFunc.call(this.drawCircleCallbackTarget);
                }else{
                    this.drawCircleCallbackFunc();
                }
            },
            this
        );
        
        circleMenu.attr({
            scaleX : 80 / circleMenu.width,
            scaleY : 80 / circleMenu.height,
            x : 0,
            y : 0
        });
        circleMenu.setAnchorPoint(cc.p(0,0));
        this.circleMenu = circleMenu;
        
        ///////
        var rectMenu = new cc.MenuItemImage(
            res.Puck,  
            res.Puck, 
            res.Puck, 
            function(){
                if( this.drawRectCallbackFunc == null ){
                    return;
                }
                
                if(this.drawRectCallbackTarget){
                    this.drawRectCallbackFunc.call(this.drawRectCallbackTarget);
                }else{
                    this.drawRectCallbackFunc();
                }
            },
            this
        );
        
        rectMenu.attr({
            scaleX : 80 / rectMenu.width,
            scaleY : 80 / rectMenu.height,
            x : 0,
            y : 0
        });
        rectMenu.setAnchorPoint(cc.p(0,0));
        this.rectMenu = rectMenu;
        //////
        
        var triangleMenu = new cc.MenuItemImage(
            res.Puck,  
            res.Puck, 
            res.Puck, 
            function(){
                if( this.drawTriCallbackFunc == null ){
                    return;
                }
                
                if(this.drawTriCallbackTarget){
                    this.drawTriCallbackFunc.call(this.drawTriCallbackTarget);
                }else{
                    this.drawTriCallbackFunc();
                }
            },
            this
        );
        
        triangleMenu.attr({
            scaleX : 80 / triangleMenu.width,
            scaleY : 80 / triangleMenu.height,
            x : 0,
            y : 0
        });
        triangleMenu.setAnchorPoint(cc.p(0,0));
        this.triangleMenu = triangleMenu;
        
        
        ///// 
        
        var menus = new cc.Menu(circleMenu, rectMenu, triangleMenu);
        	
        menus.alignItemsHorizontally();
        menus.setPosition(cc.p(0,0));
        this.addChild(menus);
    },
    
    setDrawCircleMenuCallback : function(_func, _target){
        
        this.drawCircleCallbackFunc = _func;
        this.drawCircleCallbackTarget = _target;
        this.circleMenu.setCallback(_func, _target);
    },
    
    setDrawRectMenuCallback : function(_func, _target){
        this.drawRectCallbackFunc = _func;
        this.drawRectCallbackTarget = _target;
        this.rectMenu.setCallback(_func, _target);
    },
    
    setDrawTriMenuCallback : function(_func, _target){
        this.drawTriCallbackFunc = _func;
        this.drawTriCallbackTarget = _target;
        this.triangleMenu.setCallback(_func, _target);
    }
});

var WaitLayer = cc.LayerColor.extend({
    sprite:null,
    ctor:function () {
        this._super(cc.color(200,200, 50,100));
        var size = cc.winSize;
        
        // massage.
        var massage = new cc.LabelTTF( msg.waitConnect, "Arial", 38);
        massage.x = size.width / 2;
        massage.y = size.height / 2 + 200;
        this.addChild(massage, 0);
    }
});

var MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var self = this;
        
        var waitLayer = new WaitLayer();
        this.addChild(waitLayer   ,0);
        
        var startGame = function(){
            cc.log("Start game");
            var virtualLayer = new VirtualLayer();
            var mainLayer    = new MainLayer();
            var menuLayer    = new MenuLayer();
            
            menuLayer.setDrawCircleMenuCallback(function(val){
                mainLayer.addCircle();
            }, self);
            
            menuLayer.setDrawRectMenuCallback(function(val){
                mainLayer.addRect();
            }, self);
            
            menuLayer.setDrawTriMenuCallback(function(val){
                mainLayer.addTriAngle();
            }, self);
            
            self.addChild(mainLayer   ,0);
            self.removeChild(waitLayer);
            self.addChild(virtualLayer,1);
            self.addChild(menuLayer,2);
        };
        
        if( mkmk.frameByFrameSyncManager.isHost ){
            rtc_manager.setConnectAction(function(){
                startGame();
            });
        }else{
            rtc_manager.connecting(mkmk.frameByFrameSyncManager.hostPeerID, function(){
                startGame();
            });
        }
    }
});
