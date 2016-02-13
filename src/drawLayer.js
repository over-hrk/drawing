var DrowLayer = cc.LayerColor.extend({
    sprite:null,
    numObjs : 0,
    moveTarget : null,
    
    ctor:function () {
        this._super(cc.color(200,200, 50,100), cc.winSize.width/2, cc.winSize.height/2);
        
        // start listening touch event.
        var event = cc.EventListener.create(this.touchEvent);
        cc.eventManager.addListener(event, this);
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