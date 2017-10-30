var shp=0;
var r=0;
var pt = { x:0, y:0 };
var shapes = {
B:[`
**
**`],
I:[`
****`,`
*
*
*
*`],
LL:[`
 *
 *
**`,`
*
***`,`
**
*
*`,`
***
  *`],
RL:[`
*
*
**`,`
***
*`,`
**
 *
 *`,`
  *
***`
],
T:[`
***
 *`,`
 *
**
 *`,`
 *
***`,`
*
**
*`],
LS:[`
*
**
 *`,`
 **
**`],
RS:[`
 *
**
*`,`
**      
 **`]
};

function makeShapes()
{
   for(var p=0; p<Object.keys(shapes).length; p++)
   {
      var key = Object.keys(shapes)[p]; 
      for(var s=0; s<shapes[key].length; s++)
            shapes[key][s] = makeShape(shapes[key][s]);
   }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function nextShape()
{
   shp = getRandomInt(0, Object.keys(shapes).length-1);
   r = getRandomInt(0, shapes[Object.keys(shapes)[shp]].length-1);
   //if (r+1==shapes[Object.keys(shapes)[shp]].length) { 
     //shp=(shp+1) % Object.keys(shapes).length;
   //  r=0;   
   //}
   //else r++;
   cur=shapes[Object.keys(shapes)[shp]][r];
}

function makeShape(shape)
{
   var x=0;
   var y=0;
   var maxX=0;
   for(var c=0; c<shape.length; c++)
   {
     if (shape[c]=='\n') { y++; maxX=Math.max(x, maxX); x=0; } else { x++; }     
   }
   maxX=Math.max(x, maxX);   
   
   var s=new Array(y);
   y=-1; x=0;
   for(var c=0; c<shape.length; c++)
   {
     if (shape[c]=='\n') { 
	x=0; y++; 
        s[y]=new Array(maxX);
     } 
     else {
        if (shape[c]=='*') s[y][x]=shape[c];
        x++;
     }  
   }
   return s;   
}

function initWell() {
   var well = $("#well");
   for(var i=0; i<20; i++)
   {
      var tr=$("<tr/>");
      well.append(tr);
      for(var j=0; j<10; j++)
      {   
        var td = $("<td/>");
        td.addClass("_"+i+"_"+j);
        tr.append(td);
      }
   }
} 

function rotateShape()
{
   var key = Object.keys(shapes)[shp];
   for(var i=0; i<shapes[key].length; i++) {
      var newR=(r+1)%shapes[key].length;
      var newCur=shapes[key][newR];
      if (isValidPos(newCur, { x: pt.x, y:pt.y })) {
         paintShape(false);
         cur=newCur;   
         r=newR;
         paintShape(true);
         break;   
      }
   }
}

function isValidPos(shape, pt)
{
   if (pt.x<0 || pt.x+shape[0].length>10) return false;
   if (pt.y<0 || pt.y+shape.length>20) return false;

   for(var y=0; y<shape.length; y++) {
     for(var x=0; x<shape[y].length; x++) {
        var cell = getCell(pt.x+x,pt.y+y);
	if (shape[y][x]=='*' && cell.hasClass("nonempty") && !cell.hasClass("shape")) return false;
     }
   }
   return true;
}

function changeShape()
{
   paintShape(false);
   shp=(shp+1)%Object.keys(shapes).length;
   r=0;
   var key = Object.keys(shapes)[shp];
   cur=shapes[key][r];
   paintShape(true);  
}

$("#well").keydown(function(event) {
	switch(event.originalEvent.code)
        {
           case "ArrowRight": {
		event.preventDefault();
                moveShape(1,0);break;
	   }
           case "ArrowLeft": {
		event.preventDefault();
		moveShape(-1,0);break;
	   }
           case "ArrowUp": {
		//moveShape(0,-1);break;
		event.preventDefault();
                rotateShape();break;
	   }
           case "ArrowDown": {
		event.preventDefault();
                playGame();    
                break;
	   }
           case "Space": {    
		event.preventDefault();
		changeShape();
                break;
           }
           case "Tab": {
               event.preventDefault();
	       removeLines(); break;
           }
	   case "Enter": {
//		console.log(event);
	        embedShape();
		pt.x=0; pt.y=0;
                //nextShape();
//		paintShape(true);
                break;
           }
        }
});

var inPlay=false;
function playGame()
{
    if (inPlay) return;
    inPlay = true;
    if (!moveShape(0,1)) {                   
        embedShape();
        removeLines();
        pt.x=Math.floor((10-cur[0].length) / 2);
        pt.y=0;                      
        nextShape();
        paintShape(true);
    };                
    inPlay = false;   
}

function getCell(x,y)
{
   var name = "#well ._"+Number(y)+"_"+Number(x);
   var result = $(name);
   return result;
}

function embedShape()
{
    $("#well .shape").removeClass("shape");
}

function moveShape(dx,dy)
{
   if (!isValidPos(cur, { x: pt.x+dx, y: pt.y+dy })) return false;
   paintShape(false);
   pt.x+=dx;
   pt.y+=dy;
   paintShape(true);
   return true;
}

function removeLines()
{  
   for(var yy=pt.y+cur.length-1;yy>=0;yy--)
   {
      var line = getCell(0, yy).closest("tr").find("td");
      if (line.closest(".nonempty").length==10)
      {
         var lineAbove;
         for(var y=yy;y>0; y--)
         {
            var lineAbove = getCell(0, y-1).closest("tr").find("td");                  
  	    for(var c=0; c<10; c++) {
              if ($(lineAbove[c]).hasClass("nonempty"))
                 $(line[c]).addClass("nonempty");
              else
                 $(line[c]).removeClass("nonempty");            
            }
            line=lineAbove;
         }
         yy++; 
      }
   }  
}

function paintShape(on)
{
   for(var y=0; y< cur.length; y++)
     for(var x=0; x< cur[y].length; x++) 
	if (cur[y][x]=='*') {
	    var cell = getCell(pt.x+x,pt.y+y) 
	    if (on) cell.addClass("nonempty").addClass("shape"); 
		else cell.removeClass("nonempty").removeClass("shape");
        }
}


makeShapes();
initWell();
nextShape();
pt.x=Math.floor((10-cur[0].length) / 2);
paintShape(true);
$("#well").focus();
var timer = setInterval(playGame, 300);
                                        