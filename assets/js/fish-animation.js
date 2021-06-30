(function($) {
	var pluginName='fishAnimation',
		init_arr=[],
		tickInit=false,
		defaults={
			fishImage:'assets/img/fish/tadpole-sprite-fix3.png',
			fishFinImage:'assets/img/fish/fin.png',
			spritesheetSpeed:1,
			colour:'#E5E5E5',
			number:30,
			swimspeed:10,
			downspeed:.97,
			rounder:5,
			turning:5,
			scaleRange:1,
			swimTimer:190,
			canvasW:0,
			canvasH:0,
			scalePercent:1,
			manifest:[],
			fishArray:[],
			isLoaded:false,
			browserSupport:false,
			fishImageW:46,
			fishImageH:102,
			fishImageRegX:7,
			fishImageRegY:20,
			fishFinImageW:12,
			fishFinImageH:14,
			fishFinImageRegX:16,
			fishFinImageRegY:12,
			interact:false
        };
	
	/*!
	 * 
	 * INIT - This is the function that runs to init
	 * 
	 */
	$.fn[pluginName]=function(options,value,value2) {
		if(typeof options=='string'){
			var $this=$(this);
			var _opts=$this.data('plugin_'+pluginName);
			if(_opts!=undefined)
				$.fn[pluginName].commandFishAnimation(this,options,value,value2)
		}else{
			return this.each(function () {
				var $this=$(this);
				var _opts=$this.data('plugin_'+pluginName);
				$.fn[pluginName].destroy($this);
				
				var _opts=$.extend({},defaults,options);
				$this.data('plugin_' + pluginName, _opts);
				
				init_arr.push($this);
				$.fn[pluginName].detectBrowser($this);
			});
		}
	}
	
	$.fn[pluginName].detectBrowser=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			
			var canvasEl = document.createElement('canvas');
			if(canvasEl.getContext){
				_opts.browserSupport=true;
			}
			if(_opts.browserSupport){
				if(!_opts.isLoaded){
					_opts.isLoaded=true;
					$.fn[pluginName].initPreload(_self);
				}
			}
		});
	}
	
	/*!
	 * 
	 * START CANVAS PRELOADER - This is the function that runs to preload canvas asserts
	 * 
	 */
	$.fn[pluginName].initPreload=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			
			_opts.stageW = _opts.canvasW = _self.attr('width');
			_opts.stageH = _opts.canvasH = _self.attr('height');
			
			_opts.manifest = [];
			_opts.fishArray = [];
			_opts.manifest.push({src:_opts.fishImage, id:'fish', type: createjs.LoadQueue.IMAGE});
			_opts.manifest.push({src:_opts.fishFinImage, id:'fishFin', type: createjs.LoadQueue.IMAGE});
			
			_opts.loader = new createjs.LoadQueue(false);
			_opts.loader.on("complete", function(){
				$.fn[pluginName].handleLoaderComplete(_self);
			});
			_opts.loader.on("progress", function(){
				$.fn[pluginName].handleLoaderProgress(_self);	
			});
			
			_opts.loader.loadManifest(_opts.manifest);
		});
	}
	
	$.fn[pluginName].handleLoaderComplete=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			
			$.fn[pluginName].initFishCanvas(_self);
			$.fn[pluginName].buildFishCanvas(_self);
			$.fn[pluginName].createFishes(_self);
		});
	}
	
	$.fn[pluginName].handleLoaderProgress=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			//_self.find('div#loader').html(_opts.loader.progress/1*100);
		});
    }
	
	/*!
	 * 
	 * START BUILD CANVAS - This is the function that runs to build canvas
	 * 
	 */
	$.fn[pluginName].initFishCanvas=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			
			_opts.stage = new createjs.Stage(_self.attr('id'));
			
			if(_opts.interact){
				createjs.Touch.enable(_opts.stage);
				_opts.stage.enableMouseOver(20);
				_opts.stage.mouseMoveOutside = true;	
			}
			
			if(!tickInit){
				tickInit = true;
				createjs.Ticker.setFPS(60);
				createjs.Ticker.addEventListener("tick",  $.fn[pluginName].tick);	
			}
		});
    }
	
	$.fn[pluginName].buildFishCanvas=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			
			_opts.itemCanvasContainer = new createjs.Container();
			
			var _frame = {"regX": _opts.fishImageRegX, "regY": _opts.fishImageRegY, "height": _opts.fishImageH, "count": 91, "width": _opts.fishImageW};
			var _animations = {static:{frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,32], speed: _opts.spritesheetSpeed, next:'static'},
							turnsoft:{frames: [33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], speed: _opts.spritesheetSpeed, next:'static'},
							turnmedium:{frames: [51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68], speed: _opts.spritesheetSpeed, next:'static'},
							turnhard:{frames: [69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90], speed: _opts.spritesheetSpeed, next:'static'}};
								
			_opts.fishData = new createjs.SpriteSheet({
				"images": [_opts.loader.getResult('fish').src],
				"frames": _frame,
				"animations": _animations
			});
			
			_opts.fishAnimate = new createjs.Sprite(_opts.fishData, "static");
			_opts.fishAnimate.framerate = 20;
			
			var _frame = {"regX": _opts.fishFinImageRegX, "regY": _opts.fishFinImageRegY, "height": _opts.fishFinImageH, "count": 23, "width": _opts.fishFinImageW};
			var _animations = {static:{frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22], speed: _opts.spritesheetSpeed, next:'static'}};
								
			_opts.fishFinData = new createjs.SpriteSheet({
				"images": [_opts.loader.getResult('fishFin').src],
				"frames": _frame,
				"animations": _animations
			});
			
			_opts.fishFinLeftAnimate = new createjs.Sprite(_opts.fishFinData, "static");
			_opts.fishFinLeftAnimate.framerate = 20;
			
			_opts.fishFinRightAnimate = new createjs.Sprite(_opts.fishFinData, "static");
			_opts.fishFinRightAnimate.framerate = 20;
			_opts.fishFinRightAnimate.scaleX = -1;
			
			_opts.fishAnimate.x -= 200;
			_opts.fishFinLeftAnimate.x -= 200;
			_opts.fishFinRightAnimate.x -= 200;
			
			var mask = new createjs.Shape();
			mask.graphics.beginFill('red').drawRect(0, 0, _opts.fishImageW, _opts.fishImageH);
			
			_opts.itemCanvasContainer.addChild(_opts.fishAnimate, _opts.fishFinLeftAnimate, _opts.fishFinRightAnimate);
			_opts.stage.addChild(_opts.itemCanvasContainer);
			
			$.fn[pluginName].resizeCanvas(_self);
		});
    }
	
	$.fn[pluginName].resizeCanvas=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data( 'plugin_' + pluginName);
			if(_opts.itemCanvasContainer!=undefined){
				_opts.itemCanvasContainer.scaleX=_opts.itemCanvasContainer.scaleY=_opts.scalePercent;
			}
		});
	}
	
	$.fn[pluginName].resizeHolder=function(obj, newW, newH) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data( 'plugin_' + pluginName);
			
			_opts.scalePercent = newW/stageW;
				
			if((_opts.stageH*_opts.scalePercent)>newW){
				_opts.scalePercent = newH/_opts.stageH;
			}
			
			var wineCanvas = document.getElementById(_self.attr('id'));
			wineCanvas.width=_opts.stageW*_opts.scalePercent;
			wineCanvas.height=_opts.stageH*_opts.scalePercent;
			
			$.fn[pluginName].resizeCanvas(_self);
		});
	}
	
	/*!
	 * 
	 * FISHES - This is the function that runs to create fishes
	 * 
	 */
	 $.fn[pluginName].createFishes=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data( 'plugin_' + pluginName);
			
			for(f=0;f<_opts.number;f++){
				$.fn[pluginName].createFish(_self);	
			}
			
			$.fn[pluginName].updateFishes(_self, 'colour');
		});
    }
	
	 $.fn[pluginName].createFish=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data( 'plugin_' + pluginName);
			
			var newFish = _opts.fishAnimate.clone();
			var newFinLeft = _opts.fishFinLeftAnimate.clone();
			var newFinRight = _opts.fishFinRightAnimate.clone();
			
			newFish.scaleNum = Math.floor(Math.random()*5) * .1;
			newFish.scale = newFish.scaleNum * _opts.scaleRange;
			newFish.type = 1;
			newFish.swimspeed = _opts.swimspeed;
			newFish.turn = Math.random()*180;
			newFish.swimTimer = _opts.swimTimer + (Math.random()*(_opts.swimTimer/2));
			
			var finPlay = Math.floor(Math.random()*_opts.fishFinData.getNumFrames()-1);
			newFinLeft.gotoAndPlay(Math.floor(Math.random()*finPlay));
			newFinRight.gotoAndPlay(Math.floor(Math.random()*finPlay));
			
			newFish.scaleX = newFish.scaleY = newFish.scale;
			newFinLeft.scaleX = newFinLeft.scaleY = newFish.scale;
			newFinRight.scaleY = newFish.scale;
			newFinRight.scaleX = -(newFish.scale);
			
			newFish.id = _opts.fishArray.length - 1;
			_opts.fishArray.push({fish:newFish, finLeft:newFinLeft, finRight:newFinRight});
			var id = _opts.fishArray.length-1;
			
			newFish.x = (Math.random() * (_opts.canvasW/100 * 60)) + (_opts.canvasW/100 * 20);
			newFish.y = (Math.random() * (_opts.canvasH/100 * 60)) + (_opts.canvasH/100 * 20);
			newFish.rotation = Math.floor(Math.random() * 360 - 180);
			
			_opts.itemCanvasContainer.addChild(newFish, newFinLeft, newFinRight);
			
			if(_opts.interact){
				newFish.addEventListener("mouseover", function(evt) {
					$.fn[pluginName].setFishRotate(_self, evt.target.id);
					evt.target.swimspeed = _opts.swimspeed * 4;
				});
			}
		});
    }
	
	$.fn[pluginName].moveFish=function(obj, id) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data( 'plugin_' + pluginName);
			
			var fish = _opts.fishArray[id].fish;
			var fishFinLeft = _opts.fishArray[id].finLeft;
			var fishFinRight = _opts.fishArray[id].finRight;
			
			fish.updateCache();
			fishFinLeft.updateCache();
			fishFinRight.updateCache();
			
			if(fish.swimTimer <= 0){
				fish.swimTimer = _opts.swimTimer + (Math.random()*(_opts.swimTimer/3));
				$.fn[pluginName].setFishRotate(_self, id);
			}else{
				fish.swimTimer--;	
			}
			
			if(fish.currentFrame < 32){
				fish.type = 1;	
			}
			
			fish.x += fish.swimspeed*Math.sin(fish.rotation*Math.PI/180);
			fish.y -= fish.swimspeed*Math.cos(fish.rotation*Math.PI/180);
			fish.rotation += (fish.turn-fish.rotation)/_opts.rounder;
			
			fish.swimspeed *= _opts.downspeed;
		});
    }
	
	$.fn[pluginName].setFishRotate=function(obj, id) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data( 'plugin_' + pluginName);
			
			var fish = _opts.fishArray[id].fish;
			fish.swimspeed = _opts.swimspeed;
			
			var mtop = _opts.canvasH/100 * 20;
			var mbottom = _opts.canvasH/100 * 80;
			var mright = _opts.canvasW/100 * 80;
			var mleft = _opts.canvasW/100 * 20;
			
			if (fish.y<mtop) {
				if (fish.rotation<0) {
					fish.turn = -(randomRotate(120));
					if (fish.x<mleft) {
						fish.turn = -(randomRotate(150));
					}
				} else {
					fish.turn = randomRotate(120);
					if (fish.x>mright) {
						fish.turn = randomRotate(150);
					}
				}
			} else if (fish.y>mbottom) {
				if (fish.rotation<0) {
					fish.turn = -(randomRotate(60));
					if (fish.x>mleft) {
						fish.turn = -(randomRotate(30));
					}
				} else {
					fish.turn = randomRotate(60);
					if (fish.x<mright) {
						fish.turn = randomRotate(30);
					}
				}
			} else if (fish.x>mright) {
				if (fish.rotation<90) {
					fish.turn = -(randomRotate(30));
					if (fish.y<mtop) {
						fish.turn = -(randomRotate(60));
					}
				} else {
					fish.turn = -(randomRotate(150));
					if (fish.y<mbottom) {
						fish.turn = -(randomRotate(120));
					}
				}
			} else if (fish.x<mleft) {
				if (fish.rotation>-90) {
					fish.turn = randomRotate(30);
					if (fish.y<mtop) {
						fish.turn = randomRotate(60);
					}
				} else {
					fish.turn = randomRotate(150);
					if (fish.y>mbottom) {
						fish.turn = randomRotate(120);
					}
				}
			}
			
			fish.turn += Math.floor(Math.pow(Math.random()*_opts.turning-(_opts.turning/2), 3));
			if (fish.type == 1) {
				if (90<(fish.turn-fish.rotation)) {
					fish.type = 2;
					fish.scaleX = fish.scale;
					fish.gotoAndPlay('turnhard');
				} else if (-90>(fish.turn-fish.rotation)) {
					fish.type = 3;
					fish.scaleX = -(fish.scale);
					fish.gotoAndPlay('turnhard');
				} else if (60<(fish.turn-fish.rotation)) {
					fish.type = 4;
					fish.scaleX = (fish.scale);
					fish.gotoAndPlay('turnmedium');
				} else if (-60>(fish.turn-fish.rotation)) {
					fish.type = 5;
					fish.scaleX = -(fish.scale);
					fish.gotoAndPlay('turnmedium');
				} else if (30<(fish.turn-fish.rotation)) {
					fish.type = 6;
					fish.scaleX = (fish.scale);
					fish.gotoAndPlay('turnsoft');
				} else if (-30>(fish.turn-fish.rotation)) {
					fish.type = 7;
					fish.scaleX = -(fish.scale);
					fish.gotoAndPlay('turnsoft');
				}
			}
		});
    }
	
	/*!
	 * 
	 * UPDATE FISHES - This is the function that runs to updated fishes
	 * 
	 */
	$.fn[pluginName].updateFishes=function(obj, update) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data( 'plugin_' + pluginName);
			
			if(update == 'colour'){
				for(t=0;t<_opts.fishArray.length;t++){
					var curFish = _opts.fishArray[t].fish;
					var curFinLeft = _opts.fishArray[t].finLeft;
					var curFinRight = _opts.fishArray[t].finRight;
					
					curFish.uncache();
					curFinLeft.uncache();
					curFinRight.uncache();
					
					var hex = _opts.colour.replace('#','');
					var reg = hex.length === 3 ? hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2] : hex;
					var conv = reg.match(/.{2}/g);
					
					var r = parseInt(conv[0],16);
					var g = parseInt(conv[1],16);
					var b = parseInt(conv[2],16);
					
					curFish.filters = curFinLeft.filters = curFinRight.filters = [new createjs.ColorFilter(0,0,0, 1, r,g,b, 0)];
					curFish.cache(-(_opts.fishImageRegX), -(_opts.fishImageRegY), _opts.fishImageW, _opts.fishImageH);
					curFinLeft.cache(-(_opts.fishFinImageRegX), -(_opts.fishFinImageRegY), _opts.fishFinImageW, _opts.fishFinImageH);
					curFinRight.cache(-(_opts.fishFinImageRegX), -(_opts.fishFinImageRegY), _opts.fishFinImageW, _opts.fishFinImageH);	
				}
			}else if(update == 'scaleRange'){
				for(t=0;t<_opts.fishArray.length;t++){
					var curFish = _opts.fishArray[t].fish;
					var curFinLeft = _opts.fishArray[t].finLeft;
					var curFinRight = _opts.fishArray[t].finRight;
					
					curFish.scale = curFish.scaleNum * _opts.scaleRange;
					curFish.scaleX = curFish.scaleY = curFish.scale;
					curFinLeft.scaleX = curFinLeft.scaleY = curFish.scale;
					curFinRight.scaleY = curFish.scale;
					curFinRight.scaleX = -(curFish.scale);
				}
			}else if(update == 'number'){
				if(_opts.number > _opts.fishArray.length){
					for(t=_opts.fishArray.length;t<_opts.number;t++){
						$.fn[pluginName].createFish(_self);
					}
					$.fn[pluginName].updateFishes(_self, 'colour');
				}else{
					for(t=_opts.number;t<_opts.fishArray.length;t++){
						var curFish = _opts.fishArray[t].fish;
						var curFinLeft = _opts.fishArray[t].finLeft;
						var curFinRight = _opts.fishArray[t].finRight;
						_opts.itemCanvasContainer.removeChild(curFish, curFinLeft, curFinRight);
						_opts.fishArray.splice(t, 1);
					}	
				}
			}
		});
    }
	
	/*!
	 * 
	 * CANVAS LOOP - This is the function that runs for canvas loop
	 * 
	 */
	 $.fn[pluginName].tick=function() {
		 for(n=0;n<init_arr.length;n++){
			 var _self=init_arr[n];
			 var _opts=_self.data( 'plugin_' + pluginName);
			
			if(_opts.fishArray.length > 0){
				for(f=0;f<_opts.fishArray.length;f++){
					_opts.fishArray[f].finLeft.x = _opts.fishArray[f].finRight.x = _opts.fishArray[f].fish.x;
					_opts.fishArray[f].finLeft.y = _opts.fishArray[f].finRight.y = _opts.fishArray[f].fish.y;
					_opts.fishArray[f].finLeft.rotation = _opts.fishArray[f].finRight.rotation = _opts.fishArray[f].fish.rotation;
					
					$.fn[pluginName].moveFish(_self, f);
				}
				
				_opts.stage.update();
			}
		 }
	 }

	/*!
	 * 
	 * UPDATE FISH ANIMATION SETTINGS - This is the function that runs to update fish animation settings
	 * 
	 */
	$.fn[pluginName].commandFishAnimation=function(obj,command,value,value2){
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			
			switch(command) {
				case 'destroy':
					$.fn[pluginName].destroy(_self);
					break;
				default:
					if(_opts[value]!=undefined){
						_opts[value]=value2;
						
						if(value == 'number'){
							$.fn[pluginName].updateFishes(_self, 'number');
						}else if(value == 'scaleRange'){
							$.fn[pluginName].updateFishes(_self, 'scaleRange');
						}else if(value == 'colour'){
							$.fn[pluginName].updateFishes(_self, 'colour');
						}
					}
			}
		});
	}
	
	/*!
	 * 
	 * DESTROY FISH ANIMATION - This is the function that runs to destroy fish animation
	 * 
	 */
	$.fn[pluginName].destroy=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			
			if(_opts != undefined){
				if(_opts.isLoaded){
					_opts.isLoaded = false;
					_opts.loader = null;
					
					_opts.stage.autoClear = true;
					_opts.stage.removeAllChildren();
					_opts.stage.update();
					
					var indexNum = init_arr.indexOf(_self);
					init_arr.splice(indexNum, 1);
					
					createjs.Ticker.removeEventListener("tick", _opts.stage);
					
					if(init_arr.length == 0){
						tickInit = false;
						createjs.Ticker.removeEventListener("tick", $.fn[pluginName].tick);
					}
				}
			}
		});
    }
	
	function randomRotate(range){
		return range + Math.floor(Math.random()*(range/3));
	}

})(jQuery);