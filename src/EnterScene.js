var EnterLayer = cc.LayerColor.extend({
    sprite:null,
    ctor:function () {
        this._super(cc.color(200,200, 50,100));
        var self = this;
        var winSize = cc.winSize;
        
        // show my peerID.
        rtc_manager.init(function(peew_id){
            var peerID_txt = new cc.LabelTTF(msg.showPeerID+rtc_manager.getmyid(), "Arial", 38);
            peerID_txt.x = winSize.width / 2;
            peerID_txt.y = winSize.height / 2 + 200;
            self.addChild(peerID_txt, 5);
        }, close_callback_handler);
        /*
        var bg = new cc.Sprite( res.Background );
        bg.attr({
            scaleX : winSize.width/bg.width,
            scaleY : winSize.height/bg.height,
            anchorX : 0,
            anchorY : 0
        });
        this.addChild(bg, 0);
        */
        // peerID input form.
        var background = new cc.Scale9Sprite(res.Grey);
        var inputForm = new cc.EditBox(new cc.Size(400,70), background);
        inputForm.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        inputForm.attr({    fontSize  : 30
                          , fontColor : cc.color(0,0,0,0) 
                        });
        inputForm.setDelegate(this);
        this.addChild(inputForm);
        
        // text menu (run main scene and wait for my opponent.)
        var waitOpponent_txt = new cc.MenuItemFont( msg.waitForEnemy, function(){
            cc.log("Wait for enemy");
            this.gotoMainScene(null, true);
        }, this);
        waitOpponent_txt.attr({ x: 0, y: -100 });
        this.addChild(new cc.Menu(waitOpponent_txt));
        
        // text menu (connect my opponent's peer and run main scene.)
        var connectPeer_txt = new cc.MenuItemFont( msg.connectPeer, function(){
            var peerID = inputForm.getString();
            this.gotoMainScene(peerID, false);
        }, this );
        connectPeer_txt.attr({ x: 0, y: 100 });
        this.addChild(new cc.Menu(connectPeer_txt));
        
        return true;
    },
      
    /**
     * @override
     */
    editBoxReturn: function (sender) {
        cc.log(sender.getString());
        var peerID = sender.getString();
        this.gotoMainScene(peerID, false);
    },
    
    /**
     * @override
     */
    editBoxTextChanged : function (sender){ 
        cc.log(sender.getString());
    },
    
    /**
     * run main scene.
     */
    gotoMainScene : function(peerID, isHost){
        
        if( !isHost && !peerID ){
            cc.log("Invalid peerID ", peerID);
            return;
        }
        
        mkmk.frameByFrameSyncManager.isHost = isHost;
        mkmk.frameByFrameSyncManager.hostPeerID = peerID;
        cc.director.pushScene(new MainScene());
        cc.director.setNextScene();
    }
});

var EnterScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new EnterLayer();
        this.addChild(layer);
    }
});
