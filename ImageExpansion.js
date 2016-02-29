/*
*
*				Image Expansion JS  - Version: 1.0
*					
*				Contact:
*								www.twitter.com/thizk
*								www.facebook.com/briancastellarin
*								@ waiting4youu@hotmail.com


# HTML CODE:
     # Example 1:
		 <a href="//myhosting.com/media/testing.webm" target="_blank"> 
					<img src="//myhosting.com/media/testing_thumb.jpg"  style="height: 70px; width: 125px;">
		 </a>
     
     # Example 2:
		 <a href="//myhosting.com/media/testgif.gif" target="_blank"> 
					<img src="//myhosting.com/media/testgif_thumb.jpg"  style="height: 100px; width: 100px;">
		 </a>
	 
*/

var ImageExpansion  = {
		found: [],
		nofound: [],
		active: [],
		manage: [],
		count: 0,
		pause: null,
		extensions: ['.jpg', '.jpeg', '.png', '.webm', '.gif'],
		videosExtensions: ['.webm', '.flv'],
		expandName: "target_",
};

ImageExpansion.getParent = function(target)
{
			var p = target.parentNode;
			
			if( p.nodeName == 'SPAN' )
					 p = target.parentNode;
			
			if( p.nodeName == 'A' )
			{
					return p;	
			}
};

ImageExpansion.arraySplice = function (array) {
	var e = array[0];
    array.splice(0, 1);
    return e;
}

ImageExpansion.isScaled = function(target)
{
			var source = target.src;
			var result = false, h, sEnding, hEnding;
			var parent = ImageExpansion.getParent(target);
			if( parent )
			{
					if(parent.nodeName == 'A') {
						if( parent.hasAttribute('href')) {
								h = parent.href;
								sEnding = source.substring(source.lastIndexOf('.'), source.length).toLowerCase();
								hEnding = h.substring(h.lastIndexOf('.'), h.length).toLowerCase();
								
								if( sEnding == hEnding || $.inArray(hEnding, ImageExpansion.extensions) != -1 )
								{
											result = true;
								}
						}
					}
			}
			return result;
};

ImageExpansion.Init = function()
{
			var a = (ImageExpansion.found == 0 && ImageExpansion.nofound == 0) ? 1 : 0;
			
			if( a )
			{
					var target = document.getElementsByTagName('img');
					var i;
					for( i = 0; i < target.length; i++) 
					{
							ImageExpansion.process(target[i]);	
					}
					for( i = 0; i < 3; i++)
					{
							ImageExpansion.replaceTargets();	
					}
					
			}
}

ImageExpansion.process = function(target)
{
			if(ImageExpansion.isScaled(target))
			{	
						if(!target.id)
						{
								target.id = ImageExpansion.expandName + ImageExpansion.count;
						}
						
						if(!target.index)
						{
								target.index = ImageExpansion.count;	
						}
						
						ImageExpansion.count++
						ImageExpansion.found.push(target.id);
						
			}
}

ImageExpansion.replaceTargets = function()
{
			var index, target;
			
			if( ImageExpansion.nofound.length > 0 )
			{
					index = ImageExpansion.arraySplice(ImageExpansion.nofound);
					target = document.getElementById(index);
					
					if(target)
					{
							var source = target.src;
							target.removeAttribute('src');
							target.src = source;
					}
					else
						ImageExpansion.replaceNextTarget();
			}
			else if( ImageExpansion.found.length > 0 )
			{
					index = ImageExpansion.arraySplice(ImageExpansion.found);
					target = document.getElementById(index);
					if( target )
					{
							var p = ImageExpansion.getParent(target); 
							if( p )
							{
										ImageExpansion.manageTargets(target);
										ImageExpansion.replaceTarget(p, target);
							}
					}
			}
}

ImageExpansion.manageTargets = function(target)
{
			ImageExpansion.AddEventsToTarget(target);
			ImageExpansion.manage.push(target);
}

ImageExpansion.AddEventsToTarget = function(target)
{
		target.addEventListener('load', function() {
				ImageExpansion.replaceNextTarget();
		});
		target.addEventListener('error', function(){
				ImageExpansion.nofound.push(target.id);
				ImageExpansion.replaceNextTarget();
		});
}

ImageExpansion.replaceNextTarget = function()
{
			setTimeout(function(){
					ImageExpansion.replaceTargets();
			}, 100);
}

ImageExpansion.replaceTarget = function(parent, target)
{
			parent.setAttribute('data-alt', parent.getAttribute('href'));
			parent.removeAttribute('href');
			parent.addEventListener('click', function(){
					ImageExpansion.manageTarget(target.id);
					ImageExpansion.makeTarget(target, parent);
			});
}

ImageExpansion.manageTarget = function(target_id){
		var target = document.getElementById(target_id);
		if(target)
		{
				if(target.hasAttribute('style'))
				{
						target.removeAttribute('style');
						var index = ImageExpansion.manage.indexOf(target);
						if( index > 0 )
						{
								ImageExpansion.manage.splice(index, index);	
						}
				}
				else 
				{
						ImageExpansion.manage.push(target);
				}
		}
}

ImageExpansion.makeTarget = function(target, parent)
{
			var video, image, o , t, e;
			o = parent.getAttribute('data-alt');
			t = target.src;
			e = o.substring(o.lastIndexOf('.'), o.length).toLowerCase();
			
			if($.inArray(e, ImageExpansion.videosExtensions) != -1)
			{
					 	if(video = document.getElementById(ImageExpansion.expandName+"video_"+target.index))
						{
									parent.removeChild(video);
									target.style.display = 'block';
									return;
						}
						
						target.style.display = 'none';
						video = document.createElement('video');
						video.controls = true;
						video.loop = true;
						video.autoplay = true;
						video.volume = 0; 
						video.src = o;
						video.id = ImageExpansion.expandName+"video_"+target.index;
						video.onplay = ImageExpansion.onVideoPlay;
						parent.appendChild(video);
						return;
			}
			
			if( image = document.getElementById(ImageExpansion.expandName+"image_"+target.index) )
			{
							image.src = image.getAttribute('data-alt');
							if( image.hasAttribute('data-style') )
							{
									image.setAttribute('style', image.getAttribute('data-style') );
							}
							image.id = '';
							return;
			}
			
			if( target.hasAttribute('style') )
			{
									target.setAttribute('data-style', target.getAttribute('style') );
									targer.removeAttribute('style');
			}
			target.setAttribute('data-alt', t);
			target.id = ImageExpansion.expandName+"image_"+target.index;
			target.src = o;
			console.log(f);
			
}

ImageExpansion.onVideoPlay = function(video)
{
		if(!ImageExpansion.active.length){
				document.addEventListener('scroll', ImageExpansion.onWindowScroll, false );
		}
		
		ImageExpansion.active.push(video);	
}

ImageExpansion.onWindowScroll = function()
{
		clearTimeout(ImageExpansion.pause);
		ImageExpansion.pause = setTimeout(ImageExpansion.onPauseVideo, 500);	
}

ImageExpansion.onPauseVideo = function(){
		var videos = [], pos , min, max, i , e;
		
		min = window.pageYOffset;
		max = window.pageYOffset +  document.documentElement.clientHeight;
		
		for(i = 0; e = ImageExpansion.active[i];++i)
		{
					pos = e.getBoundingClientRect();
					if (pos.top + window.pageYOffset > max || pos.bottom + window.pageYOffset < min) {
					 		e.pause();
					}
					else if (!e.paused){
					 		 videos.push(e);
					}
		}
		
		if(!videos.length)
		{
				document.removeEventListener('scroll', ImageExpansion.onWindowScroll, false );
		}
		
		ImageExpansion.active = videos;
}

$(document).ready(function(e) {
			ImageExpansion.Init();
});

