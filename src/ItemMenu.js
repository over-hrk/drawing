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
            scaleY : 80 / circleMenu.height
            //x : 0,
            //y : 0
        });
        // circleMenu.setAnchorPoint(cc.p(0,0));
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
            scaleY : 80 / rectMenu.height
            //x : 0,
            //y : 0
        });
        // rectMenu.setAnchorPoint(cc.p(0,0));
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
            scaleY : 80 / triangleMenu.height
            // x : 0,
            // y : 0
        });
        // triangleMenu.setAnchorPoint(cc.p(0,0));
        this.triangleMenu = triangleMenu;
        
        
        ///// 
        
        var menus = new cc.Menu(circleMenu, rectMenu, triangleMenu);
        	
        menus.alignItemsHorizontally();
        // menus.setAnchorPoint(cc.p(0,0));
        menus.setPosition(cc.p(100,50));
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