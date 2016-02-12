var VirtualLayer = cc.LayerColor.extend({
    sprite:null,
    /**
     * Constructor
     * Initialize mallet, and start listening touch event.
     */
    ctor : function () {
        this._super(cc.color(128,128, 128,128)); // 仮色
        var winSize = cc.winSize;
        this.setVisible(cc.game.config[cc.game.CONFIG_KEY.debugMode]);
        
        // virtual mallet
        /*
        var mallet = new cc.Sprite( res.Mallet );
        mallet.attr({
            x: mkmk.frameByFrameSyncManager.isHost ? winSize.width * 2 / 6 : winSize.width * 4 / 6,
            y: winSize.height / 2,
            scaleX : 100/mallet.width,
            scaleY : 100/mallet.height,
            anchorX : 0.5,
            anchorY : 0.5,
            r : 50
        });
        this.addChild(mallet, 1);
        this.mallet = mallet;
        */
        // set clip window
        /*
        this.clipWindow = (function(){
            
            var offsetX = mkmk.frameByFrameSyncManager.isHost ? 0 : winSize.width  / 2;
            var r = mallet.r;
        
            return {
                minX : r + offsetX,
                maxX : winSize.width / 2 - r + offsetX,
                minY : r,
                maxY : winSize.height - r
            };    
        })();
        */
        // start listening touch event.
        var event = cc.EventListener.create(this.touchEvent);
        cc.eventManager.addListener(event, this);
        
        // start frame processig.
        this.scheduleUpdate();
    },
    
    /**
     * move mallet.
     * @param {cc.Point}
     */
    moveMallet : function(location){
        
        // clip
        var x = Math.max( this.clipWindow.minX, Math.min(location.x, this.clipWindow.maxX ));
        var y = Math.max( this.clipWindow.minY, Math.min(location.y, this.clipWindow.maxY ));
        
        this.mallet.attr({
            x: x,
            y: y
        });
    },
    
    /**
     * touch event callback.
     */
    touchEvent : {
        event: cc.EventListener.TOUCH_ONE_BY_ONE, // single touch.
        swallowTouches: true, // don't pass to lower layer.
        onTouchBegan: function (touch, event) {
            // cc.log("onTouchBegan in VirtualLayer");
            // var target = event.getCurrentTarget();
            // target.moveMallet(touch.getLocation());
            return true;
        },
        onTouchMoved : function (touch, event) {
            // cc.log("onTouchMoved in VirtualLayer");
            var target = event.getCurrentTarget();
            // target.moveMallet(touch.getLocation());  
            var node = new cc.DrawNode();
            // node.drawDot(touch.getLocation(), 10, cc.color(0,0,0));
            
           	
            node.drawSegment(
                touch.getPreviousLocation(), 
                touch.getLocation(), 
                5, 
                cc.color(0,0,0)
            ); 
            
            target.addChild(node);
            return false;
        }
    },
    
    /**
     * processing per frame.
     */
    update : function(){
        
        var malltLoc = {
            //x : this.mallet.getPositionX(),
            //y : this.mallet.getPositionY()
        };
        
        mkmk.frameByFrameSyncManager.pushFrameData(malltLoc);
    }
});