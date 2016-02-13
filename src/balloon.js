var TextInputLayer = cc.LayerColor.extend({
    sprite:null,
    
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
    }
    
    
});