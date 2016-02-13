var MainLayer = cc.LayerColor.extend({
    sprite:null,
    ctor:function () {
        this._super(cc.color(200,200, 50,100));
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
        
        // start processig received rtc data.
        mkmk.frameByFrameSyncManager.startReceiveFrame();
        
        // start frame processig.
        this.scheduleUpdate();
    },
    
    
    /**
     * location mouse.
     * @param {cc.Point}
     */
    loc_mouse : function(location){
        
        // todo : clip with Window
        // var x = Math.max( this.clipWindow.minX, Math.min(location.x, this.clipWindow.maxX ));
        // var y = Math.max( this.clipWindow.minY, Math.min(location.y, this.clipWindow.maxY ));
        
        this.v_mouse.attr({
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
        
        var node = new cc.DrawNode();
        
        node.drawSegment(
            cc.p(this.v_mouse.prevX, this.v_mouse.prevY), 
            cc.p(this.v_mouse.x, this.v_mouse.y), 
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
        
        if( mkmk.frameByFrameSyncManager.isHost ){
            this.loc_mouse(enemyData);
        }else{
            this.loc_mouse(data);
        }
         
        if( this.v_mouse.touched ){
            this.drawLine();
        }
        
        // frame update success.
        mkmk.frameByFrameSyncManager.incrementFrameCnt();
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
            self.addChild(mainLayer   ,0);
            self.removeChild(waitLayer);
            self.addChild(virtualLayer,1);
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
