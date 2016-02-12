var MainLayer = cc.LayerColor.extend({
    sprite:null,
    ctor:function () {
        this._super(cc.color(200,200, 50,100));
        var self = this;
        var size = cc.winSize;
        
        // show my peerID.
        var peerID_txt = new cc.LabelTTF(msg.showPeerID+rtc_manager.getmyid(), "Arial", 38);
        peerID_txt.x = size.width / 2;
        peerID_txt.y = size.height / 2 + 200;
        this.addChild(peerID_txt, 5);
        /*
        var bg = new cc.Sprite( res.Background );
        bg.attr({
            scaleX : size.width/bg.width,
            scaleY : size.height/bg.height,
            anchorX : 0,
            anchorY : 0
        });
        this.addChild(bg, 1);
        */
        // show puck.
        /*
        var puck = new cc.Sprite( res.Puck );
     
        var pucksize = { width : 40 ,
                        height : 40,
                        r : 20 };
        
        puck.attr({
            x: size.width / 2,
            y: size.height / 2,
            scaleX : pucksize.width/puck.width,
            scaleY : pucksize.height/puck.height,
            speed : {x : 10, y :10 },
            anchorX : 0.5,
            anchorY : 0.5,
            r : pucksize.r
        });
        this.addChild(puck, 1);
        this.puck = puck;
        
        // show my mallet.
        var mallet = new cc.Sprite( res.Mallet );
        mallet.attr({
            x: mkmk.frameByFrameSyncManager.isHost ? size.width * 2 / 6 : size.width * 4 / 6,
            y: size.height / 2,
            scaleX : 100/mallet.width,
            scaleY : 100/mallet.height,
            anchorX : 0.5,
            anchorY : 0.5,
            r : 50
        });
        this.addChild(mallet, 1);
        this.mallet = mallet;
        
        // show enemy mallet.
        var enemyMallet = new cc.Sprite( res.Mallet );
        enemyMallet.attr({
            x: mkmk.frameByFrameSyncManager.isHost ? size.width * 4 / 6 : size.width * 2 / 6,
            y: size.height / 2,
            scaleX : 100/enemyMallet.width,
            scaleY : 100/enemyMallet.height,
            anchorX : 0.5,
            anchorY : 0.5,
            r : 50
        });
        this.addChild(enemyMallet, 1);
        this.enemyMallet = enemyMallet;
        */
        // start processig received rtc data.
        mkmk.frameByFrameSyncManager.startReceiveFrame();
        
        // start frame processig.
        this.scheduleUpdate();
    },
    
    /**
     * move my mallet.
     * @param {cc.Point}
     */
    moveMyMallet : function(location){
        this.mallet.attr({
            x: location.x,
            y: location.y
        });
    },
    
    /**
     * move enemy's mallet.
     * @param {cc.Point}
     */
    moveEnemyMallet : function(location){
        this.enemyMallet.attr({
            x: location.x,
            y: location.y
        });
    },
    
    /**
     * Collision detecion with window.
     *  update position and speed.
     * @param {cc.Sprite}
     */
    detectCollisionWindow : function(puck){
        
        var winSize = cc.winSize;
        var r = puck.r;
        var hit = false;
        
        if( puck.y + r > winSize.height ){
            // top
            puck.speed.y = - puck.speed.y;
            puck.y = winSize.height - r;
            hit = true;
        }else if( puck.y - r < 0 ){
            // bottom
            puck.speed.y = -puck.speed.y;
            puck.y = r;
            hit = true;
        }
        
        if( puck.x + r > winSize.width ){
            // right
            puck.speed.x = -puck.speed.x;
            puck.x = winSize.width - r;
            hit = true;
        }else if( puck.x - r < 0 ){
            // left
            puck.speed.x = -puck.speed.x;
            puck.x = r;
            hit = true;
        }
        
        if( hit ){
            cc.audioEngine.playEffect(res.Voice);
        }
        
    },
    
    /**
     * Collision detecion with mallet.
     *  update position and speed.
     * @param {cc.Sprite, cc.Sprite}
     */
    detectCollisionMallet : function(puck, mallet){
        
        var distance = cc.pDistance(puck.getPosition(), mallet.getPosition());
        var dist = puck.r + mallet.r;
        
        if( distance > dist ){
            return;
        }
        
        cc.audioEngine.playEffect(res.Voice);
        
        // pack and mallet mustn't be overlap.
        var dX = puck.getPosition().x - mallet.getPosition().x;
        var dY = puck.getPosition().y - mallet.getPosition().y;
        puck.setPosition( mallet.x + dist * dX / distance, mallet.y + dist * dY / distance);
        
        // update speed vector.
        dX = puck.getPosition().x - mallet.getPosition().x;
        dY = puck.getPosition().y - mallet.getPosition().y;
        
        // rotate vector with Affine Transform.
        var vX = ( puck.speed.x *  1 * dX + puck.speed.y * dY )/dist;
        var vY = ( puck.speed.x * -1 * dY + puck.speed.y * dX )/dist ;
        
        // reflect
        vX = -vX;
        
        // Inverse Affine Transform.
        puck.speed.x = ( vX * dX - vY * dY ) / (dist);
        puck.speed.y = ( vX * dY + vY * dX ) / (dist);
    },
    
    /**
     * updatePack.
     *  Collision detection.
     *   - to window.
     *   - to mallets.
     */
    updatePuck : function(dt){
        
        var puck = this.puck;
        var mallet = this.mallet;
        var enemymallet = this.enemyMallet;
        
        // update position normally.
        puck.x += puck.speed.x;
        puck.y += puck.speed.y;
        
        // update property of puck.
        this.detectCollisionWindow(puck);
        // The order is not a problem in the situation two mallets never overlap.
        this.detectCollisionMallet(puck, mallet);
        this.detectCollisionMallet(puck, enemymallet);
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
        
        // adjust my mallet position.
        this.moveMyMallet( cc.p(  data.x,
                                  data.y ));
                                
        // adjust enemy's mallet position.
        this.moveEnemyMallet( cc.p(  enemyData.x,
                                     enemyData.y ));
        
        // determine the puck postision.       
        this.updatePuck(dt);
        
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
       /* 
       if( mkmk.frameByFrameSyncManager.isHost ){
           rtc_manager.setConnectAction(function(){
               startGame();
           });
       }else{
           rtc_manager.connecting(mkmk.frameByFrameSyncManager.hostPeerID, function(){
               startGame();
           });
       }
       */
       startGame();
    }
});
