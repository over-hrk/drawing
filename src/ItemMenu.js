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
            scaleY : _size / menu.width
        });
        
        menu.setName(_name);
      
        return menu;
    },
    
    ctor:function () {
        this._super(cc.color(200,200, 50,100), cc.winSize.width, 80);
       
        var menuSize = 40;
       
        var circleL =    this.makeMenuItem("circleL", res.circleL, menuSize );
        var circleM =    this.makeMenuItem("circleM", res.circleM, menuSize );
        var circleS =    this.makeMenuItem("circleS", res.circleS, menuSize );
        
        var rectL =      this.makeMenuItem("rectL", res.rectL, menuSize );
        var rectM =      this.makeMenuItem("rectM", res.rectM, menuSize );
        var rectS =      this.makeMenuItem("rectS", res.rectS, menuSize );
        
        var triL =       this.makeMenuItem("triL", res.triL, menuSize );
        var triM =       this.makeMenuItem("triM", res.triM, menuSize );
        var triS =       this.makeMenuItem("triS", res.triS, menuSize );
        
        var erase =      this.makeMenuItem("erase", res.erase, 100 );
        
        var menusCircle = new cc.Menu(circleL, circleM, circleS );
        var menusRect   = new cc.Menu(rectL, rectM, rectS );
        var menusTri    = new cc.Menu(triL, triM, triS );
        var eraseButton = new cc.Menu(erase);
        
        menusCircle.alignItemsHorizontally();
        menusCircle.alignItemsHorizontallyWithPadding(0);
        menusRect.alignItemsHorizontally();
        menusRect.alignItemsHorizontallyWithPadding(0);
        menusTri.alignItemsHorizontally();
        menusTri.alignItemsHorizontallyWithPadding(0);
        
        menusRect.setPosition(cc.p(0,200));
        menusCircle.setPosition(cc.p(0,150));
        menusTri.setPosition(cc.p(0,100));
        eraseButton.setPosition(cc.p(0,50));
        
        this.menus = [menusCircle, menusRect, menusTri, eraseButton];
        this.addChild(menusCircle);
        this.addChild(menusRect);
        this.addChild(menusTri);
        this.addChild(eraseButton);
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