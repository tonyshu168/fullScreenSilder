var fullScreenSilder = {

	index: 0,         //页面开始的索引
	easing: "ease",     //动画效果
	durattion: 500,   //持续时间
	loop: false,      //是否循环切换
	pagination: true, //是否进行分页
	keyboard: true,   //是否触发键盘事件
	direction: "horizontal",   //滑动的方向"vertical, horizontal"
	callback: "",     //回调函数
	sectionParent: $(".sections"),
	sections: null,    //所有.section
	pageHeight: 0,        //页面的当前高度
	pageWidth: 0,         //页面的前宽度

	selectors: {
		sections: ".sections",
		section: ".section",
		page: ".pages",
		active: ".active",
	},

	init: function(loop){
		this.sections = this.sectionParent.find(".section");
		this.loop = loop;
		this.pageHeight = this.getPageHeight();
		this.pageWidth = this.getPageWidth();
		this.createGuideBoard(this.direction);
		this.initEvent();
	},

	getPageHeight: function(){
		return innerHeight || Math.min(document.body.clientHeight, document.documentElement.clientHeight);
	},

	getPageWidth: function(){
		return innerWidth || Math.min(document.body.clientWidth, document.documentElement.clientWidth);
	},

	//生成分页指示器
	createGuideBoard: function(direction){
		var me = this;
		var pageHtml = "<ul class='pages " + direction + "'>";
		if(direction == "vertical"){
			pageHtml += "<li class= 'active' style='top:0; right: -2px;'></li>"
			for(i = 1; i < this.sections.length; i ++){
				pageHtml += "<li style='top:0; right: -2px;'></li>";
			}
			pageHtml += "</ul>";
		}
		else{
			pageHtml += "<li class= 'active lf'></li>"
			for(i = 1; i < this.sections.length; i ++){
				pageHtml += "<li class='lf'></li>";
			}
			pageHtml += "</ul>";
			this.sectionParent.css("width","400%")
			this.sections.each(function(){     //给每一个.section添加样式
				$(this).addClass("lf")
				$(this).css("width", (1 / me.sections.length).toFixed(2)*100 + "%")
			})
		}
		$("#container").append(pageHtml);
	},

	//初始化插件事件
	initEvent: function(){
		var self = this;
		var upStart = 0, upEnd = 0,        //向上滑动的开始位置
			leftStart = 0, leftEnd = 0;      //向左滑动的开始位置	

		//添加mousewheel 事件
		self.sectionParent.on("mousewheel DOMMouseScroll", function(e){
			e.preventDefault();
			var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
			if(delta > 0) { var timer = setTimeout(self.prvPage.call(self),500);}
			else{ var timer = setTimeout(self.nextPage.call(self), 500);}
		});

		//添加 click 事件
		document.getElementsByClassName("pages")[0].addEventListener("click", function(e){
			var e = e || event;
			var target = e.target || e.scrElement;
			if(target.tagName == "LI"){
				var index = $(target).index();
				self.scrollPage(index);
			}
		});

		/*支持CSS3动画的浏览器，绑定transitionend事件(即在动画结束后调用起回调函数)*/
		self.sectionParent.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend", function(){
			//
		})

		//添加手势事件
		document.addEventListener('touchstart', touchEvent);

		document.addEventListener('touchmove', touchEvent);

		document.addEventListener('touchend', touchEvent);

		function touchEvent(e){
			var e = e || event;
			switch(e.type){
				case "touchstart":
					var touch = e.touches[0];
					upStart = touch.clientY; 
					break;
				case "touchmove":
					var touch = e.touches[0];
					upEnd = touch.clientY; 
					break;
				case "touchend":
					var touch = e.touches[0];
				 	if(upEnd - upStart > 0){
						self.prvPage();
					}
					else{
						self.nextPage();
					}
			}
		}

		document.addEventListener("keydown", function(e){
			switch(e.keyCode){
				case 37:
				case 38: self.prvPage(); break;
				case 39:
				case 40: self.nextPage();
			}
		})
	},


	//页面滚动
	scrollPage: function(index){
		this.sectionParent.css({     //添加动画效果
				'-webkit-transition': 'all 500ms ' + this.easing,
				'-moz-transition': 'all 500ms ' + this.easing,
				'-o-transition': 'all 500ms ' + this.easing,
				'-ms-trnasition' : 'all 500ms ' + this.easing,
				'transition' : 'all 500ms ' + this.easing
		});
		

		if(this.direction == "vertical") {                //如果direction == "vertical"
			//sections translateY(-index * this.pageHeight)
			this.sectionParent.css({
				'-webkit-transition': 'all 500ms ' + this.easing,
				'transition' : 'all 500ms ' + this.easing,

				'-webkit-transform': 'translateY(' + (-index * this.pageHeight) + 'px)',
				'-moz-transform': 'translateY(' + (-index * this.pageHeight) + 'px)',
				'-o-transform': 'translateY(' + (-index * this.pageHeight) + 'px)',
				'-ms-trnasform' : 'translateY(' + (-index * this.pageHeight) + 'px)',
				'transform' : 'translateY(' + (-index * this.pageHeight) + 'px)',
			});
		}
		else{                               //否则sections translateX(-index * this.pageWidth)
			this.sectionParent.css({
				'width': this.sections.length + '00%',      
				'-webkit-transform': 'translateX(' + (-index * this.pageWidth) + 'px)',
				'-moz-transform': 'translateX(' + (-index * this.pageWidth) + 'px)',
				'-o-transform': 'translateX(' + (-index * this.pageWidth) + 'px)',
				'-ms-trnasform' : 'translateX(' + (-index * this.pageWidth) + 'px)',
				'transform' : 'translateX(' + (-index * this.pageWidth) + 'px)',
			})	
		}
		//索引等于index的分页器加 .active
		$("ul.pages > li").eq(index).addClass("active").siblings(".active").removeClass("active");
		//为索引等于index的section 加 .active
		this.sections.eq(index).addClass("active").siblings(".active").removeClass("active");	
	},

	//向上或向左翻页
	prvPage: function(){
		var self = this;
		var currentIndex = $('.sections >.active').index();
		var maxIndex = $(".section").length - 1;
		if(this.loop){
			switch(currentInex){
				case 0: currentIndex = maxIndex - 1; break;
				default: currentIndex --;
			}
		}
		else{
			switch(currentIndex){
				case 0: return;
				default: currentIndex--; 
			}
		}
		self.scrollPage(currentIndex);
	},

	//向下或向右翻页
	nextPage: function(){
		var self = this;
		var currentIndex = $('.sections >.active').index();
		var maxIndex = $(".section").length - 1;

		if(this.loop){
			switch(currentInex){
				case maxIndex: currentIndex = 0; break;
				default: currentIndex ++;
			}
		}
		else{
			switch(currentIndex){
				case maxIndex: return;
				default: currentIndex++; 
			}
		}
		self.scrollPage(currentIndex);
	}

}

fullScreenSilder.init(0);