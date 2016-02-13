/* global width */
var MenuLayer = cc.LayerColor.extend({
    sprite:null,
    mainLayer:null,
    
    makeMenuItem : function(_name, _resource, _size){
        
        var menu = new cc.MenuItemImage(
            _resource,  
            _resource, 
            _resource
        );
        
        menu.attr({
            scaleX : _size/ menu.width,
            scaleY : _size / menu.height
        });
        
        menu.setName(_name);
      
        return menu;
    },
    
    ctor:function () {
        this._super(cc.color(200,200, 50,100), cc.winSize.width, 80);
       
        var circleL =    this.makeMenuItem("circleL", res.Puck, 80 );
        var circleM =    this.makeMenuItem("circleM", res.Puck, 80 );
        var circleS =    this.makeMenuItem("circleS", res.Puck, 80 );
        
        var rectL =      this.makeMenuItem("rectL", res.Puck, 80 );
        var rectM =      this.makeMenuItem("rectM", res.Puck, 80 );
        var rectS =      this.makeMenuItem("rectS", res.Puck, 80 );
        
        var triL =       this.makeMenuItem("triL", res.Puck, 80 );
        var triM =       this.makeMenuItem("triM", res.Puck, 80 );
        var triS =       this.makeMenuItem("triS", res.Puck, 80 );
        
        var menusCircle = new cc.Menu(circleL, circleM, circleS );
        var menusRect   = new cc.Menu(rectL, rectM, rectS );
        var menusTri    = new cc.Menu(triL, triM, triS );
        
        menusCircle.alignItemsHorizontally();
        menusCircle.alignItemsHorizontallyWithPadding(0);
        menusRect.alignItemsHorizontally();
        menusRect.alignItemsHorizontallyWithPadding(0);
        menusTri.alignItemsHorizontally();
        menusTri.alignItemsHorizontallyWithPadding(0);
        // menus.alignItemsVerticallyWithPadding(0);
        // menus.alignItemsInColumns(3,3,3);
        // menus.alignItemsInRows(3,3,3);
        
        menusCircle.setPosition(cc.p(200,100));
        menusRect.setPosition(cc.p(200,200));
        menusTri.setPosition(cc.p(200,300));
        
        this.menus = [menusCircle, menusRect, menusTri];
        this.addChild(menusCircle);
        this.addChild(menusRect);
        this.addChild(menusTri);
    },
    
    findChildFromMenuByName : function(_name){
        
        for( var key in this.menus){
            var menus = this.menus[key];
            var menu = menus.getChildByName(_name);
            if( !!menu ){
                return menu;
            }
        }
        
        return null;
    },
    
    setItemCallback : function(_name, _func, _target){
        
        var menu = this.findChildFromMenuByName(_name);
        
        if( !menu ){
            return;
        }
        
        menu.setCallback(_func, _target);
    }
    
});