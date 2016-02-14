var DrowLayer = cc.LayerColor.extend({
    sprite:null,
    numObjs : 0,
    moveTarget : null,
    figureIndex : 0,
    
    ctor:function () {
        this._super(cc.color(200,200, 50,100), cc.winSize.width/2, cc.winSize.height/2);
        
        // start listening touch event.
        var event = cc.EventListener.create(this.touchEvent);
        cc.eventManager.addListener(event, this);
    },
    
    eraseAll : function(){   
        this.removeAllChildren();
    },
    
    
    /*
     * 正多角形の描画
     * @param {Number} point_num 頂点の数
     * @param {Number} radius 半径
     */
    addRegularPoly : function(point_num, radius){
        
        var node = new cc.DrawNode();
        
        var vecs = [];
        for (var i = 0; i < point_num; i++){
            vecs.push(cc.p( radius * Math.cos(Math.PI/180*(90+360*i/point_num)), 
                            radius * Math.sin(Math.PI/180*(90+360*i/point_num))));
        }
        
        var fillColor = cc.color(255,255,255);
        var lineWidth = 10;
        var color = cc.color(0,0,0);
        
        node.drawPoly(vecs, fillColor, lineWidth, color);
        node.setAnchorPoint(0.5, 0.5);
        
        var posNode = cc.p(radius, this.height - radius);
        node.setPosition(posNode);
        
        this.addChild(node, this.numObjs++);
        node.setTag(this.figureIndex++);
    },
    
    /**
     * 円の描画
     * @param {Number} radius 半径
     */
    addCircle : function( radius ){
        var numPoints = 40; // 円に見えるに十分な数の頂点を設定
        this.addRegularPoly(numPoints,  radius);
    },
    
    
    /**
     * 正三角形の描画
     * @param {Number} radius 半径
     */
    addTriAngle : function( radius ){
        var numPoints = 3;
        this.addRegularPoly(numPoints,  radius);
    },
    
    
    /**
     * 正方形の描画
     * @param {cc.size} 
     */
    addRect : function( size ){
        
        var node = new cc.DrawNode();
        
        var fillColor = cc.color(255,255,255);
        
        var lineWidth = 10;
        var lineColor = cc.color(0,0,0);;
        
        var origin      = cc.p(-size.width/2,-size.height/2);
        var destination = cc.p( size.width/2, size.height/2);
        
        node.drawRect(origin, destination, fillColor, lineWidth, lineColor);
        node.setAnchorPoint(0.5, 0.5);
        
        var pos = cc.p(size.width, this.height - size.height);
        node.setPosition(pos);
        
        this.addChild(node, this.numObjs++);
        node.setTag(this.figureIndex++);
    },
    
    
    /**
     * returns the distance of two positions.
     * @param {cc.p} posA - 1st position.
     * @param {cc.p} posB - 2nd position.
     * @return {Number} distance[pix]
     */   
    getDistance : function(posA, posB) {
        var diffX = (posA.x - posB.x);
        var diffY = (posA.y - posB.y);
        var squareDist = diffX*diffX + diffY*diffY;
        
        return Math.sqrt(squareDist);
    },
    
    
    /**
     * posとrピクセル以内の距離にあるZ-orderが最も大きいオブジェクトを返す
     * rピクセル以内にオブジェクトがない場合はnullを返す
     * @paran {cc.pos} pos
     * @param {cc.DrawNode} figure
     */
    getCloseObject : function( pos, objs ){
            
        var r = 20;
        
        var closeObj = null;
           
        for( var key in objs ){
            var obj = objs[key];
            if( this.getDistance(pos, obj.getPosition()) < r ){
                if( closeObj == null ||  closeObj.getLocalZOrder() < obj.getLocalZOrder() ){
                    closeObj = obj;
                }
            }
        }
            
        return closeObj;
    },

    receiver: function(data) {
        switch(data.action) {
            case "add":
                switch (data.fugure) {
                    case "circle":
                        this.addCircle(data.radius);
                        break;
                    case "rect":
                        this.addRect(cc.size(data.sizex,data.sizey));
                        break;
                    case "tri":
                        this.addTriAngle(data.radius);
                        break;
                }
                break;
            case "move":
                this.getChildByTag(data.target_no).setPosition(this.convertToNodeSpace(data.touch));
                break;
            case "eraseAll":
                this.eraseAll();
                break;
        }
    },

    presentWinner : function(connect_id){
        
        var sprite = new cc.Sprite(res.craker1);

        var offset = connect_id == 2 ? 350 : 0;
        
        sprite.attr({
            scaleX : 50/sprite.width,
            scaleY : 50/sprite.height,
            x : -100+offset,
            y : -80
        });
        this.addChild(sprite);

        // 続くパラパラアニメを登録
        var animation = new cc.Animation();
        animation.addSpriteFrameWithFile(res.craker1);
        animation.addSpriteFrameWithFile(res.craker2);
        animation.addSpriteFrameWithFile(res.craker3);
        animation.setRestoreOriginalFrame(true);   // 最初の画像に戻すかどうか
        //animation->setDelayPerUnit(0.5f / 4.0f);
        animation.setDelayPerUnit(10/30);
    
        // パラパラアニメを動かす
        var animate = new cc.Animate(animation);
        var animated = new cc.RepeatForever(animate);
        //RepeatForever *animated = RepeatForever::create(animate);
        sprite.runAction(animated);

        var text = new cc.LabelTTF("You win!", "Arial", 20);
        
        text.attr({
            x : sprite.x + 60,
            y : -80
        });
        
        
        text.setFontFillColor( cc.color(0,0,0) );
        
        this.addChild(text, 5);
    },

    /**
     * touch event callback.
     */
    touchEvent : {
        event: cc.EventListener.TOUCH_ONE_BY_ONE, // single touch.
        swallowTouches: true, // don't pass to lower layer.
        
        
        
        /**
         * moveTargetを設定する
         */
        onTouchBegan: function (touch, event) {
            cc.log("onTouchBegan in VirtualLayer", touch.getLocationX(), touch.getLocationY());
            var target = event.getCurrentTarget();
          
            var children = target.getChildren();
            
            var pos = target.convertToNodeSpace(touch.getLocation());
            var closeObj = target.getCloseObject(pos, children);
            
            if( !closeObj ){
                return false;
            }
            
            target.moveTarget = closeObj;
            return true;
        },
        
        /**
         * moveTargetを動かす
         */
        onTouchMoved : function (touch, event) {
            // cc.log("onTouchMoved in VirtualLayer");
            var target = event.getCurrentTarget();          
       
            target.moveTarget.setPosition(target.convertToNodeSpace(touch.getLocation()));
            cc.log("tag is " + target.moveTarget.getTag());
            rtc_manager.send({"label":"draw", "action":"move", "target_no":target.moveTarget.getTag(), "touch":touch.getLocation()});
            return true;
        },
        
        /**
         * moveTargetをnullにする
         */
        onTouchEnded : function (touch, event) {
            var target = event.getCurrentTarget();  
            
            target.moveTarget = null;
            
            return false;
        }
    } 
});