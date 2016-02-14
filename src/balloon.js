var TextInputLayer = cc.LayerColor.extend({
    sprite:null,
    inputForm:null,
    
    ctor:function (_size) {
        this._super(cc.color(25,25, 25,0), _size.width, _size.height);
        var winSize = cc.winSize;
        
        var background = new cc.Scale9Sprite(res.clear);
        var inputForm = new cc.EditBox(cc.size(_size.width/2,_size.height/2), background);
        inputForm.setPosition(cc.p(_size.width / 2, _size.height / 2));
        // inputForm.setAnchorPoint(0.5,0.5);
        inputForm.attr({    fontSize  : 20
                          , fontColor : cc.color(0,0,0,0) 
                        });
        inputForm.setDelegate(this);
        this.addChild(inputForm);
        
        this.inputForm = inputForm;
    },
    
    /**
     * @override
     */
    editBoxReturn: function (sender) {
        cc.log(sender.getString());
        /// var text = sender.getString();
    },
    
    /**
     * @override
     */
    editBoxTextChanged : function (sender){ 
        cc.log(sender.getString());
        var client_no = rtc_manager.get_client_no();
        rtc_manager.send({"label":"balloon", "message":sender.getString(), "client_no":client_no});
    },
    
    
    
    receiver : function(data){
        this.inputForm.setString(data.message);
    }
    
});