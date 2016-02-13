var VirtualLayer = cc.LayerColor.extend({
    sprite:null,
    /**
     * Constructor
     * Initialize mallet, and start listening touch event.
     */
    ctor : function () {
        this._super(cc.color(128,128, 128,128)); // 仮色
        var winSize = cc.winSize;
        // this.setVisible(cc.game.config[cc.game.CONFIG_KEY.debugMode]);
        this.setVisible(false);
        
        // virtual mouse
        var v_mouse = new cc.Node();
        v_mouse.attr({
            x: winSize.width / 2,
            y: winSize.height / 2,
            scaleX : 100/v_mouse.width,
            scaleY : 100/v_mouse.height,
            anchorX : 0.5,
            anchorY : 0.5,
            touched : false,
            prevX : winSize.width / 2,
            prevY : winSize.height / 2,
        });
        this.addChild(v_mouse, 1);
        this.v_mouse = v_mouse;
        
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
        // this.scheduleUpdate();
    },
    
    /**
     * location mouse.
     * @param {cc.Point}
     */
    loc_mouse : function(location, prevLocation){
        
        // todo : clip with Window
        // var x = Math.max( this.clipWindow.minX, Math.min(location.x, this.clipWindow.maxX ));
        // var y = Math.max( this.clipWindow.minY, Math.min(location.y, this.clipWindow.maxY ));
        
        this.v_mouse.attr({
            x: location.x,
            y: location.y,
            prevX : prevLocation.x,
            prevY : prevLocation.y
        });
    },
    
    setMouseTouch : function(isTouched){
        this.v_mouse.touched = isTouched;
    },
    
    /**
     * touch event callback.
     */
    touchEvent : {
        event: cc.EventListener.TOUCH_ONE_BY_ONE, // single touch.
        swallowTouches: true, // don't pass to lower layer.
        onTouchBegan: function (touch, event) {
            // cc.log("onTouchBegan in VirtualLayer");
            var target = event.getCurrentTarget();
            target.setMouseTouch(true);
            
            target.loc_mouse(touch.getLocation(), touch.getPreviousLocation());
            
            return true;
        },
        
        
        
        onTouchMoved : function (touch, event) {
            // cc.log("onTouchMoved in VirtualLayer");
            
            var target = event.getCurrentTarget();          
            target.loc_mouse(touch.getLocation(), touch.getPreviousLocation());
            
            return true;
        },
        
        
        onTouchEnded : function (touch, event) {
            var target = event.getCurrentTarget();  
            target.setMouseTouch(false);
            
            return false;
        } 
    },
    
    /**
     * processing per frame.
     */
    update : function(){
        // cc.log("Send this.v_mouse", this.v_mouse.x, this.v_mouse.y, this.v_mouse.touched);
        
        var mouseEvent = {
            x : this.v_mouse.x,
            y : this.v_mouse.y,
            isTouched : this.v_mouse.touched,
            prevX : this.v_mouse.prevX,
            prevY : this.v_mouse.prevY            
        };
        
        mkmk.frameByFrameSyncManager.pushFrameData(mouseEvent);
    }
});