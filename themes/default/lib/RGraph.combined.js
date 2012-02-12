// THIS FILE HAS BEEN MINIFIED

if(typeof(RGraph) == 'undefined') RGraph = {isRGraph:true,type:'common'};RGraph.Registry = {};RGraph.Registry.store = [];RGraph.Registry.store['chart.event.handlers'] = [];RGraph.Registry.store['__rgraph_event_listeners__'] = [];RGraph.background = {};RGraph.objects = [];RGraph.Resizing = {};RGraph.events = [];RGraph.ObjectRegistry = {};RGraph.ObjectRegistry.objects = {};RGraph.ObjectRegistry.objects.byUID = [];RGraph.ObjectRegistry.objects.byCanvasID = [];RGraph.getScale = function (max, obj)
{
if(max == 0){
return ['0.2', '0.4', '0.6', '0.8', '1.0'];}
var original_max = max;if(max <= 1){
if(max > 0.5){
return [0.2,0.4,0.6,0.8, Number(1).toFixed(1)];} else if(max >= 0.1){
return obj.Get('chart.scale.round') ? [0.2,0.4,0.6,0.8,1] : [0.1,0.2,0.3,0.4,0.5];} else {
var tmp = max;var exp = 0;while (tmp < 1.01){
exp += 1;tmp *= 10;}
var ret = ['2e-' + exp, '4e-' + exp, '6e-' + exp, '8e-' + exp, '10e-' + exp];if(max <= ('5e-' + exp)){
ret = ['1e-' + exp, '2e-' + exp, '3e-' + exp, '4e-' + exp, '5e-' + exp];}
return ret;}
}
if(String(max).indexOf('.') > 0){
max = String(max).replace(/\.\d+$/, '');}
var interval = Math.pow(10, Number(String(Number(max)).length - 1));var topValue = interval;while (topValue < max){
topValue += (interval / 2);}
if(Number(original_max) > Number(topValue)){
topValue += (interval / 2);}
if(max < 10){
topValue = (Number(original_max) <= 5 ? 5 : 10);}
if(obj && typeof(obj.Get('chart.scale.round')) == 'boolean' && obj.Get('chart.scale.round')){
topValue = 10 * interval;}
return [topValue * 0.2, topValue * 0.4, topValue * 0.6, topValue * 0.8, topValue];}
RGraph.array_max = function (arr)
{
var max = null;if(typeof(arr) == 'number'){
return arr;}
for (var i=0; i<arr.length; ++i){
if(typeof(arr[i]) == 'number'){
var val = arguments[1] ? Math.abs(arr[i]) : arr[i];if(typeof(max) == 'number'){
max = Math.max(max, val);} else {
max = val;}
}
}
return max;}
RGraph.array_pad = function (arr, len)
{
if(arr.length < len){
var val = arguments[2] ? arguments[2] : null;for (var i=arr.length; i<len; ++i){
arr[i] = val;}
}
return arr;}
RGraph.array_sum = function (arr)
{
if(typeof(arr) == 'number'){
return arr;}
var i, sum;var len = arr.length;for(i=0,sum=0;i<len;sum+=arr[i++]);return sum;}
RGraph.is_array = function (obj)
{
return obj != null && obj.constructor.toString().indexOf('Array') != -1;}
RGraph.array_linearize = function ()
{
var arr = [];for (var i=0; i<arguments.length; ++i){
if(typeof(arguments[i]) == 'object' && arguments[i]){
for (var j=0; j<arguments[i].length; ++j){
var sub = RGraph.array_linearize(arguments[i][j]);for (var k=0; k<sub.length; ++k){
arr.push(sub[k]);}
}
} else {
arr.push(arguments[i]);}
}
return arr;}
RGraph.degrees2Radians = function (degrees)
{
return degrees * (Math.PI / 180);}
RGraph.lineByAngle = function (context, x, y, angle, length)
{
context.arc(x, y, length, angle, angle, false);context.lineTo(x, y);context.arc(x, y, length, angle, angle, false);}
RGraph.Text = function (context, font, size, x, y, text)
{
if(typeof(text) == 'string' && text.match(/\r\n/)){
var arr = text.split('\r\n');text = arr[0];arr = RGraph.array_shift(arr);var nextline = arr.join('\r\n')
RGraph.Text(context, font, size, arguments[9] == -90 ? (x + (size * 1.5)) : x, y + (size * 1.5), nextline, arguments[6] ? arguments[6] : null, 'center', arguments[8], arguments[9], arguments[10], arguments[11], arguments[12]);}
if(RGraph.isOld()){
y += 2;}
context.font = (arguments[11] ? 'Bold ': '') + size + 'pt ' + font;var i;var origX = x;var origY = y;var originalFillStyle = context.fillStyle;var originalLineWidth = context.lineWidth;if(typeof(arguments[6]) == null) arguments[6] = 'bottom';if(typeof(arguments[7]) == null) arguments[7] = 'left';if(typeof(arguments[8]) == null) arguments[8] = null;if(typeof(arguments[9]) == null) arguments[9] = 0;if(typeof(arguments[12]) == null) arguments[12] = true;if(navigator.userAgent.indexOf('Opera') != -1){
context.canvas.__rgraph_valign__ = arguments[6];context.canvas.__rgraph_halign__ = arguments[7];}
context.save();context.canvas.__rgraph_originalx__ = x;context.canvas.__rgraph_originaly__ = y;context.translate(x, y);x = 0;y = 0;if(arguments[9]){
context.rotate(arguments[9] / 57.3);}
if(arguments[6]){
var vAlign = arguments[6];if(vAlign == 'center'){
context.translate(0, size / 2);} else if(vAlign == 'top'){
context.translate(0, size);}
}
if(arguments[7]){
var hAlign = arguments[7];var width = context.measureText(text).width;if(hAlign){
if(hAlign == 'center'){
context.translate(-1 * (width / 2), 0)
} else if(hAlign == 'right'){
context.translate(-1 * width, 0)
}
}
}
context.fillStyle = originalFillStyle;context.save();context.fillText(text,0,0);context.lineWidth = 1;if(arguments[8]){
var width = context.measureText(text).width;var ieOffset = RGraph.isIE8() ? 2 : 0;context.translate(x, y);context.strokeRect(AA(context.canvas.__object__, - 3), AA(context.canvas.__object__, 0 - 3 - size - ieOffset), width + 6, 0 + size + 6);if(arguments[10]){
var offset = 3;var ieOffset = RGraph.isIE8() ? 2 : 0;var width = context.measureText(text).width
context.fillStyle = arguments[10];context.fillRect(AA(context.canvas.__object__, x - offset),
AA(context.canvas.__object__, y - size - offset - ieOffset),
width + (2 * offset),
size + (2 * offset));}
context.fillStyle = originalFillStyle;context.fillText(text,0,0);if(arguments[12]){
context.fillRect(
arguments[7] == 'left' ? 0 : (arguments[7] == 'center' ? width / 2 : width ) - 2,
arguments[6] == 'bottom' ? 0 : (arguments[6] == 'center' ? (0 - size) / 2 : 0 - size) - 2,
4,
4
);}
}
context.restore();context.lineWidth = originalLineWidth;context.restore();}
RGraph.Clear = function (canvas)
{
if(!canvas){
return;}
RGraph.FireCustomEvent(canvas.__object__, 'onclear');var context = canvas.getContext('2d');var color = arguments[1];if(RGraph.isIE8() && !color){
color = 'white';}
if(!color || (color && color == 'transparent')){
context.clearRect(0,0,canvas.width, canvas.height);context.globalCompositeOperation = 'source-over';} else {
context.fillStyle = color;context = canvas.getContext('2d');context.beginPath();if(RGraph.isIE8()){
context.fillRect(0,0,canvas.width,canvas.height);} else {
context.fillRect(-10,-10,canvas.width + 20,canvas.height + 20);}
context.fill();}
if(RGraph.ClearAnnotations){
RGraph.ClearAnnotations(canvas.id);}
if(RGraph.Registry.Get('chart.background.image.' + canvas.id)){
var img = RGraph.Registry.Get('chart.background.image.' + canvas.id);img.style.position = 'absolute';img.style.left = '-10000px';img.style.top = '-10000px';}
RGraph.ClearEventListeners(canvas.id);RGraph.FireCustomEvent(canvas.__object__, 'onclear');}
RGraph.DrawTitle = function (canvas, text, gutterTop)
{
var obj = canvas.__object__;var context = canvas.getContext('2d');var gutterLeft = obj.Get('chart.gutter.left');var gutterRight = obj.Get('chart.gutter.right');var gutterBottom = obj.Get('chart.gutter.bottom');var size = arguments[4] ? arguments[4] : 12;var bold = obj.Get('chart.title.bold');var centerx = (arguments[3] ? arguments[3] : ((obj.canvas.width - gutterLeft - gutterRight) / 2) + gutterLeft);var keypos = obj.Get('chart.key.position');var vpos = obj.Get('chart.title.vpos');var hpos = obj.Get('chart.title.hpos');var bgcolor = obj.Get('chart.title.background');if(obj.type == 'bar' && obj.Get('chart.variant') == '3d'){
keypos = 'gutter';}
context.beginPath();context.fillStyle = obj.Get('chart.text.color') ? obj.Get('chart.text.color') : 'black';if(keypos && keypos != 'gutter'){
var vCenter = 'center';} else if(!keypos){
var vCenter = 'center';} else {
var vCenter = 'bottom';}
if(typeof(obj.Get('chart.title.vpos')) == 'number'){
vpos = obj.Get('chart.title.vpos') * gutterTop;if(obj.Get('chart.xaxispos') == 'top'){
vpos = obj.Get('chart.title.vpos') * gutterBottom + gutterTop + (obj.canvas.height - gutterTop - gutterBottom);}
} else {
vpos = gutterTop - size - 5;if(obj.Get('chart.xaxispos') == 'top'){
vpos = obj.canvas.height  - gutterBottom + size + 5;}
}
if(typeof(hpos) == 'number'){
centerx = hpos * canvas.width;}
if(typeof(obj.Get('chart.title.color') != null)){
var oldColor = context.fillStyle
var newColor = obj.Get('chart.title.color')
context.fillStyle = newColor ? newColor : 'black';}
var font = obj.Get('chart.text.font');if(typeof(obj.Get('chart.title.font')) == 'string'){
font = obj.Get('chart.title.font');}
RGraph.Text(context, font, size, centerx, vpos, text, vCenter, 'center', bgcolor != null, null, bgcolor, bold);context.fillStyle = oldColor;}
RGraph.getMouseXY = function (e)
{
var el = (RGraph.isIE8() ? event.srcElement : e.target);var x;var y;var paddingLeft = el.style.paddingLeft ? parseInt(el.style.paddingLeft) : 0;var paddingTop = el.style.paddingTop ? parseInt(el.style.paddingTop) : 0;var borderLeft = el.style.borderLeftWidth ? parseInt(el.style.borderLeftWidth) : 0;var borderTop = el.style.borderTopWidth  ? parseInt(el.style.borderTopWidth) : 0;if(RGraph.isIE8()) e = event;if(typeof(e.offsetX) == 'number' && typeof(e.offsetY) == 'number'){
x = e.offsetX;y = e.offsetY;} else {
x = 0;y = 0;while (el != document.body && el){
x += el.offsetLeft;y += el.offsetTop;el = el.offsetParent;}
x = e.pageX - x;y = e.pageY - y;}
return [x, y];}
RGraph.getCanvasXY = function (canvas)
{
var x = 0;var y = 0;var obj = canvas;do {
x += obj.offsetLeft;y += obj.offsetTop;obj = obj.offsetParent;} while (obj && obj.tagName.toLowerCase() != 'body');var paddingLeft = canvas.style.paddingLeft ? parseInt(canvas.style.paddingLeft) : 0;var paddingTop = canvas.style.paddingTop ? parseInt(canvas.style.paddingTop) : 0;var borderLeft = canvas.style.borderLeftWidth ? parseInt(canvas.style.borderLeftWidth) : 0;var borderTop = canvas.style.borderTopWidth  ? parseInt(canvas.style.borderTopWidth) : 0;return [x + paddingLeft + borderLeft, y + paddingTop + borderTop];}
RGraph.Register = function (obj)
{
if(!obj.Get('chart.noregister')){
RGraph.ObjectRegistry.Add(obj);obj.Set('chart.noregister', true);}
}
RGraph.Redraw = function ()
{
var objectRegistry = RGraph.ObjectRegistry.objects.byCanvasID;for (var i=0; i<objectRegistry.length; ++i){
if(objectRegistry[i]){
var id = objectRegistry[i][0];RGraph.Clear(document.getElementById(id));}
}
for (var i=0; i<objectRegistry.length; ++i){
if(objectRegistry[i]){
var id = objectRegistry[i][0];objectRegistry[i][1].Draw();}
}
}
RGraph.RedrawCanvas = function (canvas)
{
var objects = RGraph.ObjectRegistry.getObjectsByCanvasID(canvas.id);RGraph.Clear(canvas);for (var i=0; i<objects.length; ++i){
if(objects[i]){
if(objects[i] && objects[i].isRGraph){
objects[i].Draw();}
}
}
}
RGraph.pr = function (obj)
{
var str = '';var indent = (arguments[2] ? arguments[2] : '');switch (typeof(obj)){
case 'number':
if(indent == ''){
str+= 'Number: '
}
str += String(obj);break;case 'string':
if(indent == ''){
str+= 'String (' + obj.length + '):'
}
str += '"' + String(obj) + '"';break;case 'object':
if(obj == null){
str += 'null';break;}
str += 'Object\n' + indent + '(\n';for (var i in obj){
if(typeof(i) == 'string' || typeof(i) == 'number'){
str += indent + ' ' + i + ' => ' + RGraph.pr(obj[i], true, indent + '    ') + '\n';}
}
var str = str + indent + ')';break;case 'function':
str += obj;break;case 'boolean':
str += 'Boolean: ' + (obj ? 'true' : 'false');break;}
if(arguments[1]){
return str;} else {
alert(str);}
}
RGraph.Registry.Set = function (name, value)
{
RGraph.Registry.store[name] = value;return value;}
RGraph.Registry.Get = function (name)
{
return RGraph.Registry.store[name];}
RGraph.background.Draw = function (obj)
{
var canvas = obj.canvas;var context = obj.context;var height = 0;var gutterLeft = obj.Get('chart.gutter.left');var gutterRight = obj.Get('chart.gutter.right');var gutterTop = obj.Get('chart.gutter.top');var gutterBottom = obj.Get('chart.gutter.bottom');var variant = obj.Get('chart.variant');context.fillStyle = obj.Get('chart.text.color');if(variant == '3d'){
context.save();context.translate(10, -5);}
if(typeof(obj.Get('chart.title.xaxis')) == 'string' && obj.Get('chart.title.xaxis').length){
var size = obj.Get('chart.text.size') + 2;var font = obj.Get('chart.text.font');var bold = obj.Get('chart.title.xaxis.bold');if(typeof(obj.Get('chart.title.xaxis.size')) == 'number'){
size = obj.Get('chart.title.xaxis.size');}
if(typeof(obj.Get('chart.title.xaxis.font')) == 'string'){
font = obj.Get('chart.title.xaxis.font');}
var hpos = ((obj.canvas.width - obj.gutterLeft - obj.gutterRight) / 2) + obj.gutterLeft;var vpos = obj.canvas.height - obj.Get('chart.gutter.bottom') + 25;if(typeof(obj.Get('chart.title.xaxis.pos')) == 'number'){
vpos = obj.canvas.height - (gutterBottom * obj.Get('chart.title.xaxis.pos'));}
context.beginPath();RGraph.Text(context,
font,
size,
hpos,
vpos,
obj.Get('chart.title.xaxis'),
'center',
'center',
false,
false,
false,
bold);context.fill();}
if(typeof(obj.Get('chart.title.yaxis')) == 'string' && obj.Get('chart.title.yaxis').length){
var size = obj.Get('chart.text.size') + 2;var font = obj.Get('chart.text.font');var angle = 270;var bold = obj.Get('chart.title.yaxis.bold');if(typeof(obj.Get('chart.title.yaxis.pos')) == 'number'){
var yaxis_title_pos = obj.Get('chart.title.yaxis.pos') * obj.Get('chart.gutter.left');} else {
var yaxis_title_pos = ((obj.Get('chart.gutter.left') - 25) / obj.Get('chart.gutter.left')) * obj.Get('chart.gutter.left');}
if(typeof(obj.Get('chart.title.yaxis.size')) == 'number'){
size = obj.Get('chart.title.yaxis.size');}
if(typeof(obj.Get('chart.title.yaxis.font')) == 'string'){
font = obj.Get('chart.title.yaxis.font');}
if(obj.Get('chart.title.yaxis.align') == 'right' || obj.Get('chart.title.yaxis.position') == 'right'){
angle = 90;yaxis_title_pos = obj.Get('chart.title.yaxis.pos') ? obj.Get('chart.title.yaxis.pos') * obj.Get('chart.gutter.right') :
obj.canvas.width - obj.Get('chart.gutter.right') + obj.Get('chart.text.size') + 5;} else {
yaxis_title_pos = yaxis_title_pos;}
context.beginPath();RGraph.Text(context,
font,
size,
yaxis_title_pos,
((obj.canvas.height - obj.gutterTop - obj.gutterBottom) / 2) + obj.gutterTop,
obj.Get('chart.title.yaxis'),
'center',
'center',
false,
angle,
false,
bold);context.fill();}
obj.context.beginPath();context.fillStyle = obj.Get('chart.background.barcolor1');height = (RGraph.GetHeight(obj) - gutterBottom);for (var i=gutterTop; i < height ; i+=80){
obj.context.fillRect(gutterLeft, i, RGraph.GetWidth(obj) - gutterLeft - gutterRight, Math.min(40, RGraph.GetHeight(obj) - gutterBottom - i) );}
context.fillStyle = obj.Get('chart.background.barcolor2');height = (RGraph.GetHeight(obj) - gutterBottom);for (var i= (40 + gutterTop); i < height; i+=80){
obj.context.fillRect(gutterLeft, i, RGraph.GetWidth(obj) - gutterLeft - gutterRight, i + 40 > (RGraph.GetHeight(obj) - gutterBottom) ? RGraph.GetHeight(obj) - (gutterBottom + i) : 40);}
context.stroke();if(obj.Get('chart.background.grid')){
if(obj.Get('chart.background.grid.autofit')){
if(obj.Get('chart.background.grid.autofit.align')){
obj.Set('chart.background.grid.autofit.numhlines', obj.Get('chart.ylabels.count'));if(obj.type == 'line'){
if(obj.Get('chart.labels') && obj.Get('chart.labels').length){
obj.Set('chart.background.grid.autofit.numvlines', obj.Get('chart.labels').length - 1);} else {
obj.Set('chart.background.grid.autofit.numvlines', obj.data[0].length - 1);}
} else if(obj.type == 'bar' && obj.Get('chart.labels') && obj.Get('chart.labels').length){
obj.Set('chart.background.grid.autofit.numvlines', obj.Get('chart.labels').length);}
}
var vsize = ((obj.canvas.width - gutterLeft - gutterRight)) / obj.Get('chart.background.grid.autofit.numvlines');var hsize = (obj.canvas.height - gutterTop - gutterBottom) / obj.Get('chart.background.grid.autofit.numhlines');obj.Set('chart.background.grid.vsize', vsize);obj.Set('chart.background.grid.hsize', hsize);}
context.beginPath();context.lineWidth = obj.Get('chart.background.grid.width') ? obj.Get('chart.background.grid.width') : 1;context.strokeStyle = obj.Get('chart.background.grid.color');if(obj.Get('chart.background.grid.hlines')){
height = (RGraph.GetHeight(obj) - gutterBottom)
for (y=gutterTop; y<height; y+=obj.Get('chart.background.grid.hsize')){
context.moveTo(gutterLeft, AA(this, y));context.lineTo(RGraph.GetWidth(obj) - gutterRight, AA(this, y));}
}
if(obj.Get('chart.background.grid.vlines')){
var width = (obj.canvas.width - gutterRight)
for (x=gutterLeft; x<=width; x+=obj.Get('chart.background.grid.vsize')){
context.moveTo(AA(this, x), gutterTop);context.lineTo(AA(this, x), obj.canvas.height - gutterBottom);}
}
if(obj.Get('chart.background.grid.border')){
context.strokeStyle = obj.Get('chart.background.grid.color');context.strokeRect(AA(this, gutterLeft), AA(this, gutterTop), RGraph.GetWidth(obj) - gutterLeft - gutterRight, RGraph.GetHeight(obj) - gutterTop - gutterBottom);}
}
context.stroke();if(variant == '3d'){
context.restore();}
if( typeof(obj.Get('chart.title')) == 'string'){
if(obj.type == 'gantt'){
gutterTop -= 10;}
RGraph.DrawTitle(canvas,
obj.Get('chart.title'),
gutterTop,
null,
obj.Get('chart.title.size') ? obj.Get('chart.title.size') : obj.Get('chart.text.size') + 2);}
context.stroke();}
RGraph.GetDays = function (obj)
{
var year = obj.getFullYear();var days = obj.getDate();var month = obj.getMonth();if(month == 0) return days;if(month >= 1) days += 31; 
if(month >= 2) days += 28;if(year >= 2008 && year % 4 == 0) days += 1;if(month >= 3) days += 31;if(month >= 4) days += 30;if(month >= 5) days += 31;if(month >= 6) days += 30;if(month >= 7) days += 31;if(month >= 8) days += 31;if(month >= 9) days += 30;if(month >= 10) days += 31;if(month >= 11) days += 30;return days;}
function pd(variable){RGraph.pr(variable);}
function p(variable){RGraph.pr(variable);}
function a(variable){alert(variable);}
function cl (variable)
{
return console.log(variable);}
RGraph.array_clone = function (obj)
{
if(obj == null || typeof(obj) != 'object'){
return obj;}
var temp = [];for (var i=0;i<obj.length; ++i){
if(typeof(obj[i]) == 'number'){
temp[i] = (function (arg){return Number(arg);})(obj[i]);} else if(typeof(obj[i]) == 'string'){
temp[i] = (function (arg){return String(arg);})(obj[i]);} else if(typeof(obj[i]) == 'function'){
temp[i] = obj[i];} else {
temp[i] = RGraph.array_clone(obj[i]);}
}
return temp;}
RGraph.array_reverse = function (arr)
{
var newarr = [];for (var i=arr.length - 1; i>=0; i--){
newarr.push(arr[i]);}
return newarr;}
RGraph.number_format = function (obj, num)
{
var i;var prepend = arguments[2] ? String(arguments[2]) : '';var append = arguments[3] ? String(arguments[3]) : '';var output = '';var decimal = '';var decimal_seperator = obj.Get('chart.scale.point') ? obj.Get('chart.scale.point') : '.';var thousand_seperator = obj.Get('chart.scale.thousand') ? obj.Get('chart.scale.thousand') : ',';RegExp.$1 = '';var i,j;if(typeof(obj.Get('chart.scale.formatter')) == 'function'){
return obj.Get('chart.scale.formatter')(obj, num);}
if(String(num).indexOf('e') > 0){
return String(prepend + String(num) + append);}
num = String(num);if(num.indexOf('.') > 0){
var tmp = num;num = num.replace(/\.(.*)/, '');decimal = tmp.replace(/(.*)\.(.*)/, '$2');}
var seperator = thousand_seperator;var foundPoint;for (i=(num.length - 1),j=0; i>=0; j++,i--){
var character = num.charAt(i);if( j % 3 == 0 && j != 0){
output += seperator;}
output += character;}
var rev = output;output = '';for (i=(rev.length - 1); i>=0; i--){
output += rev.charAt(i);}
if(output.indexOf('-' + obj.Get('chart.scale.thousand')) == 0){
output = '-' + output.substr(('-' + obj.Get('chart.scale.thousand')).length);}
if(decimal.length){
output =  output + decimal_seperator + decimal;decimal = '';RegExp.$1 = '';}
if(output.charAt(0) == '-'){
output = output.replace(/-/, '');prepend = '-' + prepend;}
return prepend + output + append;}
RGraph.DrawBars = function (obj)
{
var hbars = obj.Get('chart.background.hbars');obj.context.beginPath();for (i=0; i<hbars.length; ++i){
if(hbars[i][1] == null){
hbars[i][1] = obj.max;} else if(hbars[i][0] + hbars[i][1] > obj.max){
hbars[i][1] = obj.max - hbars[i][0];}
if(Math.abs(hbars[i][1]) > obj.max){
hbars[i][1] = -1 * obj.max;}
if(Math.abs(hbars[i][0]) > obj.max){
hbars[i][0] = obj.max;}
if(hbars[i][0] + hbars[i][1] < (-1 * obj.max) ){
hbars[i][1] = -1 * (obj.max + hbars[i][0]);}
if(obj.Get('chart.xaxispos') == 'bottom' && (hbars[i][0] < 0 || (hbars[i][1] + hbars[i][1] < 0)) ){
alert('[' + obj.type.toUpperCase() + ' (ID: ' + obj.id + ') BACKGROUND HBARS] You have a negative value in one of your background hbars values, whilst the X axis is in the center');}
var ystart = (obj.grapharea - ((hbars[i][0] / obj.max) * obj.grapharea));var height = (Math.min(hbars[i][1], obj.max - hbars[i][0]) / obj.max) * obj.grapharea;if(obj.Get('chart.xaxispos') == 'center'){
ystart /= 2;height /= 2;}
ystart += obj.Get('chart.gutter.top')
var x = obj.Get('chart.gutter.left');var y = ystart - height;var w = obj.canvas.width - obj.Get('chart.gutter.left') - obj.Get('chart.gutter.right');var h = height;if(navigator.userAgent.indexOf('Opera') != -1 && obj.Get('chart.xaxispos') == 'center' && h < 0){
h *= -1;y = y - h;}
if(obj.Get('chart.xaxispos') == 'top'){
y = obj.canvas.height - y;h *= -1;}
obj.context.fillStyle = hbars[i][2];obj.context.fillRect(x, y, w, h);}
obj.context.fill();}
RGraph.DrawInGraphLabels = function (obj)
{
var canvas = obj.canvas;var context = obj.context;var labels = obj.Get('chart.labels.ingraph');var labels_processed = [];var fgcolor = 'black';var bgcolor = 'white';var direction = 1;if(!labels){
return;}
for (var i=0; i<labels.length; ++i){
if(typeof(labels[i]) == 'number'){
for (var j=0; j<labels[i]; ++j){
labels_processed.push(null);}
} else if(typeof(labels[i]) == 'string' || typeof(labels[i]) == 'object'){
labels_processed.push(labels[i]);} else {
labels_processed.push('');}
}
RGraph.NoShadow(obj);if(labels_processed && labels_processed.length > 0){
for (var i=0; i<labels_processed.length; ++i){
if(labels_processed[i]){
var coords = obj.coords[i];if(coords && coords.length > 0){
var x = (obj.type == 'bar' ? coords[0] + (coords[2] / 2) : coords[0]);var y = (obj.type == 'bar' ? coords[1] + (coords[3] / 2) : coords[1]);var length = typeof(labels_processed[i][4]) == 'number' ? labels_processed[i][4] : 25;context.beginPath();context.fillStyle = 'black';context.strokeStyle = 'black';if(obj.type == 'bar'){
if(obj.Get('chart.xaxispos') == 'top'){
length *= -1;}
if(obj.Get('chart.variant') == 'dot'){
context.moveTo(x, obj.coords[i][1] - 5);context.lineTo(x, obj.coords[i][1] - 5 - length);var text_x = x;var text_y = obj.coords[i][1] - 5 - length;} else if(obj.Get('chart.variant') == 'arrow'){
context.moveTo(x, obj.coords[i][1] - 5);context.lineTo(x, obj.coords[i][1] - 5 - length);var text_x = x;var text_y = obj.coords[i][1] - 5 - length;} else {
context.arc(x, y, 2.5, 0, 6.28, 0);context.moveTo(x, y);context.lineTo(x, y - length);var text_x = x;var text_y = y - length;}
context.stroke();context.fill();} else if(obj.type == 'line'){
if(
typeof(labels_processed[i]) == 'object' &&
typeof(labels_processed[i][3]) == 'number' &&
labels_processed[i][3] == -1
){
context.moveTo(x, y + 5);context.lineTo(x, y + 5 + length);context.stroke();context.beginPath();                                
context.moveTo(x, y + 5);context.lineTo(x - 3, y + 10);context.lineTo(x + 3, y + 10);context.closePath();var text_x = x;var text_y = y + 5 + length;} else {
var text_x = x;var text_y = y - 5 - length;context.moveTo(x, y - 5);context.lineTo(x, y - 5 - length);context.stroke();context.beginPath();context.moveTo(x, y - 5);context.lineTo(x - 3, y - 10);context.lineTo(x + 3, y - 10);context.closePath();}
context.fill();}
context.beginPath();context.fillStyle = (typeof(labels_processed[i]) == 'object' && typeof(labels_processed[i][1]) == 'string') ? labels_processed[i][1] : 'black';RGraph.Text(context,
obj.Get('chart.text.font'),
obj.Get('chart.text.size'),
text_x,
text_y,
(typeof(labels_processed[i]) == 'object' && typeof(labels_processed[i][0]) == 'string') ? labels_processed[i][0] : labels_processed[i],
'bottom',
'center',
true,
null,
(typeof(labels_processed[i]) == 'object' && typeof(labels_processed[i][2]) == 'string') ? labels_processed[i][2] : 'white');context.fill();}
}
}
}
}
RGraph.FixEventObject = function (e)
{
if(RGraph.isIE8()){
var e = event;e.pageX = (event.clientX + document.body.scrollLeft);e.pageY = (event.clientY + document.body.scrollTop);e.target = event.srcElement;if(!document.body.scrollTop && document.documentElement.scrollTop){
e.pageX += parseInt(document.documentElement.scrollLeft);e.pageY += parseInt(document.documentElement.scrollTop);}
}
if(typeof(e.offsetX) == 'undefined' && typeof(e.offsetY) == 'undefined'){
var coords = RGraph.getMouseXY(e);e.offsetX = coords[0];e.offsetY = coords[1];}
if(!e.stopPropagation){
e.stopPropagation = function (){window.event.cancelBubble = true;}
}
return e;}
RGraph.DrawCrosshairs = function (obj)
{
if(obj.Get('chart.crosshairs')){
var canvas = obj.canvas;var context = obj.context;var crosshairs_mousemove = function (e)
{
var e = RGraph.FixEventObject(e);var canvas = obj.canvas;var context = obj.context;var width = canvas.width;var height = canvas.height;var adjustments = obj.Get('chart.tooltips.coords.adjust');var gutterLeft = obj.Get('chart.gutter.left');var gutterRight = obj.Get('chart.gutter.right');var gutterTop = obj.Get('chart.gutter.top');var gutterBottom = obj.Get('chart.gutter.bottom');var mouseCoords = RGraph.getMouseXY(e);var x = mouseCoords[0];var y = mouseCoords[1];if(typeof(adjustments) == 'object' && adjustments[0] && adjustments[1]){
x = x - adjustments[0];y = y - adjustments[1];}
RGraph.Clear(canvas);obj.Draw();if(   x >= gutterLeft
&& y >= gutterTop
&& x <= (width - gutterRight)
&& y <= (height - gutterBottom)
){
var linewidth = obj.Get('chart.crosshairs.linewidth');context.lineWidth = linewidth ? linewidth : 1;context.beginPath();context.strokeStyle = obj.Get('chart.crosshairs.color');if(obj.Get('chart.crosshairs.vline')){
context.moveTo(AA(this, x), AA(this, gutterTop));context.lineTo(AA(this, x), AA(this, height - gutterBottom));}
if(obj.Get('chart.crosshairs.hline')){
context.moveTo(AA(this, gutterLeft), AA(this, y));context.lineTo(AA(this, width - gutterRight), AA(this, y));}
context.stroke();if(obj.Get('chart.crosshairs.coords')){
if(obj.type == 'scatter'){
var xCoord = (((x - obj.Get('chart.gutter.left')) / (obj.canvas.width - gutterLeft - gutterRight)) * (obj.Get('chart.xmax') - obj.Get('chart.xmin'))) + obj.Get('chart.xmin');xCoord = xCoord.toFixed(obj.Get('chart.scale.decimals'));var yCoord = obj.max - (((y - obj.Get('chart.gutter.top')) / (obj.canvas.height - gutterTop - gutterBottom)) * obj.max);if(obj.type == 'scatter' && obj.Get('chart.xaxispos') == 'center'){
yCoord = (yCoord - (obj.max / 2)) * 2;}
yCoord = yCoord.toFixed(obj.Get('chart.scale.decimals'));var div = RGraph.Registry.Get('chart.coordinates.coords.div');var mouseCoords = RGraph.getMouseXY(e);var canvasXY = RGraph.getCanvasXY(canvas);if(!div){
div = document.createElement('DIV');div.__object__ = obj;div.style.position = 'absolute';div.style.backgroundColor = 'white';div.style.border = '1px solid black';div.style.fontFamily = 'Arial, Verdana, sans-serif';div.style.fontSize = '10pt'
div.style.padding = '2px';div.style.opacity = 1;div.style.WebkitBorderRadius = '3px';div.style.borderRadius = '3px';div.style.MozBorderRadius = '3px';document.body.appendChild(div);RGraph.Registry.Set('chart.coordinates.coords.div', div);}
div.style.opacity = 1;div.style.display = 'inline';if(!obj.Get('chart.crosshairs.coords.fixed')){
div.style.left = Math.max(2, (e.pageX - div.offsetWidth - 3)) + 'px';div.style.top = Math.max(2, (e.pageY - div.offsetHeight - 3))  + 'px';} else {
div.style.left = canvasXY[0] + gutterLeft + 3 + 'px';div.style.top = canvasXY[1] + gutterTop + 3 + 'px';}
div.innerHTML = '<span style="color: #666">' + obj.Get('chart.crosshairs.coords.labels.x') + ':</span> ' + xCoord + '<br><span style="color: #666">' + obj.Get('chart.crosshairs.coords.labels.y') + ':</span> ' + yCoord;canvas.addEventListener('mouseout', RGraph.HideCrosshairCoords, false);obj.canvas.__crosshairs_labels__ = div;obj.canvas.__crosshairs_x__ = xCoord;obj.canvas.__crosshairs_y__ = yCoord;} else {
alert('[RGRAPH] Showing crosshair coordinates is only supported on the Scatter chart');}
}
RGraph.FireCustomEvent(obj, 'oncrosshairs');} else {
RGraph.HideCrosshairCoords();}
}
canvas.addEventListener('mousemove', crosshairs_mousemove, false);RGraph.AddEventListener(obj.id, 'mousemove', crosshairs_mousemove);}
}
RGraph.HideCrosshairCoords = function ()
{
var div = RGraph.Registry.Get('chart.coordinates.coords.div');if(   div
&& div.style.opacity == 1
&& div.__object__.Get('chart.crosshairs.coords.fadeout')
){
setTimeout(function(){RGraph.Registry.Get('chart.coordinates.coords.div').style.opacity = 0.9;}, 50);setTimeout(function(){RGraph.Registry.Get('chart.coordinates.coords.div').style.opacity = 0.8;}, 100);setTimeout(function(){RGraph.Registry.Get('chart.coordinates.coords.div').style.opacity = 0.7;}, 150);setTimeout(function(){RGraph.Registry.Get('chart.coordinates.coords.div').style.opacity = 0.6;}, 200);setTimeout(function(){RGraph.Registry.Get('chart.coordinates.coords.div').style.opacity = 0.5;}, 250);setTimeout(function(){RGraph.Registry.Get('chart.coordinates.coords.div').style.opacity = 0.4;}, 300);setTimeout(function(){RGraph.Registry.Get('chart.coordinates.coords.div').style.opacity = 0.3;}, 350);setTimeout(function(){RGraph.Registry.Get('chart.coordinates.coords.div').style.opacity = 0.2;}, 400);setTimeout(function(){RGraph.Registry.Get('chart.coordinates.coords.div').style.opacity = 0.1;}, 450);setTimeout(function(){RGraph.Registry.Get('chart.coordinates.coords.div').style.opacity = 0;}, 500);setTimeout(function(){RGraph.Registry.Get('chart.coordinates.coords.div').style.display = 'none';}, 550);}
}
RGraph.rtrim = function (str)
{
return str.replace(/( |\n|\r|\t)+$/, '');}
RGraph.Draw3DAxes = function (obj)
{
var gutterLeft = obj.Get('chart.gutter.left');var gutterRight = obj.Get('chart.gutter.right');var gutterTop = obj.Get('chart.gutter.top');var gutterBottom = obj.Get('chart.gutter.bottom');var context = obj.context;var canvas = obj.canvas;context.strokeStyle = '#aaa';context.fillStyle = '#ddd';context.beginPath();context.moveTo(gutterLeft, gutterTop);context.lineTo(gutterLeft + 10, gutterTop - 5);context.lineTo(gutterLeft + 10, canvas.height - gutterBottom - 5);context.lineTo(gutterLeft, canvas.height - gutterBottom);context.closePath();context.stroke();context.fill();context.beginPath();context.moveTo(gutterLeft, canvas.height - gutterBottom);context.lineTo(gutterLeft + 10, canvas.height - gutterBottom - 5);context.lineTo(canvas.width - gutterRight + 10,  canvas.height - gutterBottom - 5);context.lineTo(canvas.width - gutterRight, canvas.height - gutterBottom);context.closePath();context.stroke();context.fill();}
RGraph.NoShadow = function (obj)
{
obj.context.shadowColor = 'rgba(0,0,0,0)';obj.context.shadowBlur = 0;obj.context.shadowOffsetX = 0;obj.context.shadowOffsetY = 0;}
RGraph.SetShadow = function (obj, color, offsetx, offsety, blur)
{
obj.context.shadowColor = color;obj.context.shadowOffsetX = offsetx;obj.context.shadowOffsetY = offsety;obj.context.shadowBlur = blur;}
RGraph.OldBrowserCompat = function (context)
{
if(!context){
return;}
if(!context.measureText){
context.measureText = function (text)
{
var textObj = document.createElement('DIV');textObj.innerHTML = text;textObj.style.backgroundColor = 'white';textObj.style.position = 'absolute';textObj.style.top = -100
textObj.style.left = 0;document.body.appendChild(textObj);var width = {width: textObj.offsetWidth};textObj.style.display = 'none';return width;}
}
if(!context.fillText){
context.fillText = function (text, targetX, targetY)
{
return false;}
}
if(!context.canvas.addEventListener){
window.addEventListener = function (ev, func, bubble)
{
return this.attachEvent('on' + ev, func);}
context.canvas.addEventListener = function (ev, func, bubble)
{
return this.attachEvent('on' + ev, func);}
}
}
RGraph.Async = function (func)
{
return setTimeout(func, arguments[1] ? arguments[1] : 1);}
RGraph.random = function (min, max)
{
var dp = arguments[2] ? arguments[2] : 0;var r = Math.random();return Number((((max - min) * r) + min).toFixed(dp));}
RGraph.strokedCurvyRect = function (context, x, y, w, h)
{
var r = arguments[5] ? arguments[5] : 3;var corner_tl = (arguments[6] || arguments[6] == null) ? true : false;var corner_tr = (arguments[7] || arguments[7] == null) ? true : false;var corner_br = (arguments[8] || arguments[8] == null) ? true : false;var corner_bl = (arguments[9] || arguments[9] == null) ? true : false;context.beginPath();context.moveTo(x + (corner_tl ? r : 0), y);context.lineTo(x + w - (corner_tr ? r : 0), y);if(corner_tr){
context.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2, false);}
context.lineTo(x + w, y + h - (corner_br ? r : 0) );if(corner_br){
context.arc(x + w - r, y - r + h, r, Math.PI * 2, Math.PI * 0.5, false);}
context.lineTo(x + (corner_bl ? r : 0), y + h);if(corner_bl){
context.arc(x + r, y - r + h, r, Math.PI * 0.5, Math.PI, false);}
context.lineTo(x, y + (corner_tl ? r : 0) );if(corner_tl){
context.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);}
context.stroke();}
RGraph.filledCurvyRect = function (context, x, y, w, h)
{
var r = arguments[5] ? arguments[5] : 3;var corner_tl = (arguments[6] || arguments[6] == null) ? true : false;var corner_tr = (arguments[7] || arguments[7] == null) ? true : false;var corner_br = (arguments[8] || arguments[8] == null) ? true : false;var corner_bl = (arguments[9] || arguments[9] == null) ? true : false;context.beginPath();if(corner_tl){
context.moveTo(x + r, y + r);context.arc(x + r, y + r, r, Math.PI, 1.5 * Math.PI, false);} else {
context.fillRect(x, y, r, r);}
if(corner_tr){
context.moveTo(x + w - r, y + r);context.arc(x + w - r, y + r, r, 1.5 * Math.PI, 0, false);} else {
context.moveTo(x + w - r, y);context.fillRect(x + w - r, y, r, r);}
if(corner_br){
context.moveTo(x + w - r, y + h - r);context.arc(x + w - r, y - r + h, r, 0, Math.PI / 2, false);} else {
context.moveTo(x + w - r, y + h - r);context.fillRect(x + w - r, y + h - r, r, r);}
if(corner_bl){
context.moveTo(x + r, y + h - r);context.arc(x + r, y - r + h, r, Math.PI / 2, Math.PI, false);} else {
context.moveTo(x, y + h - r);context.fillRect(x, y + h - r, r, r);}
context.fillRect(x + r, y, w - r - r, h);context.fillRect(x, y + r, r + 1, h - r - r);context.fillRect(x + w - r - 1, y + r, r + 1, h - r - r);context.fill();}
RGraph.Timer = function (label)
{
var d = new Date();console.log(label + ': ' + d.getSeconds() + '.' + d.getMilliseconds());}
RGraph.HidePalette = function ()
{
var div = RGraph.Registry.Get('palette');if(typeof(div) == 'object' && div){
div.style.visibility = 'hidden';div.style.display = 'none';RGraph.Registry.Set('palette', null);}
}
RGraph.HideZoomedCanvas = function ()
{
var interval = 15;var frames = 10;if(typeof(__zoomedimage__) == 'object'){
obj = __zoomedimage__.obj;} else {
return;}
if(obj.Get('chart.zoom.fade.out')){
for (var i=frames,j=1; i>=0; --i, ++j){
if(typeof(__zoomedimage__) == 'object'){
setTimeout("__zoomedimage__.style.opacity = " + String(i / 10), j * interval);}
}
if(typeof(__zoomedbackground__) == 'object'){
setTimeout("__zoomedbackground__.style.opacity = " + String(i / frames), j * interval);}
}
if(typeof(__zoomedimage__) == 'object'){
setTimeout("__zoomedimage__.style.display = 'none'", obj.Get('chart.zoom.fade.out') ? (frames * interval) + 10 : 0);}
if(typeof(__zoomedbackground__) == 'object'){
setTimeout("__zoomedbackground__.style.display = 'none'", obj.Get('chart.zoom.fade.out') ? (frames * interval) + 10 : 0);}
}
RGraph.AddCustomEventListener = function (obj, name, func)
{
if(typeof(RGraph.events[obj.id]) == 'undefined'){
RGraph.events[obj.id] = [];}
RGraph.events[obj.id].push([obj, name, func]);return RGraph.events[obj.id].length - 1;}
RGraph.FireCustomEvent = function (obj, name)
{
if(obj && obj.isRGraph){
var id = obj.id;if(   typeof(id) == 'string'
&& typeof(RGraph.events) == 'object'
&& typeof(RGraph.events[id]) == 'object'
&& RGraph.events[id].length > 0){
for(var j=0; j<RGraph.events[id].length; ++j){
if(RGraph.events[id][j] && RGraph.events[id][j][1] == name){
RGraph.events[id][j][2](obj);}
}
}
}
}
RGraph.isIE8 = function ()
{
return navigator.userAgent.indexOf('MSIE 8') > 0;}
RGraph.isIE7 = function ()
{
return navigator.userAgent.indexOf('MSIE 7') > 0;}
RGraph.isIE9 = function ()
{
return navigator.userAgent.indexOf('MSIE 9') > 0;}
RGraph.isOld = function ()
{
return RGraph.isIE7() || RGraph.isIE8();}
RGraph.isIE9up = function ()
{
navigator.userAgent.match(/MSIE (\d+)/);return Number(RegExp.$1) >= 9;}
RGraph.ClearEventListeners = function (id)
{
for (var i=0; i<RGraph.Registry.Get('chart.event.handlers').length; ++i){
var el = RGraph.Registry.Get('chart.event.handlers')[i];if(el && (el[0] == id || el[0] == ('window_' + id))){
if(el[0].substring(0, 7) == 'window_'){
window.removeEventListener(el[1], el[2], false);} else {
if(document.getElementById(id)){
document.getElementById(id).removeEventListener(el[1], el[2], false);}
}
RGraph.Registry.Get('chart.event.handlers')[i] = null;}
}
}
RGraph.AddEventListener = function (id, e, func)
{
var type = arguments[3] ? arguments[3] : 'unknown';RGraph.Registry.Get('chart.event.handlers').push([id, e, func, type]);}
RGraph.getGutterSuggest = function (obj, data)
{
var str = RGraph.number_format(obj, RGraph.array_max(RGraph.getScale(RGraph.array_max(data), obj)), obj.Get('chart.units.pre'), obj.Get('chart.units.post'));if(obj.type == 'hbar'){
var str = '';var len = 0;for (var i=0; i<obj.Get('chart.labels').length; ++i){
str = (obj.Get('chart.labels').length > str.length ? obj.Get('chart.labels')[i] : str);}
}
obj.context.font = obj.Get('chart.text.size') + 'pt ' + obj.Get('chart.text.font');len = obj.context.measureText(str).width + 5;return (obj.type == 'hbar' ? len / 3 : len);}
RGraph.array_shift = function (arr)
{
var ret = [];for (var i=1; i<arr.length; ++i) ret.push(arr[i]);return ret;}
RGraph.SetConfig = function (obj, c)
{
for (i in c){
if(typeof(i) == 'string'){
obj.Set(i, c[i]);}
}
return obj;}
RGraph.GetHeight=function(obj){return obj.canvas.height;}
RGraph.GetWidth=function(obj){return obj.canvas.width;}
RGraph.RemoveAllCustomEventListeners = function ()
{
var id = arguments[0];if(id && RGraph.events[id]){
RGraph.events[id] = [];} else {
RGraph.events = [];}
}
RGraph.RemoveCustomEventListener = function (obj, i)
{
if(   typeof(RGraph.events) == 'object'
&& typeof(RGraph.events[obj.id]) == 'object'
&& typeof(RGraph.events[obj.id][i]) == 'object'){
RGraph.events[obj.id][i] = null;}
}
RGraph.DrawBackgroundImage = function (obj)
{
if(!obj.Get('chart.background.image')){
return;}
var gutterLeft = obj.Get('chart.gutter.left');var gutterRight = obj.Get('chart.gutter.right');var gutterTop = obj.Get('chart.gutter.top');var gutterBottom = obj.Get('chart.gutter.bottom');var stretch = obj.Get('chart.background.image.stretch');var align = obj.Get('chart.background.image.align');var img = new Image();img.src = obj.Get('chart.background.image');img.style.position = 'absolute';img.style.left = '-10000px';img.style.top = '-10000px';img.__canvas__ = obj.canvas;img.__object__ = obj;document.body.appendChild(img);img.onload = function ()
{
var obj = this.__object__;img.width = typeof(obj.Get('chart.background.image.width')) == 'number' ? obj.Get('chart.background.image.width') : img.width;img.height = typeof(obj.Get('chart.background.image.height')) == 'number' ? obj.Get('chart.background.image.height') : img.height;if(typeof(align) == 'string'){
if(align.indexOf('right') != -1){
var x = obj.canvas.width - img.width - gutterRight;} else {
var x = gutterLeft;}
if(align.indexOf('bottom') != -1){
var y = obj.canvas.height - img.height - gutterBottom;} else {
var y = gutterTop;}
} else {
var x = gutterLeft;var y = gutterTop;}
if(obj.type == 'fuel'){
obj.Set('chart.background.image.x', ((obj.canvas.width - obj.Get('chart.gutter.left')- obj.Get('chart.gutter.right')) / 2) - (img.width / 2) + obj.Get('chart.gutter.left'));obj.Set('chart.background.image.y', obj.gutterTop + 30);}
if(typeof(obj.Get('chart.background.image.x')) == 'number'){
x = obj.Get('chart.background.image.x');}
if(typeof(obj.Get('chart.background.image.y')) == 'number'){
y = obj.Get('chart.background.image.y');}
pos = RGraph.getCanvasXY(obj.canvas);img.style.position = 'absolute';img.style.left = pos[0] + x + 'px';img.style.top = pos[1] + y + 'px';img.style.zIndex = Number(obj.canvas.style.zIndex) - 1;if(stretch){
img.style.width = (obj.canvas.width  - gutterLeft - gutterRight) + 'px';img.style.height = (obj.canvas.height - gutterTop - gutterBottom) + 'px';} else {
img.style.width = this.width + 'px';img.style.height = this.height + 'px';}
if(typeof(obj.Get('chart.background.image.width')) == 'number'){
img.width = obj.Get('chart.background.image.width');}
if(typeof(obj.Get('chart.background.image.height')) == 'number'){
img.height = obj.Get('chart.background.image.height');}
}
img.onerror = function ()
{
alert('[ERROR] There was an error with the background image that you specified: ' + img.src);obj.Draw();}
}
RGraph.Reset=function(canvas){canvas.width = canvas.width;}
function AA (obj, value)
{            
var value = String(value).replace(/^(\d+)\.\d+/, '$1');var newvalue = Number(value) + 0.5;return (newvalue - value) >= 0 ? newvalue : Math.floor(value);}
RGraph.InstallUserClickListener = function (obj, func)
{
if(typeof(func) == 'function'){
function UserClickListener (e)
{
var obj = e.target.__object__;var shape = obj.getShape(e);if(shape){
func(e, shape);}
}
obj.canvas.addEventListener('click', UserClickListener, false);RGraph.AddEventListener(obj.id, 'click', UserClickListener);}
}
RGraph.InstallUserMousemoveListener = function (obj, func)
{
if(typeof(func) == 'function'){
function UserMousemoveHandler (e)
{
var obj = e.target.__object__;var shape = obj.getShape(e);if(shape && typeof(func) == 'function'){
if(obj.Get('chart.events.mousemove.revertto') == null){
obj.Set('chart.events.mousemove.revertto', e.target.style.cursor);}
func(e, shape)
} else if(typeof(obj.Get('chart.events.mousemove.revertto')) == 'string'){
e.target.style.cursor = obj.Get('chart.events.mousemove.revertto');obj.Set('chart.events.mousemove.revertto', null);}
}
obj.canvas.addEventListener('mousemove', UserMousemoveHandler, false);RGraph.AddEventListener(obj.id, 'mousemove', UserMousemoveHandler);}
}
RGraph.hasTooltips = function (obj)
{
return    (typeof(obj.Get('chart.tooltips')) == 'object' && obj.Get('chart.tooltips') && obj.Get('chart.tooltips').length)
|| typeof(obj.Get('chart.tooltips')) == 'function';}
RGraph.CreateUID = function ()
{
return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
{
var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);return v.toString(16);});}
RGraph.ObjectRegistry.Add = function (obj)
{
var uid = obj.uid;var canvasID = obj.canvas.id;RGraph.ObjectRegistry.objects.byUID.push([uid, obj]);RGraph.ObjectRegistry.objects.byCanvasID.push([canvasID, obj]);}
RGraph.ObjectRegistry.Remove = function (obj)
{
for (var i=0; i<RGraph.ObjectRegistry.objects.byUID.length; ++i){
if(RGraph.ObjectRegistry.objects.byUID[i] && RGraph.ObjectRegistry.objects.byUID[i][0] == obj.uid){
RGraph.ObjectRegistry.objects.byUID[i] = null;}
}
for (var i=0; i<RGraph.ObjectRegistry.objects.byCanvasID.length; ++i){
if(RGraph.ObjectRegistry.objects.byCanvasID[i] && RGraph.ObjectRegistry.objects.byCanvasID[i][1].uid == obj.uid){
RGraph.ObjectRegistry.objects.byCanvasID[i] = null;}
}
}
RGraph.ObjectRegistry.getObjectsByCanvasID = function (id)
{
var store = RGraph.ObjectRegistry.objects.byCanvasID;var ret = [];for (var i=0; i<store.length; ++i){
if(store[i] && store[i][0] == id ){
ret.push(store[i][1]);}
}
return ret;}
RGraph.ObjectRegistry.getObjectByUID = function (uid)
{
}
RGraph.AllowTooltips = function (obj)
{
if(RGraph.hasTooltips(obj)){
RGraph.PreLoadTooltipImages(obj);RGraph.InstallWindowMousedownTooltipListener(obj);RGraph.InstallCanvasMousemoveTooltipListener(obj);RGraph.InstallCanvasMouseupTooltipListener(obj);}
}
// THIS FILE HAS BEEN MINIFIED

if(typeof(RGraph) == 'undefined') RGraph = {isRGraph:true,type:'common'};RGraph.Highlight = {};RGraph.tooltips = {};RGraph.tooltips.padding = '3px';RGraph.tooltips.font_face = 'Tahoma';RGraph.tooltips.font_size = '10pt';RGraph.Tooltip = function (obj, text, x, y, idx)
{
if(typeof(obj.Get('chart.tooltips.override')) == 'function'){
return obj.Get('chart.tooltips.override')(obj, text, x, y, idx);}
text = RGraph.getTooltipTextFromDIV(text);var timers = RGraph.Registry.Get('chart.tooltip.timers');if(timers && timers.length){
for (i=0; i<timers.length; ++i){
clearTimeout(timers[i]);}
}
RGraph.Registry.Set('chart.tooltip.timers', []);if(obj.Get('chart.contextmenu')){
RGraph.HideContext();}
var effect = obj.Get('chart.tooltips.effect').toLowerCase();if(effect == 'snap' && RGraph.Registry.Get('chart.tooltip') && RGraph.Registry.Get('chart.tooltip').__canvas__.id == obj.canvas.id){
if(   obj.type == 'line'
|| obj.type == 'radar'
|| obj.type == 'scatter'
|| obj.type == 'rscatter'
){
var tooltipObj = RGraph.Registry.Get('chart.tooltip');tooltipObj.style.width = null;tooltipObj.style.height = null;tooltipObj.innerHTML = text;tooltipObj.__text__ = text;RGraph.Registry.Get('chart.tooltip').style.width = RGraph.getTooltipWidth(text, obj) + 'px';RGraph.Registry.Get('chart.tooltip').style.height = RGraph.Registry.Get('chart.tooltip').offsetHeight + 'px';if(typeof(jQuery) == 'function' && typeof($) == 'function'){
$('#' + tooltipObj.id).animate({
opacity: 1,
width: tooltipObj.offsetWidth + 'px',
height: tooltipObj.offsetHeight + 'px',
left: x + 'px',
top: (y - tooltipObj.offsetHeight) + 'px'
}, 300);} else {
var currentx = parseInt(RGraph.Registry.Get('chart.tooltip').style.left);var currenty = parseInt(RGraph.Registry.Get('chart.tooltip').style.top);var diffx = x - currentx - ((x + RGraph.Registry.Get('chart.tooltip').offsetWidth) > document.body.offsetWidth ? RGraph.Registry.Get('chart.tooltip').offsetWidth : 0);var diffy = y - currenty - RGraph.Registry.Get('chart.tooltip').offsetHeight;setTimeout('RGraph.Registry.Get("chart.tooltip").style.left = "' + (currentx + (diffx * 0.2)) + 'px"', 25);setTimeout('RGraph.Registry.Get("chart.tooltip").style.left = "' + (currentx + (diffx * 0.4)) + 'px"', 50);setTimeout('RGraph.Registry.Get("chart.tooltip").style.left = "' + (currentx + (diffx * 0.6)) + 'px"', 75);setTimeout('RGraph.Registry.Get("chart.tooltip").style.left = "' + (currentx + (diffx * 0.8)) + 'px"', 100);setTimeout('RGraph.Registry.Get("chart.tooltip").style.left = "' + (currentx + (diffx * 1.0)) + 'px"', 125);setTimeout('RGraph.Registry.Get("chart.tooltip").style.top = "' + (currenty + (diffy * 0.2)) + 'px"', 25);setTimeout('RGraph.Registry.Get("chart.tooltip").style.top = "' + (currenty + (diffy * 0.4)) + 'px"', 50);setTimeout('RGraph.Registry.Get("chart.tooltip").style.top = "' + (currenty + (diffy * 0.6)) + 'px"', 75);setTimeout('RGraph.Registry.Get("chart.tooltip").style.top = "' + (currenty + (diffy * 0.8)) + 'px"', 100);setTimeout('RGraph.Registry.Get("chart.tooltip").style.top = "' + (currenty + (diffy * 1.0)) + 'px"', 125);}
} else {
alert('[TOOLTIPS] The "snap" effect is only supported on the Line, Rscatter, Scatter and Radar charts (tried to use it with type: ' + obj.type);}
RGraph.FireCustomEvent(obj, 'ontooltip');return;}
var tooltipObj = document.createElement('DIV');tooltipObj.className = obj.Get('chart.tooltips.css.class');tooltipObj.style.display = 'none';tooltipObj.style.position = 'absolute';tooltipObj.style.left = 0;tooltipObj.style.top = 0;tooltipObj.style.backgroundColor = 'rgba(255,255,239,0.9)';tooltipObj.style.color = 'black';if(!document.all) tooltipObj.style.border = '';tooltipObj.style.visibility = 'visible';tooltipObj.style.paddingLeft = RGraph.tooltips.padding;tooltipObj.style.paddingRight = RGraph.tooltips.padding;tooltipObj.style.fontFamily = RGraph.tooltips.font_face;tooltipObj.style.fontSize = RGraph.tooltips.font_size;tooltipObj.style.zIndex = 3;tooltipObj.style.borderRadius = '5px';tooltipObj.style.MozBorderRadius = '5px';tooltipObj.style.WebkitBorderRadius = '5px';tooltipObj.style.WebkitBoxShadow = 'rgba(96,96,96,0.5) 0 0 15px';tooltipObj.style.MozBoxShadow = 'rgba(96,96,96,0.5) 0 0 15px';tooltipObj.style.boxShadow = 'rgba(96,96,96,0.5) 0 0 15px';tooltipObj.style.filter = 'progid:DXImageTransform.Microsoft.Shadow(color=#666666,direction=135)';tooltipObj.style.opacity = 0;tooltipObj.style.overflow = 'hidden';tooltipObj.innerHTML = text;tooltipObj.__text__ = text;tooltipObj.__canvas__ = obj.canvas;tooltipObj.style.display = 'inline';tooltipObj.id = '__rgraph_tooltip_' + obj.canvas.id + '_' + obj.uid + '_'+ idx;tooltipObj.__event__ = obj.Get('chart.tooltips.event') || 'click';tooltipObj.__object__ = obj;if(typeof(idx) == 'number'){
tooltipObj.__index__ = idx;if(obj.type == 'line' || obj.type == 'scatter'){
var index2 = idx;while (index2 >= obj.data[0].length){
index2 -= obj.data[0].length;}
tooltipObj.__index2__ = index2;}
}
document.body.appendChild(tooltipObj);var width = tooltipObj.offsetWidth;var height = tooltipObj.offsetHeight;if((y - height - 2) > 0){
y = y - height - 2;} else {
y = y + 2;}
tooltipObj.style.width = width + 'px';if( (x + width) > document.body.offsetWidth ){
x = x - width - 7;var placementLeft = true;if(obj.Get('chart.tooltips.effect') == 'none'){
x = x - 3;}
tooltipObj.style.left = x + 'px';tooltipObj.style.top = y + 'px';} else {
x += 5;tooltipObj.style.left = x + 'px';tooltipObj.style.top = y + 'px';}
if(effect == 'expand'){
tooltipObj.style.left = (x + (width / 2)) + 'px';tooltipObj.style.top = (y + (height / 2)) + 'px';leftDelta = (width / 2) / 10;topDelta = (height / 2) / 10;tooltipObj.style.width = 0;tooltipObj.style.height = 0;tooltipObj.style.opacity = 1;RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) - leftDelta) + 'px' }", 25));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) - leftDelta) + 'px' }", 50));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) - leftDelta) + 'px' }", 75));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) - leftDelta) + 'px' }", 100));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) - leftDelta) + 'px' }", 125));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) - leftDelta) + 'px' }", 150));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) - leftDelta) + 'px' }", 175));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) - leftDelta) + 'px' }", 200));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) - leftDelta) + 'px' }", 225));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) - leftDelta) + 'px' }", 250));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) - topDelta) + 'px' }", 25));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) - topDelta) + 'px' }", 50));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) - topDelta) + 'px' }", 75));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) - topDelta) + 'px' }", 100));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) - topDelta) + 'px' }", 125));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) - topDelta) + 'px' }", 150));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) - topDelta) + 'px' }", 175));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) - topDelta) + 'px' }", 200));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) - topDelta) + 'px' }", 225));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) - topDelta) + 'px' }", 250));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 0.1) + "px'; }", 25));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 0.2) + "px'; }", 50));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 0.3) + "px'; }", 75));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 0.4) + "px'; }", 100));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 0.5) + "px'; }", 125));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 0.6) + "px'; }", 150));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 0.7) + "px'; }", 175));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 0.8) + "px'; }", 200));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 0.9) + "px'; }", 225));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.width = '" + width + "px'; }", 250));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 0.1) + "px'; }", 25));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 0.2) + "px'; }", 50));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 0.3) + "px'; }", 75));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 0.4) + "px'; }", 100));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 0.5) + "px'; }", 125));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 0.6) + "px'; }", 150));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 0.7) + "px'; }", 175));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 0.8) + "px'; }", 200));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 0.9) + "px'; }", 225));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.height = '" + height + "px'; }", 250));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').innerHTML = RGraph.Registry.Get('chart.tooltip').__text__; }", 250));} else if(effect == 'contract'){
tooltipObj.style.left = (x - width) + 'px';tooltipObj.style.top = (y - (height * 2)) + 'px';tooltipObj.style.cursor = 'pointer';leftDelta = width / 10;topDelta = height / 10;tooltipObj.style.width = (width * 5) + 'px';tooltipObj.style.height = (height * 5) + 'px';tooltipObj.style.opacity = 0.2;RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) + leftDelta) + 'px' }", 25));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) + leftDelta) + 'px' }", 50));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) + leftDelta) + 'px' }", 75));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) + leftDelta) + 'px' }", 100));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) + leftDelta) + 'px' }", 125));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) + leftDelta) + 'px' }", 150));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) + leftDelta) + 'px' }", 175));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) + leftDelta) + 'px' }", 200));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) + leftDelta) + 'px' }", 225));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) + leftDelta) + 'px' }", 250));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) + (topDelta*2)) + 'px' }", 25));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) + (topDelta*2)) + 'px' }", 50));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) + (topDelta*2)) + 'px' }", 75));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) + (topDelta*2)) + 'px' }", 100));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) + (topDelta*2)) + 'px' }", 125));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) + (topDelta*2)) + 'px' }", 150));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) + (topDelta*2)) + 'px' }", 175));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) + (topDelta*2)) + 'px' }", 200));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) + (topDelta*2)) + 'px' }", 225));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) + (topDelta*2)) + 'px' }", 250));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 5.5) + "px'; }", 25));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 5.0) + "px'; }", 50));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 4.5) + "px'; }", 75));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 4.0) + "px'; }", 100));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 3.5) + "px'; }", 125));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 3.0) + "px'; }", 150));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 2.5) + "px'; }", 175));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 2.0) + "px'; }", 200));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 1.5) + "px'; }", 225));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.width = '" + width + "px'; }", 250));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 5.5) + "px'; }", 25));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 5.0) + "px'; }", 50));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 4.5) + "px'; }", 75));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 4.0) + "px'; }", 100));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 3.5) + "px'; }", 125));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 3.0) + "px'; }", 150));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 2.5) + "px'; }", 175));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 2.0) + "px'; }", 200));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 1.5) + "px'; }", 225));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.height = '" + height + "px'; }", 250));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').innerHTML = RGraph.Registry.Get('chart.tooltip').__text__; }", 250));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.cursor = 'default'; }", 275));} else if(effect == 'snap'){
for (var i=1; i<=10; ++i){
RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.left = '" + (x * 0.1 * i) + "px'; }", 15 * i));RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.top = '" + (y * 0.1 * i) + "px'; }", 15 * i));}
tooltipObj.style.left = 0 - tooltipObj.offsetWidth + 'px';tooltipObj.style.top = 0 - tooltipObj.offsetHeight + 'px';} else if(effect != 'fade' && effect != 'expand' && effect != 'none' && effect != 'snap' && effect != 'contract'){
alert('[COMMON] Unknown tooltip effect: ' + effect);}
if(effect != 'none'){
setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.opacity = 0.1; }", 25);setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.opacity = 0.2; }", 50);setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.opacity = 0.3; }", 75);setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.opacity = 0.4; }", 100);setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.opacity = 0.5; }", 125);setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.opacity = 0.6; }", 150);setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.opacity = 0.7; }", 175);setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.opacity = 0.8; }", 200);setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.opacity = 0.9; }", 225);}
setTimeout("if(RGraph.Registry.Get('chart.tooltip')){ RGraph.Registry.Get('chart.tooltip').style.opacity = 1;}", effect == 'none' ? 50 : 250);tooltipObj.onmousedown = function (e)
{
e.stopPropagation();}
tooltipObj.onclick = function (e)
{
if(e.button == 0){
e.stopPropagation();}
}
RGraph.Registry.Set('chart.tooltip', tooltipObj);RGraph.FireCustomEvent(obj, 'ontooltip');}
RGraph.getTooltipTextFromDIV = function (text)
{
var result = /^id:(.*)/.exec(text);if(result && result[1] && document.getElementById(result[1])){
text = document.getElementById(result[1]).innerHTML;} else if(result && result[1]){
text = '';}
return text;}
RGraph.parseTooltipText = function (tooltips, idx)
{
if(typeof(tooltips) == 'function'){
var text = tooltips(idx);} else if(typeof(tooltips) == 'object' && tooltips && typeof(tooltips[idx]) == 'function'){
var text = tooltips[idx](idx);} else if(typeof(tooltips) == 'object' && tooltips){
var text = String(tooltips[idx]);} else {
var text = '';}
if(text == 'undefined'){
text = '';} else if(text == 'null'){
text = '';}
return RGraph.getTooltipTextFromDIV(text);}
RGraph.getTooltipWidth = function (text, obj)
{
var div = document.createElement('DIV');div.className = obj.Get('chart.tooltips.css.class');div.style.paddingLeft = RGraph.tooltips.padding;div.style.paddingRight = RGraph.tooltips.padding;div.style.fontFamily = RGraph.tooltips.font_face;div.style.fontSize = RGraph.tooltips.font_size;div.style.visibility = 'hidden';div.style.position = 'absolute';div.style.top = '300px';div.style.left = 0;div.style.display = 'inline';div.innerHTML = RGraph.getTooltipTextFromDIV(text);document.body.appendChild(div);return div.offsetWidth;}
RGraph.HideTooltip = function ()
{
var tooltip = RGraph.Registry.Get('chart.tooltip');if(tooltip){
tooltip.parentNode.removeChild(tooltip);tooltip.style.display = 'none';                
tooltip.style.visibility = 'hidden';RGraph.Registry.Set('chart.tooltip', null);}
}
RGraph.InstallWindowMousedownTooltipListener = function (obj)
{
if(RGraph.Registry.Get('__rgraph_event_listeners__')['window_mousedown']){
return;}
RGraph.AddCustomEventListener(obj, 'onclear', function (obj){RGraph.Registry.Get('__rgraph_event_listeners__')['window_mousedown'] = false;})
rgraph_window_mousedown = function ()
{
if(RGraph.Registry.Get('chart.tooltip')){
RGraph.HideTooltip();RGraph.Clear();RGraph.Redraw();}
}
window.addEventListener('mousedown', rgraph_window_mousedown, false);RGraph.AddEventListener('window_' + obj.id, 'mousedown', rgraph_window_mousedown);}
RGraph.InstallCanvasMouseupTooltipListener = function (obj)
{
if(RGraph.Registry.Get('__rgraph_event_listeners__')[obj.canvas.id + '_mouseup']){
return;}
RGraph.Registry.Get('__rgraph_event_listeners__')[obj.canvas.id + '_mouseup'] = true;RGraph.AddCustomEventListener(obj, 'onclear', function (obj){RGraph.Registry.Get('__rgraph_event_listeners__')[obj.canvas.id + '_mouseup'] = false});rgraph_canvas_mouseup_func = function (e)
{
var objects = RGraph.ObjectRegistry.getObjectsByCanvasID(e.target.id);for (var i=(objects.length - 1); i>=0; --i){
var shape = objects[i].getShape(e);if(shape && shape['object'] && !RGraph.Registry.Get('chart.tooltip')){
if(objects[i].type == 'scatter' && shape['dataset'] > 0){
for (var j=0; j<(objects[i].data.length - 1); ++j){
shape['index'] += objects[i].data[j].length;}
}
var text = RGraph.parseTooltipText(objects[i].Get('chart.tooltips'), shape['index']);if(text){
RGraph.Tooltip(objects[i], text, e.pageX, e.pageY, shape['index']);objects[i].Highlight(shape);e.stopPropagation();e.cancelBubble = true;return false;}
}
}
}
obj.canvas.addEventListener('mouseup', rgraph_canvas_mouseup_func, false);RGraph.AddEventListener(obj.id, 'mouseup', rgraph_canvas_mouseup_func);}
RGraph.InstallCanvasMousemoveTooltipListener = function (obj)
{
if(RGraph.Registry.Get('__rgraph_event_listeners__')[obj.canvas.id + '_mousemove']){
return;}
RGraph.Registry.Get('__rgraph_event_listeners__')[obj.canvas.id + '_mousemove'] = true;RGraph.AddCustomEventListener(obj, 'onclear', function (obj){RGraph.Registry.Get('__rgraph_event_listeners__')[obj.canvas.id + '_mousemove'] = false})
rgraph_canvas_mousemove_func = function (e)
{
var objects = RGraph.ObjectRegistry.getObjectsByCanvasID(e.target.id);            
for (var i=0; i<objects.length; ++i){
var shape = objects[i].getShape(e);if(shape && shape['object']){
if(objects[i].type == 'scatter' && shape['dataset'] > 0){
for (var j=0; j<(objects[i].data.length - 1); ++j){
shape['index'] += objects[i].data[j].length;}
}
var text = RGraph.parseTooltipText(objects[i].Get('chart.tooltips'), shape['index']);if(text){
e.target.style.cursor = 'pointer';e.stopPropagation();if(   typeof(objects[i].Get('chart.tooltips.event')) == 'string'
&& objects[i].Get('chart.tooltips.event') == 'onmousemove'
&& (!RGraph.Registry.Get('chart.tooltip') || shape['index'] != RGraph.Registry.Get('chart.tooltip').__index__ || shape['object'].uid != RGraph.Registry.Get('chart.tooltip').__object__.uid)
){
rgraph_window_mousedown(e);rgraph_canvas_mouseup_func(e);}
return;}
}
}
e.target.style.cursor = 'default';}
obj.canvas.addEventListener('mousemove', rgraph_canvas_mousemove_func, false);RGraph.AddEventListener(obj.id, 'mousemove', rgraph_canvas_mousemove_func);}
RGraph.Highlight.Rect = function (obj, shape)
{
var canvas = obj.canvas;var context = obj.context;context.beginPath();context.strokeStyle = obj.Get('chart.highlight.stroke');context.fillStyle = obj.Get('chart.highlight.fill');context.strokeRect(shape['x'],shape['y'],shape['width'],shape['height']);context.fillRect(shape['x'],shape['y'],shape['width'],shape['height']);context.stroke;context.fill();}
RGraph.Highlight.Point = function (obj, shape)
{
var canvas = obj.canvas;var context = obj.context;context.beginPath();context.strokeStyle = obj.Get('chart.highlight.stroke');context.fillStyle = obj.Get('chart.highlight.fill');var radius = obj.Get('chart.highlight.point.radius') || 2;context.arc(shape['x'],shape['y'],radius, 0, 2 * Math.PI, 0);context.stroke();context.fill();}
RGraph.PreLoadTooltipImages = function (obj)
{
var tooltips = obj.Get('chart.tooltips');if(RGraph.hasTooltips(obj)){
if(obj.type == 'rscatter'){
tooltips = [];for (var i=0; i<obj.data.length; ++i){
tooltips.push(obj.data[3]);}
}
for (var i=0; i<tooltips.length; ++i){
var div = document.createElement('DIV');div.style.position = 'absolute';div.style.opacity = 0;div.style.top = '-100px';div.style.left = '-100px';div.innerHTML = tooltips[i];document.body.appendChild(div);var img_tags = div.getElementsByTagName('IMG');for (var j=0; j<img_tags.length; ++j){
if(img_tags && img_tags[i]){
var img = document.createElement('IMG');img.style.position = 'absolute';img.style.opacity = 0;img.style.top = '-100px';img.style.left = '-100px';img.src = img_tags[i].src
document.body.appendChild(img);setTimeout(function (){document.body.removeChild(img);}, 250);}
}
document.body.removeChild(div);}
}
}
// THIS FILE HAS BEEN MINIFIED

RGraph.DrawKey = function (obj, key, colors)
{
var canvas = obj.canvas;var context = obj.context;context.lineWidth = 1;context.beginPath();var keypos = obj.Get('chart.key.position');var textsize = obj.Get('chart.text.size');if(typeof(obj.Get('chart.key.vpos')) == 'number'){
obj.Set('chart.key.position.y', obj.Get('chart.key.vpos') * this.Get('chart.gutter.top') );}
var key_non_null = [];var colors_non_null = [];for (var i=0; i<key.length; ++i){
if(key[i] != null){
colors_non_null.push(colors[i]);key_non_null.push(key[i]);}
}
key = key_non_null;colors = colors_non_null;if(keypos && keypos == 'gutter'){
RGraph.DrawKey_gutter(obj, key, colors);} else if(keypos && keypos == 'graph'){
RGraph.DrawKey_graph(obj, key, colors);} else {
alert('[COMMON] (' + obj.id + ') Unknown key position: ' + keypos);}
}
RGraph.DrawKey_graph = function (obj, key, colors)
{
var canvas = obj.canvas;var context = obj.context;var text_size = typeof(obj.Get('chart.key.text.size')) == 'number' ? obj.Get('chart.key.text.size') : obj.Get('chart.text.size');var text_font = obj.Get('chart.text.font');var gutterLeft = obj.Get('chart.gutter.left');var gutterRight = obj.Get('chart.gutter.right');var gutterTop = obj.Get('chart.gutter.top');var gutterBottom = obj.Get('chart.gutter.bottom');var hpos = obj.Get('chart.yaxispos') == 'right' ? gutterLeft + 10 : RGraph.GetWidth(obj) - gutterRight - 10;var vpos = gutterTop + 10;var title = obj.Get('chart.title');var blob_size = text_size;var hmargin = 8;var vmargin = 4;var fillstyle = obj.Get('chart.key.background');var strokestyle = '#333';var height = 0;var width = 0;obj.coordsKey = [];context.font = text_size + 'pt ' + obj.Get('chart.text.font');for (i=0; i<key.length; ++i){
width = Math.max(width, context.measureText(key[i]).width);}
width += 5;width += blob_size;width += 5;width += 5;width += 5;if(   obj.Get('chart.yaxispos') == 'left'
|| (obj.type == 'pie' && !obj.Get('chart.yaxispos'))
|| (obj.type == 'hbar' && !obj.Get('chart.yaxispos'))
|| (obj.type == 'hbar' && obj.Get('chart.yaxispos') == 'center')
|| (obj.type == 'rscatter' && !obj.Get('chart.yaxispos'))
|| (obj.type == 'radar' && !obj.Get('chart.yaxispos'))
|| (obj.type == 'rose' && !obj.Get('chart.yaxispos'))
|| (obj.type == 'funnel' && !obj.Get('chart.yaxispos'))
|| (obj.type == 'vprogress' && !obj.Get('chart.yaxispos'))
|| (obj.type == 'hprogress' && !obj.Get('chart.yaxispos'))
){
hpos -= width;}
if(typeof(obj.Get('chart.key.halign')) == 'string'){
if(obj.Get('chart.key.halign') == 'left'){
hpos = gutterLeft + 10;} else if(obj.Get('chart.key.halign') == 'right'){
hpos = RGraph.GetWidth(obj) - gutterRight  - width;}
}
if(typeof(obj.Get('chart.key.position.x')) == 'number'){
hpos = obj.Get('chart.key.position.x');}
if(typeof(obj.Get('chart.key.position.y')) == 'number'){
vpos = obj.Get('chart.key.position.y');}
if(obj.Get('chart.key.shadow')){
context.shadowColor = obj.Get('chart.key.shadow.color');context.shadowBlur = obj.Get('chart.key.shadow.blur');context.shadowOffsetX = obj.Get('chart.key.shadow.offsetx');context.shadowOffsetY = obj.Get('chart.key.shadow.offsety');}
context.beginPath();context.fillStyle = obj.Get('chart.key.background');context.strokeStyle = 'black';if(arguments[3] != false){
context.lineWidth = typeof(obj.Get('chart.key.linewidth')) == 'number' ? obj.Get('chart.key.linewidth') : 1;if(obj.Get('chart.key.rounded') == true){
context.beginPath();context.strokeStyle = strokestyle;RGraph.strokedCurvyRect(context, AA(this, hpos), AA(this, vpos), width - 5, 5 + ( (text_size + 5) * RGraph.getKeyLength(key)),4);context.stroke();context.fill();RGraph.NoShadow(obj);} else {
context.strokeRect(AA(this, hpos), AA(this, vpos), width - 5, 5 + ( (text_size + 5) * RGraph.getKeyLength(key)));context.fillRect(AA(this, hpos), AA(this, vpos), width - 5, 5 + ( (text_size + 5) * RGraph.getKeyLength(key)));}
}
RGraph.NoShadow(obj);context.beginPath();if(obj.Get('chart.key.colors')){
colors = obj.Get('chart.key.colors');}
for (var i=key.length - 1; i>=0; i--){
var j = Number(i) + 1;if(obj.Get('chart.key.color.shape') == 'circle'){
context.beginPath();context.strokeStyle = 'rgba(0,0,0,0)';context.fillStyle = colors[i];context.arc(hpos + 5 + (blob_size / 2), vpos + (5 * j) + (text_size * j) - text_size + (blob_size / 2), blob_size / 2, 0, 6.26, 0);context.fill();} else if(obj.Get('chart.key.color.shape') == 'line'){
context.beginPath();context.strokeStyle = colors[i];context.moveTo(hpos + 5, vpos + (5 * j) + (text_size * j) - text_size + (blob_size / 2));context.lineTo(hpos + blob_size + 5, vpos + (5 * j) + (text_size * j) - text_size + (blob_size / 2));context.stroke();} else {
context.fillStyle =  colors[i];context.fillRect(hpos + 5, vpos + (5 * j) + (text_size * j) - text_size, text_size, text_size + 1);}
context.beginPath();context.fillStyle = 'black';RGraph.Text(context,
text_font,
text_size,
hpos + blob_size + 5 + 5,
vpos + (5 * j) + (text_size * j),
key[i]);if(obj.Get('chart.key.interactive')){
var px = hpos + 5;var py = vpos + (5 * j) + (text_size * j) - text_size;var pw = width - 5 - 5 - 5;var ph = text_size;obj.coordsKey.push([px, py, pw, ph]);}
}
context.fill();if(obj.Get('chart.key.interactive')){
RGraph.Register(obj);var key_mousemove = function (e)
{
var obj = e.target.__object__;var canvas = obj.canvas;var context = obj.context;var mouseCoords = RGraph.getMouseXY(e);var mouseX = mouseCoords[0];var mouseY = mouseCoords[1];for (var i=0; i<obj.coordsKey.length; ++i){
var px = obj.coordsKey[i][0];var py = obj.coordsKey[i][1];var pw = obj.coordsKey[i][2];var ph = obj.coordsKey[i][3];if(   mouseX > (px-2) && mouseX < (px + pw + 2) && mouseY > (py - 2) && mouseY < (py + ph + 2) ){
canvas.style.cursor = 'pointer';return;}
canvas.style.cursor = 'default';if(typeof(obj.Get('chart.tooltips')) == 'object' && typeof(canvas_onmousemove_func) == 'function'){
canvas_onmousemove_func(e);}
}
}
canvas.addEventListener('mousemove', key_mousemove, false);RGraph.AddEventListener(canvas.id, 'mousemove', key_mousemove);var key_click = function (e)
{
RGraph.Redraw();var obj = e.target.__object__;var canvas = obj.canvas;var context = obj.context;var mouseCoords = RGraph.getMouseXY(e);var mouseX = mouseCoords[0];var mouseY = mouseCoords[1];if(obj.type == 'pie'){
return key_onclick_pie(e);}
RGraph.DrawKey(obj, obj.Get('chart.key'), obj.Get('chart.colors'));for (var i=0; i<obj.coordsKey.length; ++i){
var px = obj.coordsKey[i][0];var py = obj.coordsKey[i][1];var pw = obj.coordsKey[i][2];var ph = obj.coordsKey[i][3];if(   mouseX > px && mouseX < (px + pw) && mouseY > py && mouseY < (py + ph) ){
for (j in RGraph.objects){
if(RGraph.objects[j] && RGraph.objects[j].Get && RGraph.objects[j].Get('chart.key.interactive')){
if(RGraph.objects[j].Get('chart.exploded')){
RGraph.objects[j].Set('chart.exploded', []);}
RGraph.Clear(RGraph.objects[j].canvas);RGraph.objects[j].Draw();}
}
var index = obj.coordsKey.length - i - 1;context.beginPath();context.fillStyle = 'rgba(255,255,255,0.9)';context.fillRect(AA(obj, obj.Get('chart.gutter.left')),AA(obj, obj.Get('chart.gutter.top')),canvas.width - obj.Get('chart.gutter.left') - obj.Get('chart.gutter.right'),canvas.height - obj.Get('chart.gutter.top') - obj.Get('chart.gutter.bottom'));context.fill();context.beginPath();context.strokeStyle = obj.Get('chart.colors')[index];context.lineWidth = obj.Get('chart.linewidth');if(obj.coords2 &&obj.coords2[index] &&obj.coords2[index].length){
for (var j=0; j<obj.coords2[index].length; ++j){
var x = obj.coords2[index][j][0];var y = obj.coords2[index][j][1];if(j == 0){
context.moveTo(x, y);} else {
context.lineTo(x, y);}
}
}
context.stroke();context.lineWidth = 1;context.beginPath();context.strokeStyle = 'black';context.fillStyle = 'white';RGraph.SetShadow(obj, 'rgba(0,0,0,0.5)', 0,0,10);context.strokeRect(px - 2, py - 2, pw + 4, ph + 4);context.fillRect(px - 2, py - 2, pw + 4, ph + 4);context.stroke();context.fill();RGraph.NoShadow(obj);context.beginPath();context.fillStyle = obj.Get('chart.colors')[index];context.fillRect(px, py, blob_size, blob_size);context.fill();context.beginPath();context.fillStyle = obj.Get('chart.text.color');RGraph.Text(context,
obj.Get('chart.text.font'),
obj.Get('chart.text.size'),
px + 5 + blob_size,
py + ph,
obj.Get('chart.key')[obj.Get('chart.key').length - i - 1]
);context.fill();canvas.style.cursor = 'pointer';e.cancelBubble = true;if(e.stopPropagation) e.stopPropagation();}
canvas.style.cursor = 'default';}
}
canvas.addEventListener('click', key_click, false);RGraph.AddEventListener(canvas.id, 'click', key_click);var key_onclick_pie = function (e)
{
var canvas = e.target;var context = canvas.getContext('2d');var obj = e.target.__object__;var mouseCoords = RGraph.getMouseXY(e);var mouseX = mouseCoords[0];var mouseY = mouseCoords[1];for (var i=0; i<obj.coordsKey.length; ++i){
var px = obj.coordsKey[i][0];var py = obj.coordsKey[i][1];var pw = obj.coordsKey[i][2];var ph = obj.coordsKey[i][3];if(   mouseX > (px - 2) && mouseX < (px + pw + 2) && mouseY > (py - 2) && mouseY < (py + ph + 2) ){
var index = obj.coordsKey.length - i - 1;e.cancelBubble = true;if(e.stopPropagation) e.stopPropagation();var highlight_key = function ()
{
context.lineWidth = 1;context.beginPath();context.strokeStyle = 'black';context.fillStyle = 'white';RGraph.SetShadow(obj, 'rgba(0,0,0,0.5)', 0,0,10);context.strokeRect(px - 2, py - 2, pw + 4, ph + 4);context.fillRect(px - 2, py - 2, pw + 4, ph + 4);context.stroke();context.fill();RGraph.NoShadow(obj);context.beginPath();context.fillStyle = obj.Get('chart.colors')[index];context.fillRect(px, py, blob_size, blob_size);context.fill();context.beginPath();context.fillStyle = obj.Get('chart.text.color');RGraph.Text(context,
obj.Get('chart.text.font'),
obj.Get('chart.text.size'),
px + 5 + blob_size,
py + ph,
obj.Get('chart.key')[obj.Get('chart.key').length - i - 1]
);context.fill();}
setTimeout(function (){obj.Get('chart.exploded')[index] = 2;RGraph.Clear(obj.canvas);obj.Draw();highlight_key();}, 20);setTimeout(function (){obj.Get('chart.exploded')[index] = 4;RGraph.Clear(obj.canvas);obj.Draw();highlight_key();}, 40);setTimeout(function (){obj.Get('chart.exploded')[index] = 6;RGraph.Clear(obj.canvas);obj.Draw();highlight_key();}, 60);setTimeout(function (){obj.Get('chart.exploded')[index] = 8;RGraph.Clear(obj.canvas);obj.Draw();highlight_key();}, 80);setTimeout(function (){obj.Get('chart.exploded')[index] = 10;RGraph.Clear(obj.canvas);obj.Draw();highlight_key();}, 100);setTimeout(function (){obj.Get('chart.exploded')[index] = 12;RGraph.Clear(obj.canvas);obj.Draw();highlight_key();}, 120);setTimeout(function (){obj.Get('chart.exploded')[index] = 14;RGraph.Clear(obj.canvas);obj.Draw();highlight_key();}, 140);setTimeout(function (){obj.Get('chart.exploded')[index] = 16;RGraph.Clear(obj.canvas);obj.Draw();highlight_key();}, 160);setTimeout(function (){obj.Get('chart.exploded')[index] = 18;RGraph.Clear(obj.canvas);obj.Draw();highlight_key();}, 180);setTimeout(function (){obj.Get('chart.exploded')[index] = 20;RGraph.Clear(obj.canvas);obj.Draw();highlight_key();}, 200);setTimeout(function (){obj.Get('chart.exploded')[index] = 0;}, 250);return;} else {
e.cancelBubble = true;if(e.stopPropagation) e.stopPropagation();}
}
RGraph.Clear(obj.canvas);obj.Draw();}
var key_interactive_click = function (e)
{
if(obj && obj.type == 'pie'){
obj.Set('chart.exploded', []);}
RGraph.Clear(obj.canvas);obj.Draw();}
window.addEventListener('click', key_interactive_click, false);RGraph.AddEventListener('window_' + canvas.id, 'click', key_interactive_click);}
}
RGraph.DrawKey_gutter = function (obj, key, colors)
{
var canvas = obj.canvas;var context = obj.context;var text_size = typeof(obj.Get('chart.key.text.size')) == 'number' ? obj.Get('chart.key.text.size') : obj.Get('chart.text.size');var text_font = obj.Get('chart.text.font');var gutterLeft = obj.Get('chart.gutter.left');var gutterRight = obj.Get('chart.gutter.right');var gutterTop = obj.Get('chart.gutter.top');var gutterBottom = obj.Get('chart.gutter.bottom');var hpos = RGraph.GetWidth(obj) / 2;var vpos = (gutterTop / 2) - 5;var title = obj.Get('chart.title');var blob_size = text_size;var hmargin = 8;var vmargin = 4;var fillstyle = obj.Get('chart.key.background');var strokestyle = 'black';var length = 0;context.font = text_size + 'pt ' + text_font;for (i=0; i<key.length; ++i){
length += hmargin;length += blob_size;length += hmargin;length += context.measureText(key[i]).width;}
length += hmargin;if(obj.type == 'pie'){
if(obj.Get('chart.align') == 'left'){
var hpos = obj.radius + gutterLeft;} else if(obj.Get('chart.align') == 'right'){
var hpos = obj.canvas.width - obj.radius - gutterRight;} else {
hpos = canvas.width / 2;}
}
  
hpos -= (length / 2);if(typeof(obj.Get('chart.key.position.x')) == 'number'){
hpos = obj.Get('chart.key.position.x');}
if(typeof(obj.Get('chart.key.position.y')) == 'number'){
vpos = obj.Get('chart.key.position.y');}
if(obj.Get('chart.key.position.gutter.boxed')){
if(obj.Get('chart.key.shadow')){
context.shadowColor = obj.Get('chart.key.shadow.color');context.shadowBlur = obj.Get('chart.key.shadow.blur');context.shadowOffsetX = obj.Get('chart.key.shadow.offsetx');context.shadowOffsetY = obj.Get('chart.key.shadow.offsety');}
context.beginPath();context.fillStyle = fillstyle;context.strokeStyle = strokestyle;if(obj.Get('chart.key.rounded')){
RGraph.strokedCurvyRect(context, hpos, vpos - vmargin, length, text_size + vmargin + vmargin)
} else {
context.strokeRect(hpos, vpos - vmargin, length, text_size + vmargin + vmargin);context.fillRect(hpos, vpos - vmargin, length, text_size + vmargin + vmargin);}
context.stroke();context.fill();RGraph.NoShadow(obj);}
if(obj.Get('chart.key.colors')){
colors = obj.Get('chart.key.colors');}
for (var i=0, pos=hpos; i<key.length; ++i){
pos += hmargin;if(obj.Get('chart.key.color.shape') =='line'){
context.beginPath();context.strokeStyle = colors[i];context.moveTo(pos, vpos + (blob_size / 2));context.lineTo(pos + blob_size, vpos + (blob_size / 2));context.stroke();} else if(obj.Get('chart.key.color.shape') == 'circle'){
context.beginPath();context.fillStyle = colors[i];context.moveTo(pos, vpos + (blob_size / 2));context.arc(pos + (blob_size / 2), vpos + (blob_size / 2), (blob_size / 2), 0, 6.28, 0);context.fill();} else {
context.beginPath();context.fillStyle = colors[i];context.fillRect(pos, vpos, blob_size, blob_size);context.fill();}
pos += blob_size;pos += hmargin;context.beginPath();context.fillStyle = 'black';RGraph.Text(context, text_font, text_size, pos, vpos + text_size - 1, key[i]);context.fill();pos += context.measureText(key[i]).width;}
}
RGraph.getKeyLength = function (key)
{
var len = 0;for (var i=0; i<key.length; ++i){
if(key[i] != null){
++len;}
}
return len;}
// THIS FILE HAS BEEN MINIFIED

if(typeof(RGraph) == 'undefined') RGraph = {};RGraph.Line = function (id)
{
this.id = id;this.canvas = document.getElementById(id);this.context = this.canvas.getContext ? this.canvas.getContext("2d") : null;this.canvas.__object__ = this;this.type = 'line';this.max = 0;this.coords = [];this.coords2 = [];this.coordsKey = [];this.hasnegativevalues = false;this.isRGraph = true;this.uid = RGraph.CreateUID();RGraph.OldBrowserCompat(this.context);this.properties = {
'chart.background.barcolor1':   'rgba(0,0,0,0)',
'chart.background.barcolor2':   'rgba(0,0,0,0)',
'chart.background.grid':        1,
'chart.background.grid.width':  1,
'chart.background.grid.hsize':  25,
'chart.background.grid.vsize':  25,
'chart.background.grid.color':  '#ddd',
'chart.background.grid.vlines': true,
'chart.background.grid.hlines': true,
'chart.background.grid.border': true,
'chart.background.grid.autofit':           true,
'chart.background.grid.autofit.align':     false,
'chart.background.grid.autofit.numhlines': 5,
'chart.background.grid.autofit.numvlines': 20,
'chart.background.hbars':       null,
'chart.background.image':       null,
'chart.background.image.stretch': true,
'chart.background.image.x':     null,
'chart.background.image.y':     null,
'chart.background.image.align': null,
'chart.labels':                 null,
'chart.labels.ingraph':         null,
'chart.labels.above':           false,
'chart.labels.above.size':      8,
'chart.xtickgap':               20,
'chart.smallxticks':            3,
'chart.largexticks':            5,
'chart.ytickgap':               20,
'chart.smallyticks':            3,
'chart.largeyticks':            5,
'chart.numyticks':              10,
'chart.linewidth':              1.01,
'chart.colors':                 ['red', '#0f0', '#00f', '#f0f', '#ff0', '#0ff'],
'chart.hmargin':                0,
'chart.tickmarks.dot.color':    'white',
'chart.tickmarks':              null,
'chart.tickmarks.linewidth':    null,
'chart.ticksize':               3,
'chart.gutter.left':            25,
'chart.gutter.right':           25,
'chart.gutter.top':             25,
'chart.gutter.bottom':          25,
'chart.tickdirection':          -1,
'chart.yaxispoints':            5,
'chart.fillstyle':              null,
'chart.xaxispos':               'bottom',
'chart.yaxispos':               'left',
'chart.xticks':                 null,
'chart.text.size':              10,
'chart.text.angle':             0,
'chart.text.color':             'black',
'chart.text.font':              'Arial',
'chart.ymin':                   null,
'chart.ymax':                   null,
'chart.title':                  '',
'chart.title.background':       null,
'chart.title.hpos':             null,
'chart.title.vpos':             0.5,
'chart.title.bold':             true,
'chart.title.font':             null,
'chart.title.xaxis':            '',
'chart.title.xaxis.bold':       true,
'chart.title.xaxis.size':       null,
'chart.title.xaxis.font':       null,
'chart.title.yaxis':            '',
'chart.title.yaxis.bold':       true,
'chart.title.yaxis.size':       null,
'chart.title.yaxis.font':       null,
'chart.title.xaxis.pos':        null,
'chart.title.yaxis.pos':        null,
'chart.shadow':                 false,
'chart.shadow.offsetx':         2,
'chart.shadow.offsety':         2,
'chart.shadow.blur':            3,
'chart.shadow.color':           'rgba(0,0,0,0.5)',
'chart.tooltips':               null,
'chart.tooltips.hotspot.xonly': false,
'chart.tooltips.effect':        'fade',
'chart.tooltips.css.class':     'RGraph_tooltip',
'chart.tooltips.event':         'onmousemove',
'chart.tooltips.highlight':     true,
'chart.highlight.stroke':       'gray',
'chart.highlight.fill':         'white',
'chart.stepped':                false,
'chart.key':                    [],
'chart.key.background':         'white',
'chart.key.position':           'graph',
'chart.key.halign':             null,
'chart.key.shadow':             false,
'chart.key.shadow.color':       '#666',
'chart.key.shadow.blur':        3,
'chart.key.shadow.offsetx':     2,
'chart.key.shadow.offsety':     2,
'chart.key.position.gutter.boxed': true,
'chart.key.position.x':         null,
'chart.key.position.y':         null,
'chart.key.color.shape':        'square',
'chart.key.rounded':            true,
'chart.key.linewidth':          1,
'chart.key.colors':             null,
'chart.key.interactive':        false,
'chart.contextmenu':            null,
'chart.ylabels':                true,
'chart.ylabels.count':          5,
'chart.ylabels.inside':         false,
'chart.ylabels.invert':         false,
'chart.xlabels.inside':         false,
'chart.xlabels.inside.color':   'rgba(255,255,255,0.5)',
'chart.noaxes':                 false,
'chart.noyaxis':                false,
'chart.noxaxis':                false,
'chart.noendxtick':             false,
'chart.units.post':             '',
'chart.units.pre':              '',
'chart.scale.decimals':         null,
'chart.scale.point':            '.',
'chart.scale.thousand':         ',',
'chart.crosshairs':             false,
'chart.crosshairs.color':       '#333',
'chart.crosshairs.hline':       true,
'chart.crosshairs.vline':       true,
'chart.annotatable':            false,
'chart.annotate.color':         'black',
'chart.axesontop':              false,
'chart.filled':                 false,
'chart.filled.range':           false,
'chart.filled.accumulative':    true,
'chart.variant':                null,
'chart.axis.color':             'black',
'chart.zoom.factor':            1.5,
'chart.zoom.fade.in':           true,
'chart.zoom.fade.out':          true,
'chart.zoom.hdir':              'right',
'chart.zoom.vdir':              'down',
'chart.zoom.frames':            25,
'chart.zoom.delay':             16.666,
'chart.zoom.shadow':            true,
'chart.zoom.mode':              'canvas',
'chart.zoom.thumbnail.width':   75,
'chart.zoom.thumbnail.height':  75,
'chart.zoom.thumbnail.fixed':   false,
'chart.zoom.background':        true,
'chart.zoom.action':            'zoom',
'chart.backdrop':               false,
'chart.backdrop.size':          30,
'chart.backdrop.alpha':         0.2,
'chart.resizable':              false,
'chart.resize.handle.adjust':   [0,0],
'chart.resize.handle.background': null,
'chart.adjustable':             false,
'chart.noredraw':               false,
'chart.outofbounds':            false,
'chart.chromefix':              true,
'chart.animation.factor':       1,
'chart.animation.unfold.x':     false,
'chart.animation.unfold.y':     true,
'chart.animation.unfold.initial': 2,
'chart.curvy':                    false,
'chart.curvy.factor':             0.25,
'chart.line.visible':             true,
'chart.events.click':             null,
'chart.events.mousemove':         null
}
for (var i=1; i<arguments.length; ++i){
if(typeof(arguments[i]) == 'null' || !arguments[i]){
arguments[i] = [];}
}
this.original_data = [];for (var i=1; i<arguments.length; ++i){
if(arguments[1] && typeof(arguments[1]) == 'object' && arguments[1][0] && typeof(arguments[1][0]) == 'object' && arguments[1][0].length){
var tmp = [];for (var i=0; i<arguments[1].length; ++i){
tmp[i] = RGraph.array_clone(arguments[1][i]);}
for (var j=0; j<tmp.length; ++j){
this.original_data[j] = RGraph.array_clone(tmp[j]);}
} else {
this.original_data[i - 1] = RGraph.array_clone(arguments[i]);}
}
if(!this.canvas){
alert('[LINE] Fatal error: no canvas support');return;}
this.data_arr = RGraph.array_linearize(this.original_data);this.getShape = this.getPoint;RGraph.Register(this);}
RGraph.Line.prototype.Set = function (name, value)
{
if(name == 'chart.tooltips' && typeof value == 'object' && value){
var tooltips = [];for (var i=1; i<arguments.length; i++){
if(typeof(arguments[i]) == 'object' && arguments[i][0]){
for (var j=0; j<arguments[i].length; j++){
tooltips.push(arguments[i][j]);}
} else if(typeof(arguments[i]) == 'function'){
tooltips = arguments[i];} else {
tooltips.push(arguments[i]);}
}
value = tooltips;}
if(name == 'chart.tickmarks' && typeof(value) == 'object' && value){
value = RGraph.array_reverse(value);}
if(name == 'chart.ylabels.invert' && value && this.Get('chart.ymin') == null){
this.Set('chart.ymin', 0);}
if(name == 'chart.linewidth' && navigator.userAgent.match(/Chrome/)){
if(value == 1){
value = 1.01;} else if(RGraph.is_array(value)){
for (var i=0; i<value.length; ++i){
if(typeof(value[i]) == 'number' && value[i] == 1){
value[i] = 1.01;}
}
}
}
if(name == 'chart.xaxispos' ){
if(value != 'bottom' && value != 'center' && value != 'top'){
alert('[LINE] (' + this.id + ') chart.xaxispos should be top, center or bottom. Tried to set it to: ' + value + ' Changing it to center');value = 'center';}
}
if(name == 'chart.curvy.factor' && (value < 0 || value > 0.5)){
alert('[LINE] chart.curvy.factor should be between 0 and 0.5 - setting it to 0.25');value = 0.25;}
if(name == 'chart.numxticks'){
name = 'chart.xticks';}
this.properties[name] = value;}
RGraph.Line.prototype.Get = function (name)
{
return this.properties[name];}
RGraph.Line.prototype.Draw = function ()
{
RGraph.FireCustomEvent(this, 'onbeforedraw');RGraph.DrawBackgroundImage(this);this.gutterLeft = this.Get('chart.gutter.left');this.gutterRight = this.Get('chart.gutter.right');this.gutterTop = this.Get('chart.gutter.top');this.gutterBottom = this.Get('chart.gutter.bottom');if(   this.Get('chart.shadow')
&& navigator.userAgent.match(/Chrome/)
&& this.Get('chart.linewidth') <= 1
&& this.Get('chart.chromefix')
&& this.Get('chart.shadow.blur') > 0){
alert('[RGRAPH WARNING] Chrome has a shadow bug, meaning you should increase the linewidth to at least 1.01');}
this.data = RGraph.array_clone(this.original_data);this.max = 0;if(this.Get('chart.filled') && !this.Get('chart.filled.range') && this.data.length > 1 && this.Get('chart.filled.accumulative')){
var accumulation = [];for (var set=0; set<this.data.length; ++set){
for (var point=0; point<this.data[set].length; ++point){
this.data[set][point] = Number(accumulation[point] ? accumulation[point] : 0) + this.data[set][point];accumulation[point] = this.data[set][point];}
}
}
if(this.Get('chart.ymax')){
this.max = this.Get('chart.ymax');this.min = this.Get('chart.ymin') ? this.Get('chart.ymin') : 0;this.scale = [
( ((this.max - this.min) * (1/5)) + this.min).toFixed(this.Get('chart.scale.decimals')),
( ((this.max - this.min) * (2/5)) + this.min).toFixed(this.Get('chart.scale.decimals')),
( ((this.max - this.min) * (3/5)) + this.min).toFixed(this.Get('chart.scale.decimals')),
( ((this.max - this.min) * (4/5)) + this.min).toFixed(this.Get('chart.scale.decimals')),
this.max.toFixed(this.Get('chart.scale.decimals'))
];if(!this.Get('chart.outofbounds')){
for (dataset=0; dataset<this.data.length; ++dataset){
for (var datapoint=0; datapoint<this.data[dataset].length; datapoint++){
this.hasnegativevalues = (this.data[dataset][datapoint] < 0) || this.hasnegativevalues;}
}
}
} else {
this.min = this.Get('chart.ymin') ? this.Get('chart.ymin') : 0;for (dataset=0; dataset<this.data.length; ++dataset){
for (var datapoint=0; datapoint<this.data[dataset].length; datapoint++){
this.max = Math.max(this.max, this.data[dataset][datapoint] ? Math.abs(parseFloat(this.data[dataset][datapoint])) : 0);if(!this.Get('chart.outofbounds')){
this.hasnegativevalues = (this.data[dataset][datapoint] < 0) || this.hasnegativevalues;}
}
}
this.scale = RGraph.getScale(Math.abs(parseFloat(this.max)), this);this.max = this.scale[4] ? this.scale[4] : 0;if(this.Get('chart.ymin')){
this.scale[0] = ((this.max - this.Get('chart.ymin')) * (1/5)) + this.Get('chart.ymin');this.scale[1] = ((this.max - this.Get('chart.ymin')) * (2/5)) + this.Get('chart.ymin');this.scale[2] = ((this.max - this.Get('chart.ymin')) * (3/5)) + this.Get('chart.ymin');this.scale[3] = ((this.max - this.Get('chart.ymin')) * (4/5)) + this.Get('chart.ymin');this.scale[4] = ((this.max - this.Get('chart.ymin')) * (5/5)) + this.Get('chart.ymin');}
if(typeof(this.Get('chart.scale.decimals')) == 'number'){
this.scale[0] = Number(this.scale[0]).toFixed(this.Get('chart.scale.decimals'));this.scale[1] = Number(this.scale[1]).toFixed(this.Get('chart.scale.decimals'));this.scale[2] = Number(this.scale[2]).toFixed(this.Get('chart.scale.decimals'));this.scale[3] = Number(this.scale[3]).toFixed(this.Get('chart.scale.decimals'));this.scale[4] = Number(this.scale[4]).toFixed(this.Get('chart.scale.decimals'));}
}
if(this.Get('chart.contextmenu')){
RGraph.ShowContext(this);}
this.coords = [];this.grapharea = this.canvas.height - this.gutterTop - this.gutterBottom;this.halfgrapharea = this.grapharea / 2;this.halfTextHeight = this.Get('chart.text.size') / 2;if(this.Get('chart.xaxispos') == 'bottom' && this.hasnegativevalues && navigator.userAgent.indexOf('Opera') == -1){
alert('[LINE] You have negative values and the X axis is at the bottom. This is not good...');}
if(this.Get('chart.variant') == '3d'){
RGraph.Draw3DAxes(this);}
RGraph.background.Draw(this);if(this.Get('chart.background.hbars') && this.Get('chart.background.hbars').length > 0){
RGraph.DrawBars(this);}
if(this.Get('chart.axesontop') == false){
this.DrawAxes();}
var shadowColor = this.Get('chart.shadow.color');for (var i=0, j=0; i<this.data.length; i++, j++){
this.context.beginPath();if(this.Get('chart.shadow') && !this.Get('chart.filled')){
if(typeof(shadowColor) == 'object' && shadowColor[i - 1]){
this.context.shadowColor = shadowColor[i];} else if(typeof(shadowColor) == 'object'){
this.context.shadowColor = shadowColor[0];} else if(typeof(shadowColor) == 'string'){
this.context.shadowColor = shadowColor;}
this.context.shadowBlur = this.Get('chart.shadow.blur');this.context.shadowOffsetX = this.Get('chart.shadow.offsetx');this.context.shadowOffsetY = this.Get('chart.shadow.offsety');} else if(this.Get('chart.filled') && this.Get('chart.shadow')){
alert('[LINE] Shadows are not permitted when the line is filled');}
if(this.Get('chart.fillstyle')){
if(typeof(this.Get('chart.fillstyle')) == 'object' && this.Get('chart.fillstyle')[j]){
var fill = this.Get('chart.fillstyle')[j];} else if(typeof(this.Get('chart.fillstyle')) == 'string'){
var fill = this.Get('chart.fillstyle');} else {
alert('[LINE] Warning: chart.fillstyle must be either a string or an array with the same number of elements as you have sets of data');}
} else if(this.Get('chart.filled')){
var fill = this.Get('chart.colors')[j];} else {
var fill = null;}
if(this.Get('chart.tickmarks') && typeof(this.Get('chart.tickmarks')) == 'object'){
var tickmarks = this.Get('chart.tickmarks')[i];} else if(this.Get('chart.tickmarks') && typeof(this.Get('chart.tickmarks')) == 'string'){
var tickmarks = this.Get('chart.tickmarks');} else if(this.Get('chart.tickmarks') && typeof(this.Get('chart.tickmarks')) == 'function'){
var tickmarks = this.Get('chart.tickmarks');} else {
var tickmarks = null;}
this.DrawLine(this.data[i],
this.Get('chart.colors')[j],
fill,
this.GetLineWidth(j),
tickmarks,
i);this.context.stroke();}
if(this.Get('chart.filled') && this.Get('chart.filled.accumulative')){
for (var i=0; i<this.coords2.length; ++i){
this.context.beginPath();this.context.lineWidth = this.GetLineWidth(i);this.context.strokeStyle = this.Get('chart.colors')[i];for (var j=0; j<this.coords2[i].length; ++j){
if(j == 0 || this.coords2[i][j][1] == null || (this.coords2[i][j - 1] && this.coords2[i][j - 1][1] == null)){
this.context.moveTo(this.coords2[i][j][0], this.coords2[i][j][1]);} else {
if(this.Get('chart.stepped')){
this.context.lineTo(this.coords2[i][j][0], this.coords2[i][j - 1][1]);}
this.context.lineTo(this.coords2[i][j][0], this.coords2[i][j][1]);}
}
this.context.stroke();}
if(this.Get('chart.tickmarks')){
this.context.beginPath();this.context.fillStyle = 'white';for (var i=0; i<this.coords2.length; ++i){
this.context.beginPath();this.context.strokeStyle = this.Get('chart.colors')[i];for (var j=0; j<this.coords2[i].length; ++j){
if(typeof(this.coords2[i][j]) == 'object' && typeof(this.coords2[i][j][0]) == 'number' && typeof(this.coords2[i][j][1]) == 'number'){
var tickmarks = typeof(this.Get('chart.tickmarks')) == 'object' ? this.Get('chart.tickmarks')[i] : this.Get('chart.tickmarks');this.DrawTick(  this.coords2[i][j],
this.coords2[i][j][0],
this.coords2[i][j][1],
this.context.strokeStyle,
false,
j == 0 ? 0 : this.coords2[i][j - 1][0],
j == 0 ? 0 : this.coords2[i][j - 1][1],
tickmarks,
j);}
}
}
this.context.stroke();this.context.fill();}
}
this.context.beginPath();RGraph.InstallUserClickListener(this, this.Get('chart.events.click'));RGraph.InstallUserMousemoveListener(this, this.Get('chart.events.mousemove'));RGraph.AllowTooltips(this);if(this.Get('chart.axesontop')){
this.DrawAxes();}
this.DrawLabels();this.DrawRange();if(this.Get('chart.key').length){
RGraph.DrawKey(this, this.Get('chart.key'), this.Get('chart.colors'));}
if(this.Get('chart.labels.above')){
this.DrawAboveLabels();}
RGraph.DrawInGraphLabels(this);RGraph.DrawCrosshairs(this);if(this.Get('chart.annotatable')){
RGraph.Annotate(this);}
if(this.Get('chart.filled') && this.Get('chart.filled.range') && this.data.length == 2){
this.context.beginPath();var len = this.coords.length / 2;this.context.lineWidth = this.Get('chart.linewidth');this.context.strokeStyle = this.Get('chart.colors')[0];for (var i=0; i<len; ++i){
if(i == 0){
this.context.moveTo(this.coords[i][0], this.coords[i][1]);} else {
this.context.lineTo(this.coords[i][0], this.coords[i][1]);}
}
this.context.stroke();this.context.beginPath();if(this.Get('chart.colors')[1]){
this.context.strokeStyle = this.Get('chart.colors')[1];}
for (var i=this.coords.length - 1; i>=len; --i){
if(i == (this.coords.length - 1) ){
this.context.moveTo(this.coords[i][0], this.coords[i][1]);} else {
this.context.lineTo(this.coords[i][0], this.coords[i][1]);}
}
this.context.stroke();} else if(this.Get('chart.filled') && this.Get('chart.filled.range')){
alert('[LINE] You must have only two sets of data for a filled range chart');}
if(this.Get('chart.zoom.mode') == 'thumbnail'){
RGraph.ShowZoomWindow(this);}
if(this.Get('chart.zoom.mode') == 'area'){
RGraph.ZoomArea(this);}
if(this.Get('chart.resizable')){
RGraph.AllowResizing(this);}
if(this.Get('chart.adjustable')){
RGraph.AllowAdjusting(this);}
RGraph.FireCustomEvent(this, 'ondraw');}
RGraph.Line.prototype.DrawAxes = function ()
{
if(this.Get('chart.noaxes')){
return;}
RGraph.NoShadow(this);this.context.lineWidth = 1;this.context.lineCap = 'butt';this.context.strokeStyle = this.Get('chart.axis.color');this.context.beginPath();if(this.Get('chart.noxaxis') == false){
if(this.Get('chart.xaxispos') == 'center'){
this.context.moveTo(this.gutterLeft, AA(this, (this.grapharea / 2) + this.gutterTop));this.context.lineTo(this.canvas.width - this.gutterRight, AA(this, (this.grapharea / 2) + this.gutterTop));} else if(this.Get('chart.xaxispos') == 'top'){
this.context.moveTo(this.gutterLeft, AA(this, this.gutterTop));this.context.lineTo(this.canvas.width - this.gutterRight, AA(this, this.gutterTop));} else {
this.context.moveTo(this.gutterLeft, AA(this, this.canvas.height - this.gutterBottom));this.context.lineTo(this.canvas.width - this.gutterRight, AA(this, this.canvas.height - this.gutterBottom));}
}
if(this.Get('chart.noyaxis') == false){
if(this.Get('chart.yaxispos') == 'left'){
this.context.moveTo(AA(this, this.gutterLeft), this.gutterTop);this.context.lineTo(AA(this, this.gutterLeft), this.canvas.height - this.gutterBottom );} else {
this.context.moveTo(AA(this, this.canvas.width - this.gutterRight), this.gutterTop);this.context.lineTo(AA(this, this.canvas.width - this.gutterRight), this.canvas.height - this.gutterBottom);}
}
if(this.Get('chart.noxaxis') == false){
if(this.data[0].length > 0){
var xTickInterval = (this.canvas.width - this.gutterLeft - this.gutterRight) / (this.Get('chart.xticks') ? this.Get('chart.xticks') : (this.data[0].length - 1));}
if(!xTickInterval || xTickInterval <= 0){
xTickInterval = (this.canvas.width - this.gutterLeft - this.gutterRight) / (this.Get('chart.labels') && this.Get('chart.labels').length ? this.Get('chart.labels').length - 1 : 10);}
for (x=this.gutterLeft + (this.Get('chart.yaxispos') == 'left' ? xTickInterval : 0); x<=(this.canvas.width - this.gutterRight + 1 ); x+=xTickInterval){
if(this.Get('chart.yaxispos') == 'right' && x >= (this.canvas.width - this.gutterRight - 1) ){
break;}
if(this.Get('chart.noendxtick')){
if(this.Get('chart.yaxispos') == 'left' && x >= (this.canvas.width - this.gutterRight)){
break;} else if(this.Get('chart.yaxispos') == 'right' && x == this.gutterLeft){
continue;}
}
var yStart = this.Get('chart.xaxispos') == 'center' ? (this.gutterTop + (this.grapharea / 2)) - 3 : this.canvas.height - this.gutterBottom;var yEnd = this.Get('chart.xaxispos') == 'center' ? yStart + 6 : this.canvas.height - this.gutterBottom - (x % 60 == 0 ? this.Get('chart.largexticks') * this.Get('chart.tickdirection') : this.Get('chart.smallxticks') * this.Get('chart.tickdirection'));if(this.Get('chart.xaxispos') == 'center'){
var yStart = AA(this, (this.gutterTop + (this.grapharea / 2))) - 3;var yEnd = yStart + 6;} else if(this.Get('chart.xaxispos') == 'bottom'){
var yStart = this.canvas.height - this.gutterBottom;var yEnd = this.canvas.height - this.gutterBottom - (x % 60 == 0 ? this.Get('chart.largexticks') * this.Get('chart.tickdirection') : this.Get('chart.smallxticks') * this.Get('chart.tickdirection'));yEnd += 0.5;} else if(this.Get('chart.xaxispos') == 'top'){
yStart = this.gutterTop - 3;yEnd = this.gutterTop;}
this.context.moveTo(AA(this, x), yStart);this.context.lineTo(AA(this, x), yEnd);}
} else if(this.Get('chart.noyaxis') == false){
if(this.Get('chart.yaxispos') == 'left'){
this.context.moveTo(this.gutterLeft, AA(this, this.canvas.height - this.gutterBottom));this.context.lineTo(this.gutterLeft - this.Get('chart.smallyticks'), AA(this, this.canvas.height - this.gutterBottom));} else {
this.context.moveTo(this.canvas.width - this.gutterRight, AA(this, this.canvas.height - this.gutterBottom));this.context.lineTo(this.canvas.width - this.gutterRight + this.Get('chart.smallyticks'), AA(this, this.canvas.height - this.gutterBottom));}
}
var numyticks = this.Get('chart.numyticks');if(this.Get('chart.noyaxis') == false){
var counter = 0;var adjustment = 0;if(this.Get('chart.yaxispos') == 'right'){
adjustment = (this.canvas.width - this.gutterLeft - this.gutterRight);}
if(this.Get('chart.xaxispos') == 'center'){
var interval = (this.grapharea / numyticks);var lineto = (this.Get('chart.yaxispos') == 'left' ? this.gutterLeft : this.canvas.width - this.gutterRight + this.Get('chart.smallyticks'));for (y=this.gutterTop; y < (this.grapharea / 2) + this.gutterTop; y+=interval){
if(y < (this.grapharea / 2) + this.gutterTop - 1){
this.context.moveTo((this.Get('chart.yaxispos') == 'left' ? this.gutterLeft - this.Get('chart.smallyticks') : this.canvas.width - this.gutterRight), AA(this, y));this.context.lineTo(lineto, AA(this, y));}
}
for (y=this.gutterTop + (this.halfgrapharea) + interval; y <= this.grapharea + this.gutterTop; y+=interval){
this.context.moveTo((this.Get('chart.yaxispos') == 'left' ? this.gutterLeft - this.Get('chart.smallyticks') : this.canvas.width - this.gutterRight), AA(this, y));this.context.lineTo(lineto, AA(this, y));}
} else if(this.Get('chart.xaxispos') == 'top'){
var interval = (this.grapharea / numyticks);var lineto = (this.Get('chart.yaxispos') == 'left' ? this.gutterLeft : this.canvas.width - this.gutterRight + this.Get('chart.smallyticks'));for (y=this.gutterTop + interval; y <=this.grapharea + this.gutterTop; y+=interval){
this.context.moveTo((this.Get('chart.yaxispos') == 'left' ? this.gutterLeft - this.Get('chart.smallyticks') : this.canvas.width - this.gutterRight), AA(this, y));this.context.lineTo(lineto, AA(this, y));}
if(this.Get('chart.noxaxis')){
this.context.moveTo((this.Get('chart.yaxispos') == 'left' ? this.gutterLeft - this.Get('chart.smallyticks') : this.canvas.width - this.gutterRight), this.gutterTop);this.context.lineTo(lineto, this.gutterTop);}
} else {
var lineto = (this.Get('chart.yaxispos') == 'left' ? this.gutterLeft - this.Get('chart.smallyticks') : this.canvas.width - this.gutterRight + this.Get('chart.smallyticks'));for (y=this.gutterTop; y < (this.canvas.height - this.gutterBottom) && counter < numyticks; y+=( (this.canvas.height - this.gutterTop - this.gutterBottom) / numyticks) ){
this.context.moveTo(this.gutterLeft + adjustment, AA(this, y));this.context.lineTo(lineto, AA(this, y));var counter = counter +1;}
}
} else if(this.Get('chart.noxaxis') == false){
if(this.Get('chart.yaxispos') == 'left'){
this.context.moveTo(this.gutterLeft, this.Get('chart.xaxispos') == 'top' ? this.gutterTop : this.canvas.height - this.gutterBottom);this.context.lineTo(this.gutterLeft, this.Get('chart.xaxispos') == 'top' ? this.gutterTop - this.Get('chart.smallxticks') : this.canvas.height - this.gutterBottom + this.Get('chart.smallxticks'));} else {
this.context.moveTo(this.canvas.width - this.gutterRight, this.canvas.height - this.gutterBottom);this.context.lineTo(this.canvas.width - this.gutterRight, this.canvas.height - this.gutterBottom + this.Get('chart.smallxticks'));}
}
this.context.stroke();}
RGraph.Line.prototype.DrawLabels = function ()
{
this.context.strokeStyle = 'black';this.context.fillStyle = this.Get('chart.text.color');this.context.lineWidth = 1;RGraph.NoShadow(this);var font = this.Get('chart.text.font');var text_size = this.Get('chart.text.size');var context = this.context;var canvas = this.canvas;if(this.Get('chart.ylabels') && this.Get('chart.ylabels.specific') == null){
var units_pre = this.Get('chart.units.pre');var units_post = this.Get('chart.units.post');var xpos = this.Get('chart.yaxispos') == 'left' ? this.gutterLeft - 5 : this.canvas.width - this.gutterRight + 5;var align = this.Get('chart.yaxispos') == 'left' ? 'right' : 'left';var numYLabels = this.Get('chart.ylabels.count');var bounding = false;var bgcolor = this.Get('chart.ylabels.inside') ? this.Get('chart.ylabels.inside.color') : null;if(this.Get('chart.ylabels.inside') == true && align == 'left'){
xpos -= 10;align = 'right';bounding = true;} else if(this.Get('chart.ylabels.inside') == true && align == 'right'){
xpos += 10;align = 'left';bounding = true;}
if(this.Get('chart.xaxispos') == 'center'){
var half = this.grapharea / 2;if(numYLabels == 1 || numYLabels == 3 || numYLabels == 5){
RGraph.Text(context, font, text_size, xpos, this.gutterTop + ( (0/5) * half ) + this.halfTextHeight, RGraph.number_format(this, this.scale[4], units_pre, units_post), null, align, bounding, null, bgcolor);if(numYLabels == 5){
RGraph.Text(context, font, text_size, xpos, this.gutterTop + ( (1/5) * half ) + this.halfTextHeight, RGraph.number_format(this, this.scale[3], units_pre, units_post), null, align, bounding, null, bgcolor);RGraph.Text(context, font, text_size, xpos, this.gutterTop + ( (3/5) * half ) + this.halfTextHeight, RGraph.number_format(this, this.scale[1], units_pre, units_post), null, align, bounding, null, bgcolor);}
if(numYLabels >= 3){
RGraph.Text(context, font, text_size, xpos, this.gutterTop + ( (2/5) * half ) + this.halfTextHeight, RGraph.number_format(this, this.scale[2], units_pre, units_post), null, align, bounding, null, bgcolor);RGraph.Text(context, font, text_size, xpos, this.gutterTop + ( (4/5) * half ) + this.halfTextHeight, RGraph.number_format(this, this.scale[0], units_pre, units_post), null, align, bounding, null, bgcolor);}
if(numYLabels >= 3){
RGraph.Text(context, font, text_size, xpos, this.gutterTop + ( (6/5) * half ) + this.halfTextHeight, '-' + RGraph.number_format(this, this.scale[0], units_pre, units_post), null, align, bounding, null, bgcolor);RGraph.Text(context, font, text_size, xpos, this.gutterTop + ( (8/5) * half ) + this.halfTextHeight, '-' + RGraph.number_format(this, this.scale[2], units_pre, units_post), null, align, bounding, null, bgcolor);}
if(numYLabels == 5){
RGraph.Text(context, font, text_size, xpos, this.gutterTop + ( (7/5) * half ) + this.halfTextHeight, '-' + RGraph.number_format(this, this.scale[1], units_pre, units_post), null, align, bounding, null, bgcolor);RGraph.Text(context, font, text_size, xpos, this.gutterTop + ( (9/5) * half ) + this.halfTextHeight, '-' + RGraph.number_format(this, this.scale[3], units_pre, units_post), null, align, bounding, null, bgcolor);}
RGraph.Text(context, font, text_size, xpos, this.gutterTop + ( (10/5) * half ) + this.halfTextHeight, '-' + RGraph.number_format(this, (this.scale[4] == '1.0' ? '1.0' : this.scale[4]), units_pre, units_post), null, align, bounding, null, bgcolor);} else if(numYLabels == 10){
var interval = (this.grapharea / numYLabels) / 2;for (var i=0; i<numYLabels; ++i){
RGraph.Text(context,font, text_size, xpos, this.gutterTop + this.halfTextHeight + ((i/20) * (this.grapharea) ), RGraph.number_format(this, ((this.scale[4] / numYLabels) * (numYLabels - i)).toFixed((this.Get('chart.scale.decimals'))),units_pre, units_post), null, align, bounding, null, bgcolor);RGraph.Text(context, font, text_size, xpos,
this.gutterTop + this.halfTextHeight + ((i/20) * this.grapharea) + (this.grapharea / 2) + (this.grapharea / 20),
'-' + RGraph.number_format(this, (this.scale[4] - ((this.scale[4] / numYLabels) * (numYLabels - i - 1))).toFixed((this.Get('chart.scale.decimals'))),units_pre, units_post), null, align, bounding, null, bgcolor);}
} else {
alert('[LINE SCALE] The number of Y labels must be 1/3/5/10');}
if(typeof(this.Get('chart.ymin')) == 'number'){
RGraph.Text(context, font, text_size, xpos, this.canvas.height / 2, RGraph.number_format(this, this.Get('chart.ymin').toFixed(this.Get('chart.scale.decimals')), units_pre, units_post), 'center', align, bounding, null, bgcolor);}
if(this.Get('chart.noxaxis') == true){
RGraph.Text(context,font,text_size,xpos,this.gutterTop + ( (5/5) * half ) + this.halfTextHeight,this.Get('chart.units.pre') + '0' + this.Get('chart.units.post'),null, align, bounding, null, bgcolor);}
} else if(this.Get('chart.xaxispos') == 'top'){
var scale = RGraph.array_reverse(this.scale);if(this.Get('chart.ylabels.invert')){
scale = RGraph.array_reverse(scale);this.context.translate(0, this.grapharea * -0.2);if(typeof(this.Get('chart.ymin')) == null){
this.Set('chart.ymin', 0);}
}
if(numYLabels == 1 || numYLabels == 3 || numYLabels == 5){
RGraph.Text(context, font, text_size, xpos, this.gutterTop + this.halfTextHeight + ((1/5) * (this.grapharea ) ), '-' + RGraph.number_format(this, scale[4], units_pre, units_post), null, align, bounding, null, bgcolor);if(numYLabels == 5){
RGraph.Text(context, font, text_size, xpos, this.gutterTop + this.halfTextHeight + ((4/5) * (this.grapharea) ), '-' + RGraph.number_format(this, scale[1], units_pre, units_post), null, align, bounding, null, bgcolor);RGraph.Text(context, font, text_size, xpos, this.gutterTop + this.halfTextHeight + ((2/5) * (this.grapharea) ), '-' + RGraph.number_format(this, scale[3], units_pre, units_post), null, align, bounding, null, bgcolor);}
if(numYLabels >= 3){
RGraph.Text(context, font, text_size, xpos, this.gutterTop + this.halfTextHeight + ((3/5) * (this.grapharea ) ), '-' + RGraph.number_format(this, scale[2], units_pre, units_post), null, align, bounding, null, bgcolor);RGraph.Text(context, font, text_size, xpos, this.gutterTop + this.halfTextHeight + ((5/5) * (this.grapharea) ), '-' + RGraph.number_format(this, scale[0], units_pre, units_post), null, align, bounding, null, bgcolor);}
} else if(numYLabels == 10){
var interval = (this.grapharea / numYLabels) / 2;for (var i=0; i<numYLabels; ++i){
RGraph.Text(context,font,text_size,xpos,(2 * interval) + this.gutterTop + this.halfTextHeight + ((i/10) * (this.grapharea) ),'-' + RGraph.number_format(this,(scale[0] - (((scale[0] - this.min) / numYLabels) * (numYLabels - i - 1))).toFixed((this.Get('chart.scale.decimals'))),units_pre,units_post),null,align,bounding,null,bgcolor);}
} else {
alert('[LINE SCALE] The number of Y labels must be 1/3/5/10');}
if(this.Get('chart.ylabels.invert')){
this.context.translate(0, 0 - (this.grapharea * -0.2));}
if(typeof(this.Get('chart.ymin')) == 'number'){
RGraph.Text(context,font,text_size,xpos,this.Get('chart.ylabels.invert') ? this.canvas.height - this.gutterBottom : this.gutterTop,'-' + RGraph.number_format(this, this.Get('chart.ymin').toFixed(this.Get('chart.scale.decimals')), units_pre, units_post),'center',align,bounding,null,bgcolor);}
} else {
if(this.Get('chart.ylabels.invert')){
this.scale = RGraph.array_reverse(this.scale);this.context.translate(0, this.grapharea * 0.2);if(typeof(this.Get('chart.ymin')) == null){
this.Set('chart.ymin', 0);}
}
if(numYLabels == 1 || numYLabels == 3 || numYLabels == 5){
RGraph.Text(context, font, text_size, xpos, this.gutterTop + this.halfTextHeight + ((0/5) * (this.grapharea ) ), RGraph.number_format(this, this.scale[4], units_pre, units_post), null, align, bounding, null, bgcolor);if(numYLabels == 5){
RGraph.Text(context, font, text_size, xpos, this.gutterTop + this.halfTextHeight + ((3/5) * (this.grapharea) ), RGraph.number_format(this, this.scale[1], units_pre, units_post), null, align, bounding, null, bgcolor);RGraph.Text(context, font, text_size, xpos, this.gutterTop + this.halfTextHeight + ((1/5) * (this.grapharea) ), RGraph.number_format(this, this.scale[3], units_pre, units_post), null, align, bounding, null, bgcolor);}
if(numYLabels >= 3){
RGraph.Text(context, font, text_size, xpos, this.gutterTop + this.halfTextHeight + ((2/5) * (this.grapharea ) ), RGraph.number_format(this, this.scale[2], units_pre, units_post), null, align, bounding, null, bgcolor);RGraph.Text(context, font, text_size, xpos, this.gutterTop + this.halfTextHeight + ((4/5) * (this.grapharea) ), RGraph.number_format(this, this.scale[0], units_pre, units_post), null, align, bounding, null, bgcolor);}
} else if(numYLabels == 10){
var interval = (this.grapharea / numYLabels) / 2;for (var i=0; i<numYLabels; ++i){
RGraph.Text(context,font,text_size,xpos,this.gutterTop + this.halfTextHeight + ((i/10) * (this.grapharea) ),RGraph.number_format(this,((((this.scale[4] - this.min) / numYLabels) * (numYLabels - i)) + this.min).toFixed((this.Get('chart.scale.decimals'))),units_pre,units_post),null,align,bounding,null,bgcolor);}
} else {
alert('[LINE SCALE] The number of Y labels must be 1/3/5/10');}
if(this.Get('chart.ylabels.invert')){
this.context.translate(0, 0 - (this.grapharea * 0.2));}
if(typeof(this.Get('chart.ymin')) == 'number'){
RGraph.Text(context,font,text_size,xpos,this.Get('chart.ylabels.invert') ? this.gutterTop : this.canvas.height - this.gutterBottom,RGraph.number_format(this, this.Get('chart.ymin').toFixed(this.Get('chart.scale.decimals')), units_pre, units_post),'center',align,bounding,null,bgcolor);}
}
if(   this.Get('chart.noxaxis') == true
&& this.Get('chart.ymin') == null
&& this.Get('chart.xaxispos') != 'center'
){
RGraph.Text(context,font,text_size,xpos,this.Get('chart.xaxispos') == 'top' ? this.gutterTop + this.halfTextHeight: (this.canvas.height - this.gutterBottom + this.halfTextHeight),this.Get('chart.units.pre') + '0' + this.Get('chart.units.post'),null, align, bounding, null, bgcolor);}
} else if(this.Get('chart.ylabels') && typeof(this.Get('chart.ylabels.specific')) == 'object'){
var gap = this.grapharea / this.Get('chart.ylabels.specific').length;var halign = this.Get('chart.yaxispos') == 'left' ? 'right' : 'left';var bounding = false;var bgcolor = null;var ymin = this.Get('chart.ymin') != null && this.Get('chart.ymin');if(this.Get('chart.yaxispos') == 'left'){
var x = this.gutterLeft - 5;if(this.Get('chart.ylabels.inside')){
x += 10;halign = 'left';bounding = true;bgcolor = 'rgba(255,255,255,0.5)';}
} else if(this.Get('chart.yaxispos') == 'right'){
var x = this.canvas.width - this.gutterRight + 5;if(this.Get('chart.ylabels.inside')){
x -= 10;halign = 'right';bounding = true;bgcolor = 'rgba(255,255,255,0.5)';}
}
if(this.Get('chart.xaxispos') == 'center'){
for (var i=0; i<this.Get('chart.ylabels.specific').length; ++i){
var y = this.gutterTop + (this.grapharea / ((this.Get('chart.ylabels.specific').length ) * 2) * i);if(ymin && ymin > 0){
var y = ((this.grapharea / 2) / (this.Get('chart.ylabels.specific').length - (ymin ? 1 : 0)) ) * i;y += this.gutterTop;}
RGraph.Text(context, font, text_size,x,y,String(this.Get('chart.ylabels.specific')[i]), 'center', halign, bounding, 0, bgcolor);}
var reversed_labels = RGraph.array_reverse(this.Get('chart.ylabels.specific'));for (var i=0; i<reversed_labels.length; ++i){
var y = (this.grapharea / 2) + this.gutterTop + ((this.grapharea / (reversed_labels.length * 2) ) * (i + 1));if(ymin && ymin > 0){
var y = ((this.grapharea / 2) / (reversed_labels.length - (ymin ? 1 : 0)) ) * i;y += this.gutterTop;y += (this.grapharea / 2);}
RGraph.Text(context, font, text_size,x,y,String(reversed_labels[i]), 'center', halign, bounding, 0, bgcolor);}
} else if(this.Get('chart.xaxispos') == 'top'){
var reversed_labels = RGraph.array_reverse(this.Get('chart.ylabels.specific'));for (var i=0; i<reversed_labels.length; ++i){
var y = ((this.grapharea / (reversed_labels.length - (ymin ? 1 : 0)) ) * (i + (ymin ? 0 : 1)));y = y + this.gutterTop;RGraph.Text(context, font, text_size,x,y,String(reversed_labels[i]), 'center', halign, bounding, 0, bgcolor);}
} else {
for (var i=0; i<this.Get('chart.ylabels.specific').length; ++i){
var y = this.gutterTop + ((this.grapharea / (this.Get('chart.ylabels.specific').length - (ymin ? 1 : 0) )) * i);RGraph.Text(context, font, text_size,x,y,String(this.Get('chart.ylabels.specific')[i]), 'center', halign, bounding, 0, bgcolor);}
}
}
if(this.Get('chart.labels') && this.Get('chart.labels').length > 0){
var yOffset = 5;var bordered = false;var bgcolor = null;var angle = 0;var valign = 'top';var halign = 'center';if(this.Get('chart.xlabels.inside')){
yOffset = -5;bordered = true;bgcolor = this.Get('chart.xlabels.inside.color');valign = 'bottom';}
if(this.Get('chart.xaxispos') == 'top'){
valign = 'bottom';yOffset += 2;}
if(typeof(this.Get('chart.text.angle')) == 'number' && this.Get('chart.text.angle') > 0){
angle = -1 * this.Get('chart.text.angle');valign = 'center';halign = 'right';yOffset = 10;if(this.Get('chart.xaxispos') == 'top'){
yOffset = 10;}
}
this.context.fillStyle = this.Get('chart.text.color');var numLabels = this.Get('chart.labels').length;for (i=0; i<numLabels; ++i){
if(this.Get('chart.labels')[i]){
var labelX = ((this.canvas.width - this.gutterLeft - this.gutterRight - (2 * this.Get('chart.hmargin'))) / (numLabels - 1) ) * i;labelX += this.gutterLeft + this.Get('chart.hmargin');if(this.Get('chart.labels').length != this.data[0].length){
labelX = this.gutterLeft + this.Get('chart.hmargin') + ((this.canvas.width - this.gutterLeft - this.gutterRight - (2 * this.Get('chart.hmargin'))) * (i / (this.Get('chart.labels').length - 1)));}
if(!labelX){
labelX = this.gutterLeft + this.Get('chart.hmargin');}
if(this.Get('chart.xaxispos') == 'top' && this.Get('chart.text.angle') > 0){
halign = 'left';}
RGraph.Text(context,
font,
text_size,
labelX,
(this.Get('chart.xaxispos') == 'top') ? this.gutterTop - yOffset - (this.Get('chart.xlabels.inside') ? -22 : 0) : (this.canvas.height - this.gutterBottom) + yOffset,
String(this.Get('chart.labels')[i]),
valign,
halign,
bordered,
angle,
bgcolor);}
}
}
this.context.stroke();this.context.fill();}
RGraph.Line.prototype.DrawLine = function (lineData, color, fill, linewidth, tickmarks, index)
{
if(this.Get('chart.animation.unfold.y') && this.Get('chart.animation.factor') != 1){
for (var i=0; i<lineData.length; ++i){
lineData[i] *= this.Get('chart.animation.factor');}
}
var penUp = false;var yPos = null;var xPos = 0;this.context.lineWidth = 1;var lineCoords = [];if(index > 0){
var prevLineCoords = this.coords2[index - 1];}
var xInterval = (this.canvas.width - (2 * this.Get('chart.hmargin')) - this.gutterLeft - this.gutterRight) / (lineData.length - 1);for (i=0; i<lineData.length; i++){
var data_point = lineData[i];yPos = this.canvas.height - (((data_point - (data_point > 0 ?  this.Get('chart.ymin') : (-1 * this.Get('chart.ymin')))) / (this.max - this.min) ) * this.grapharea);yPos = (this.grapharea / (this.max - this.min)) * (data_point - this.min);yPos = this.canvas.height - yPos;if(data_point == this.max){
yPos = Math.round(yPos);}
if(this.Get('chart.ylabels.invert')){
yPos -= this.gutterBottom;yPos -= this.gutterTop;yPos = this.canvas.height - yPos;}
if(this.Get('chart.xaxispos') == 'center'){
yPos = (yPos - this.gutterBottom - this.gutterTop) / 2;yPos = yPos + this.gutterTop;} else if(this.Get('chart.xaxispos') == 'top'){
yPos = (this.grapharea / (this.max - this.min)) * (Math.abs(data_point) - this.min);yPos += this.gutterTop;if(this.Get('chart.ylabels.invert')){
yPos -= this.gutterTop;yPos = this.grapharea - yPos;yPos += this.gutterTop;}
} else if(this.Get('chart.xaxispos') == 'bottom'){
yPos -= this.gutterBottom;}
if(   lineData[i] == null
|| (this.Get('chart.xaxispos') == 'bottom' && lineData[i] < this.min && !this.Get('chart.outofbounds'))
||  (this.Get('chart.xaxispos') == 'center' && lineData[i] < (-1 * this.max) && !this.Get('chart.outofbounds'))){
yPos = null;}
this.context.lineCap = 'round';this.context.lineJoin = 'round';if(i > 0){
xPos = xPos + xInterval;} else {
xPos = this.Get('chart.hmargin') + this.gutterLeft;}
if(this.Get('chart.animation.unfold.x')){
xPos *= this.Get('chart.animation.factor');if(xPos < this.Get('chart.gutter.left')){
xPos = this.Get('chart.gutter.left');}
}
this.coords.push([xPos, yPos]);lineCoords.push([xPos, yPos]);}
this.context.stroke();this.coords2[index] = lineCoords;if(RGraph.isOld() && this.Get('chart.shadow')){
this.DrawIEShadow(lineCoords, this.context.shadowColor);}
this.context.beginPath();this.context.strokeStyle = 'rgba(0,0,0,0)';if(fill){
this.context.fillStyle = fill;}
var isStepped = this.Get('chart.stepped');var isFilled = this.Get('chart.filled');if(this.Get('chart.xaxispos') == 'top'){
var xAxisPos = this.gutterTop;} else if(this.Get('chart.xaxispos') == 'center'){
var xAxisPos = this.gutterTop + (this.grapharea / 2);} else if(this.Get('chart.xaxispos') == 'bottom'){
var xAxisPos = this.canvas.height - this.gutterBottom;}
for (var i=0; i<lineCoords.length; ++i){
xPos = lineCoords[i][0];yPos = lineCoords[i][1];var set = index;var prevY = (lineCoords[i - 1] ? lineCoords[i - 1][1] : null);var isLast = (i + 1) == lineCoords.length;if(prevY < this.gutterTop || prevY > (this.canvas.height - this.gutterBottom) ){
penUp = true;}
if(i == 0 || penUp || !yPos || !prevY || prevY < this.gutterTop){
if(this.Get('chart.filled') && !this.Get('chart.filled.range')){
this.context.moveTo(xPos + 1, xAxisPos);if(this.Get('chart.xaxispos') == 'top'){
this.context.moveTo(xPos + 1, xAxisPos);}
this.context.lineTo(xPos, yPos);} else {
if(RGraph.isOld() && yPos == null){
} else {
this.context.moveTo(xPos + 1, yPos);}
}
if(yPos == null){
penUp = true;} else {
penUp = false;}
} else {
if(isStepped){
this.context.lineTo(xPos, lineCoords[i - 1][1]);}
if((yPos >= this.gutterTop && yPos <= (this.canvas.height - this.gutterBottom)) || this.Get('chart.outofbounds') ){
if(isLast && this.Get('chart.filled') && !this.Get('chart.filled.range') && this.Get('chart.yaxispos') == 'right'){
xPos -= 1;}
if(!isStepped || !isLast){
this.context.lineTo(xPos, yPos);if(isFilled && lineCoords[i+1] && lineCoords[i+1][1] == null){
this.context.lineTo(xPos, xAxisPos);}
} else if(isStepped && isLast){
this.context.lineTo(xPos,yPos);}
penUp = false;} else {
penUp = true;}
}
}
if(this.Get('chart.filled') && !this.Get('chart.filled.range')){
var fillStyle = this.Get('chart.fillstyle');if(index > 0 && this.Get('chart.filled.accumulative')){
this.context.lineTo(xPos, prevLineCoords ? prevLineCoords[i - 1][1] : (this.canvas.height - this.gutterBottom - 1 + (this.Get('chart.xaxispos') == 'center' ? (this.canvas.height - this.gutterTop - this.gutterBottom) / 2 : 0)));for (var k=(i - 1); k>=0; --k){
this.context.lineTo(k == 0 ? prevLineCoords[k][0] + 1: prevLineCoords[k][0], prevLineCoords[k][1]);}
} else {
if(this.Get('chart.xaxispos') == 'top'){
this.context.lineTo(xPos, this.Get('chart.gutter.top') +  1);this.context.lineTo(lineCoords[0][0],this.Get('chart.gutter.top') + 1);} else if(typeof(lineCoords[i - 1][1]) == 'number'){
var yPosition = this.Get('chart.xaxispos') == 'center' ? ((this.canvas.height - this.gutterTop - this.gutterBottom) / 2) + this.gutterTop : this.canvas.height - this.gutterBottom;this.context.lineTo(xPos,yPosition);this.context.lineTo(lineCoords[0][0],yPosition);}
}
this.context.fillStyle = fill;this.context.fill();this.context.beginPath();}
if(navigator.userAgent.match(/Chrome/) && this.Get('chart.shadow') && this.Get('chart.chromefix') && this.Get('chart.shadow.blur') > 0){
for (var i=lineCoords.length - 1; i>=0; --i){
if(
typeof(lineCoords[i][1]) != 'number'
|| (typeof(lineCoords[i+1]) == 'object' && typeof(lineCoords[i+1][1]) != 'number')
){
this.context.moveTo(lineCoords[i][0],lineCoords[i][1]);} else {
this.context.lineTo(lineCoords[i][0],lineCoords[i][1]);}
}
}
this.context.stroke();if(this.Get('chart.backdrop')){
this.DrawBackdrop(lineCoords, color);}
this.RedrawLine(lineCoords, color, linewidth);this.context.stroke();for (var i=0; i<lineCoords.length; ++i){
i = Number(i);if(isStepped && i == (lineCoords.length - 1)){
this.context.beginPath();}
if(
(
tickmarks != 'endcircle'
&& tickmarks != 'endsquare'
&& tickmarks != 'filledendsquare'
&& tickmarks != 'endtick'
&& tickmarks != 'endtriangle'
&& tickmarks != 'arrow'
&& tickmarks != 'filledarrow'
)
|| (i == 0 && tickmarks != 'arrow' && tickmarks != 'filledarrow')
|| i == (lineCoords.length - 1)
){
var prevX = (i <= 0 ? null : lineCoords[i - 1][0]);var prevY = (i <= 0 ? null : lineCoords[i - 1][1]);this.DrawTick(lineData, lineCoords[i][0], lineCoords[i][1], color, false, prevX, prevY, tickmarks, i);}
}
this.context.beginPath();this.context.arc(this.canvas.width + 50000, this.canvas.height + 50000, 2, 0, 6.38, 1);}
RGraph.Line.prototype.DrawTick = function (lineData, xPos, yPos, color, isShadow, prevX, prevY, tickmarks, index)
{
if((yPos == null || yPos > (this.canvas.height - this.gutterBottom) || yPos < this.gutterTop) && !this.Get('chart.outofbounds') || !this.Get('chart.line.visible')){
return;}
this.context.beginPath();var offset = 0;this.context.lineWidth = this.Get('chart.tickmarks.linewidth') ? this.Get('chart.tickmarks.linewidth') : this.Get('chart.linewidth');this.context.strokeStyle = isShadow ? this.Get('chart.shadow.color') : this.context.strokeStyle;this.context.fillStyle = isShadow ? this.Get('chart.shadow.color') : this.context.strokeStyle;if(   tickmarks == 'circle'
|| tickmarks == 'filledcircle'
|| tickmarks == 'endcircle'){
if(tickmarks == 'circle'|| tickmarks == 'filledcircle' || (tickmarks == 'endcircle') ){
this.context.beginPath();this.context.arc(xPos + offset, yPos + offset, this.Get('chart.ticksize'), 0, 360 / (180 / Math.PI), false);if(tickmarks == 'filledcircle'){
this.context.fillStyle = isShadow ? this.Get('chart.shadow.color') : this.context.strokeStyle;} else {
this.context.fillStyle = isShadow ? this.Get('chart.shadow.color') : 'white';}
this.context.stroke();this.context.fill();}
} else if(tickmarks == 'halftick'){
this.context.beginPath();this.context.moveTo(xPos, yPos);this.context.lineTo(xPos, yPos + this.Get('chart.ticksize'));this.context.stroke();} else if(tickmarks == 'tick'){
this.context.beginPath();this.context.moveTo(xPos, yPos -  this.Get('chart.ticksize'));this.context.lineTo(xPos, yPos + this.Get('chart.ticksize'));this.context.stroke();} else if(tickmarks == 'endtick'){
this.context.beginPath();this.context.moveTo(xPos, yPos -  this.Get('chart.ticksize'));this.context.lineTo(xPos, yPos + this.Get('chart.ticksize'));this.context.stroke();} else if(tickmarks == 'cross'){
this.context.beginPath();this.context.moveTo(xPos - this.Get('chart.ticksize'), yPos - this.Get('chart.ticksize'));this.context.lineTo(xPos + this.Get('chart.ticksize'), yPos + this.Get('chart.ticksize'));this.context.moveTo(xPos + this.Get('chart.ticksize'), yPos - this.Get('chart.ticksize'));this.context.lineTo(xPos - this.Get('chart.ticksize'), yPos + this.Get('chart.ticksize'));this.context.stroke();} else if(tickmarks == 'triangle' || tickmarks == 'filledtriangle' || tickmarks == 'endtriangle'){
this.context.beginPath();if(tickmarks == 'filledtriangle'){
this.context.fillStyle = isShadow ? this.Get('chart.shadow.color') : this.context.strokeStyle;} else {
this.context.fillStyle = 'white';}
this.context.moveTo(xPos - this.Get('chart.ticksize'), yPos + this.Get('chart.ticksize'));this.context.lineTo(xPos, yPos - this.Get('chart.ticksize'));this.context.lineTo(xPos + this.Get('chart.ticksize'), yPos + this.Get('chart.ticksize'));this.context.closePath();this.context.stroke();this.context.fill();} else if(tickmarks == 'borderedcircle' || tickmarks == 'dot'){
this.context.lineWidth = 1;this.context.strokeStyle = this.Get('chart.tickmarks.dot.color');this.context.fillStyle = this.Get('chart.tickmarks.dot.color');this.context.beginPath();this.context.arc(xPos, yPos, this.Get('chart.ticksize'), 0, 360 / (180 / Math.PI), false);this.context.closePath();this.context.fill();this.context.stroke();this.context.beginPath();this.context.fillStyle = color;this.context.strokeStyle = color;this.context.arc(xPos, yPos, this.Get('chart.ticksize') - 2, 0, 360 / (180 / Math.PI), false);this.context.closePath();this.context.fill();this.context.stroke();} else if(   tickmarks == 'square'
|| tickmarks == 'filledsquare'
|| (tickmarks == 'endsquare')
|| (tickmarks == 'filledendsquare') ){
this.context.fillStyle = 'white';this.context.strokeStyle = this.context.strokeStyle;this.context.beginPath();this.context.strokeRect(xPos - this.Get('chart.ticksize'), yPos - this.Get('chart.ticksize'), this.Get('chart.ticksize') * 2, this.Get('chart.ticksize') * 2);if(tickmarks == 'filledsquare' || tickmarks == 'filledendsquare'){
this.context.fillStyle = isShadow ? this.Get('chart.shadow.color') : this.context.strokeStyle;this.context.fillRect(xPos - this.Get('chart.ticksize'), yPos - this.Get('chart.ticksize'), this.Get('chart.ticksize') * 2, this.Get('chart.ticksize') * 2);} else if(tickmarks == 'square' || tickmarks == 'endsquare'){
this.context.fillStyle = isShadow ? this.Get('chart.shadow.color') : 'white';this.context.fillRect((xPos - this.Get('chart.ticksize')) + 1, (yPos - this.Get('chart.ticksize')) + 1, (this.Get('chart.ticksize') * 2) - 2, (this.Get('chart.ticksize') * 2) - 2);}
this.context.stroke();this.context.fill();} else if(tickmarks == 'filledarrow'){
var x = Math.abs(xPos - prevX);var y = Math.abs(yPos - prevY);if(yPos < prevY){
var a = Math.atan(x / y) + 1.57;} else {
var a = Math.atan(y / x) + 3.14;}
this.context.beginPath();this.context.moveTo(xPos, yPos);this.context.arc(xPos, yPos, 7, a - 0.5, a + 0.5, false);this.context.closePath();this.context.stroke();this.context.fill();} else if(tickmarks == 'arrow'){
var x = Math.abs(xPos - prevX);var y = Math.abs(yPos - prevY);var orig_linewidth = this.context.lineWidth;if(yPos < prevY){
var a = Math.atan(x / y) + 1.57;} else {
var a = Math.atan(y / x) + 3.14;}
this.context.beginPath();this.context.moveTo(xPos, yPos);this.context.arc(xPos, yPos, 7, a - 0.5 - (document.all ? 0.1 : 0.01), a - 0.4, false);this.context.moveTo(xPos, yPos);this.context.arc(xPos, yPos, 7, a + 0.5 + (document.all ? 0.1 : 0.01), a + 0.5, true);this.context.stroke();this.context.fill();this.context.lineWidth = orig_linewidth;} else if(typeof(tickmarks) == 'function'){
tickmarks(this, lineData, lineData[index], index, xPos, yPos, color, prevX, prevY);}
}
RGraph.Line.prototype.DrawRange = function ()
{
if(this.Get('chart.filled.range') && this.Get('chart.filled')){
this.context.beginPath();this.context.fillStyle = this.Get('chart.fillstyle');this.context.strokeStyle = this.Get('chart.fillstyle');this.context.lineWidth = 1;var len = (this.coords.length / 2);for (var i=0; i<len; ++i){
if(i == 0){
this.context.moveTo(this.coords[i][0], this.coords[i][1])
} else {
this.context.lineTo(this.coords[i][0], this.coords[i][1])
}
}
for (var i=this.coords.length - 1; i>=len; --i){
this.context.lineTo(this.coords[i][0], this.coords[i][1])
}
this.context.stroke();this.context.fill();}
}
RGraph.Line.prototype.RedrawLine = function (coords, color, linewidth)
{
if(this.Get('chart.noredraw')){
return;}
this.context.strokeStyle = (typeof(color) == 'object' && color ? color[0] : color);this.context.lineWidth = linewidth;if(!this.Get('chart.line.visible')){
this.context.strokeStyle = 'rgba(0,0,0,0)';}
if(this.Get('chart.curvy')){
this.DrawCurvyLine(coords, !this.Get('chart.line.visible') ? 'rgba(0,0,0,0)' : color, linewidth);return;}
this.context.beginPath();var len = coords.length;var width = this.canvas.width
var height = this.canvas.height;var penUp = false;for (var i=0; i<len; ++i){
var xPos = coords[i][0];var yPos = coords[i][1];if(i > 0){
var prevX = coords[i - 1][0];var prevY = coords[i - 1][1];}
if((
(i == 0 && coords[i])
|| (yPos < this.gutterTop)
|| (prevY < this.gutterTop)
|| (yPos > (height - this.gutterBottom))
|| (i > 0 && prevX > (width - this.gutterRight))
|| (i > 0 && prevY > (height - this.gutterBottom))
|| prevY == null
|| penUp == true
) && (!this.Get('chart.outofbounds') || yPos == null || prevY == null) ){
if(RGraph.isOld() && yPos == null){
} else {
this.context.moveTo(coords[i][0], coords[i][1]);}
penUp = false;} else {
if(this.Get('chart.stepped') && i > 0){
this.context.lineTo(coords[i][0], coords[i - 1][1]);}
this.context.lineTo(coords[i][0], coords[i][1]);penUp = false;}
}
if(this.Get('chart.colors.alternate') && typeof(color) == 'object' && color[0] && color[1]){
for (var i=1; i<len; ++i){
var prevX = coords[i - 1][0];var prevY = coords[i - 1][1];this.context.beginPath();this.context.strokeStyle = color[coords[i][1] < prevY ? 0 : 1];this.context.lineWidth = this.Get('chart.linewidth');this.context.moveTo(prevX, prevY);this.context.lineTo(coords[i][0], coords[i][1]);this.context.stroke();}
}
}
RGraph.Line.prototype.DrawIEShadow = function (coords, color)
{
var offsetx = this.Get('chart.shadow.offsetx');var offsety = this.Get('chart.shadow.offsety');this.context.lineWidth = this.Get('chart.linewidth');this.context.strokeStyle = color;this.context.beginPath();for (var i=0; i<coords.length; ++i){
if(i == 0){
this.context.moveTo(coords[i][0] + offsetx, coords[i][1] + offsety);} else {
this.context.lineTo(coords[i][0] + offsetx, coords[i][1] + offsety);}
}
this.context.stroke();}
RGraph.Line.prototype.DrawBackdrop = function (coords, color)
{
var size = this.Get('chart.backdrop.size');this.context.lineWidth = size;this.context.globalAlpha = this.Get('chart.backdrop.alpha');this.context.strokeStyle = color;this.context.lineJoin = 'miter';this.context.beginPath();this.context.moveTo(coords[0][0], coords[0][1]);for (var j=1; j<coords.length; ++j){
this.context.lineTo(coords[j][0], coords[j][1]);}
this.context.stroke();this.context.globalAlpha = 1;this.context.lineJoin = 'round';RGraph.NoShadow(this);}
RGraph.Line.prototype.GetLineWidth = function (i)
{
var linewidth = this.Get('chart.linewidth');if(typeof(linewidth) == 'number'){
return linewidth;} else if(typeof(linewidth) == 'object'){
if(linewidth[i]){
return linewidth[i];} else {
return linewidth[0];}
alert('[LINE] Error! chart.linewidth should be a single number or an array of one or more numbers');}
}
RGraph.Line.prototype.getPoint = function (e)
{
var canvas = e.target;var obj = this;var context = obj.context;var mouseXY = RGraph.getMouseXY(e);var mouseX = mouseXY[0];var mouseY = mouseXY[1];if(arguments[1]){
obj = arguments[1];}
for (var i=0; i<obj.coords.length; ++i){
var x = obj.coords[i][0];var y = obj.coords[i][1];if(   obj.Get('chart.tooltips.hotspot.xonly') == false
&& mouseX <= (x + 5)
&& mouseX >= (x - 5)
&& mouseY <= (y + 5)
&& mouseY >= (y - 5)
){
return {0:obj, 1:x, 2:y, 3:i, 'object': obj, 'x': x, 'y': y, 'index': i};} else if(    obj.Get('chart.tooltips.hotspot.xonly') == true
&& mouseX <= (x + 5)
&& mouseX >= (x - 5)){
return {0:obj, 1:x, 2:y, 3:i, 'object': obj, 'x': x, 'y': y, 'index': i};}
}
}
RGraph.Line.prototype.DrawAboveLabels = function ()
{
var context = this.context;var size = this.Get('chart.labels.above.size');var font = this.Get('chart.text.font');var units_pre = this.Get('chart.units.pre');var units_post = this.Get('chart.units.post');context.beginPath();for (var i=0; i<this.coords.length; ++i){
var coords = this.coords[i];RGraph.Text(context, font, size, coords[0], coords[1] - 5 - size, RGraph.number_format(this, this.data_arr[i], units_pre, units_post), 'center', 'center', true, null, 'rgba(255, 255, 255, 0.7)');}
context.fill();}
RGraph.Line.prototype.DrawCurvyLine = function (coords, color, linewidth)
{
var co = this.context;co.beginPath();co.strokeStyle = color;co.lineWidth = linewidth;for (var i=0; i<coords.length; ++i){
var factor = this.Get('chart.curvy.factor');if(coords[i] && typeof(coords[i][1]) == 'number' && coords[i + 1] && typeof(coords[i + 1][1]) == 'number'){
var coordX = coords[i][0];var coordY = coords[i][1];var nextX = coords[i + 1][0];var nextY = coords[i + 1][1];var prevX = coords[i - 1] ? coords[i - 1][0] : null;var prevY = coords[i - 1] ? coords[i - 1][1] : null;var offsetX = (coords[i + 1][0] - coords[i][0]) * factor;var offsetY = (coords[i + 1][1] - coords[i][1]) * factor;if(i == 0){
co.moveTo(coordX, coordY);co.lineTo(nextX - offsetX, nextY - offsetY);} else if(nextY == null){
co.lineTo(coordX, coordY);} else if(prevY == null){
co.moveTo(coordX, coordY);} else if(coordY == null){
co.moveTo(nextX, nextY);} else {
co.quadraticCurveTo(coordX, coordY, coordX + offsetX, coordY + offsetY);if(nextY){
co.lineTo(nextX - offsetX, nextY - offsetY);} else {
co.lineTo(coordX, coordY);}
}
} else if(typeof(coords[i][1]) == 'number'){
co.lineTo(coords[i][0], coords[i][1]);}
}
co.stroke();}
RGraph.Line.prototype.getValue = function (arg)
{
if(arg.length == 2){
var mouseX = arg[0];var mouseY = arg[1];} else {
var mouseCoords = RGraph.getMouseXY(arg);var mouseX = mouseCoords[0];var mouseY = mouseCoords[1];}
var obj = this;if(   mouseY < obj.Get('chart.gutter.top')
|| mouseY > (obj.canvas.height - obj.Get('chart.gutter.bottom'))
|| mouseX < obj.Get('chart.gutter.left')
|| mouseX > (obj.canvas.width - obj.Get('chart.gutter.right'))
){
return null;}
if(this.Get('chart.xaxispos') == 'center'){
var value = (( (obj.grapharea / 2) - (mouseY - obj.Get('chart.gutter.top'))) / obj.grapharea) * (obj.max - obj.min);value *= 2;return value;} else if(this.Get('chart.xaxispos') == 'top'){
var value = ((obj.grapharea - (mouseY - obj.Get('chart.gutter.top'))) / obj.grapharea) * (obj.max - obj.min);value = Math.abs(obj.max - value) * -1;return value;} else {
var value = ((obj.grapharea - (mouseY - obj.Get('chart.gutter.top'))) / obj.grapharea) * (obj.max - obj.min)
value += obj.min;return value;}
}
RGraph.Line.prototype.Highlight = function (shape)
{
if(this.Get('chart.tooltips.highlight')){
RGraph.Highlight.Point(this, shape);}
}
// THIS FILE HAS BEEN MINIFIED

if(typeof(RGraph) == 'undefined') RGraph = {};RGraph.Pie = function (id, data)
{
this.id = id;this.canvas = document.getElementById(id);this.context = this.canvas.getContext("2d");this.canvas.__object__ = this;this.total = 0;this.subTotal = 0;this.angles = [];this.data = data;this.properties = [];this.type = 'pie';this.isRGraph = true;this.uid = RGraph.CreateUID();RGraph.OldBrowserCompat(this.context);this.properties = {
'chart.colors':                 ['red', '#ddd', '#0f0', 'blue', 'pink', 'yellow', 'black', 'cyan'],
'chart.strokestyle':            '#999',
'chart.linewidth':              1,
'chart.labels':                 [],
'chart.labels.sticks':          false,
'chart.labels.sticks.length':   7,
'chart.labels.sticks.color':    '#aaa',
'chart.segments':               [],
'chart.gutter.left':            25,
'chart.gutter.right':           25,
'chart.gutter.top':             25,
'chart.gutter.bottom':          25,
'chart.title':                  '',
'chart.title.background':       null,
'chart.title.hpos':             null,
'chart.title.vpos':             0.5,
'chart.title.bold':             true,
'chart.title.font':             null,
'chart.shadow':                 false,
'chart.shadow.color':           'rgba(0,0,0,0.5)',
'chart.shadow.offsetx':         3,
'chart.shadow.offsety':         3,
'chart.shadow.blur':            3,
'chart.text.size':              10,
'chart.text.color':             'black',
'chart.text.font':              'Arial',
'chart.contextmenu':            null,
'chart.tooltips':               null,
'chart.tooltips.event':         'onclick',
'chart.tooltips.effect':        'fade',
'chart.tooltips.css.class':     'RGraph_tooltip',
'chart.tooltips.highlight':     true,
'chart.highlight.style':        'explode',
'chart.highlight.style.2d.fill': 'rgba(255,255,255,0.7)',
'chart.highlight.style.2d.stroke': 'rgba(255,255,255,0.7)',
'chart.centerx':                null,
'chart.centery':                null,
'chart.radius':                 null,
'chart.border':                 false,
'chart.border.color':           'rgba(255,255,255,0.5)',
'chart.key':                    null,
'chart.key.background':         'white',
'chart.key.position':           'graph',
'chart.key.halign':             'right',
'chart.key.shadow':             false,
'chart.key.shadow.color':       '#666',
'chart.key.shadow.blur':        3,
'chart.key.shadow.offsetx':     2,
'chart.key.shadow.offsety':     2,
'chart.key.position.gutter.boxed': true,
'chart.key.position.x':         null,
'chart.key.position.y':         null,
'chart.key.color.shape':        'square',
'chart.key.rounded':            true,
'chart.key.linewidth':          1,
'chart.key.colors':             null,
'chart.annotatable':            false,
'chart.annotate.color':         'black',
'chart.align':                  'center',
'chart.zoom.factor':            1.5,
'chart.zoom.fade.in':           true,
'chart.zoom.fade.out':          true,
'chart.zoom.hdir':              'right',
'chart.zoom.vdir':              'down',
'chart.zoom.frames':            25,
'chart.zoom.delay':             16.666,
'chart.zoom.shadow':            true,
'chart.zoom.mode':              'canvas',
'chart.zoom.thumbnail.width':   75,
'chart.zoom.thumbnail.height':  75,
'chart.zoom.thumbnail.fixed':   false,
'chart.zoom.background':        true,
'chart.zoom.action':            'zoom',
'chart.resizable':              false,
'chart.resize.handle.adjust':   [0,0],
'chart.resize.handle.background': null,
'chart.variant':                'pie',
'chart.variant.donut.color':    'white',
'chart.exploded':               [],
'chart.effect.roundrobin.multiplier': 1,
'chart.events.click':             null,
'chart.events.mousemove':         null
}
for (var i=0,len=data.length; i<len; i++){
this.total += data[i];}
this.getShape = this.getSegment;RGraph.Register(this);}
RGraph.Pie.prototype.Set = function (name, value)
{
if(name == 'chart.highlight.style.2d.color'){
name = 'chart.highlight.style.2d.fill';}
this.properties[name] = value;}
RGraph.Pie.prototype.Get = function (name)
{
if(name == 'chart.highlight.style.2d.color'){
name = 'chart.highlight.style.2d.fill';}
return this.properties[name];}
RGraph.Pie.prototype.Draw = function ()
{
RGraph.FireCustomEvent(this, 'onbeforedraw');this.gutterLeft = this.Get('chart.gutter.left');this.gutterRight = this.Get('chart.gutter.right');this.gutterTop = this.Get('chart.gutter.top');this.gutterBottom = this.Get('chart.gutter.bottom');this.radius = this.Get('chart.radius') ? this.Get('chart.radius') : this.getRadius();this.centery = ((this.canvas.height - this.gutterTop - this.gutterBottom) / 2) + this.gutterTop;this.subTotal = 0;this.angles = [];if(typeof(this.Get('chart.centery')) == 'number'){
this.centery = this.Get('chart.centery');}
if(this.Get('chart.align') == 'left'){
this.centerx = this.radius + this.gutterLeft;} else if(this.Get('chart.align') == 'right'){
this.centerx = this.canvas.width - this.radius - this.gutterRight;} else {
this.centerx = this.canvas.width / 2;}
if(typeof(this.Get('chart.centerx')) == 'number'){
this.centerx = this.Get('chart.centerx');}
RGraph.DrawTitle(this.canvas,
this.Get('chart.title'),
(this.canvas.height / 2) - this.radius - 5,
this.centerx,
this.Get('chart.title.size') ? this.Get('chart.title.size') : this.Get('chart.text.size') + 2);if(this.Get('chart.shadow') && 0){
var offsetx = document.all ? this.Get('chart.shadow.offsetx') : 0;var offsety = document.all ? this.Get('chart.shadow.offsety') : 0;this.context.beginPath();this.context.fillStyle = this.Get('chart.shadow.color');this.context.shadowColor = this.Get('chart.shadow.color');this.context.shadowBlur = this.Get('chart.shadow.blur');this.context.shadowOffsetX = this.Get('chart.shadow.offsetx');this.context.shadowOffsetY = this.Get('chart.shadow.offsety');this.context.arc(this.centerx + offsetx, this.centery + offsety, this.radius, 0, 6.28, 0);this.context.fill();RGraph.NoShadow(this);}
this.total = RGraph.array_sum(this.data);for (var i=0,len=this.data.length; i<len; i++){
var angle = ((this.data[i] / this.total) * (Math.PI * 2));this.DrawSegment(angle,this.Get('chart.colors')[i],i == (this.data.length - 1), i);}
RGraph.NoShadow(this);this.DrawBorders();for (var i=0; i<this.angles.length; i++){
this.context.beginPath();this.context.strokeStyle = typeof(this.Get('chart.strokestyle')) == 'object' ? this.Get('chart.strokestyle')[i] : this.Get('chart.strokestyle');this.context.fillStyle = this.Get('chart.colors')[i];this.context.arc(this.angles[i][2],
this.angles[i][3],
this.radius,
(this.angles[i][0]),
(this.angles[i][1]),
false);if(this.Get('chart.variant') == 'donut'){
this.context.arc(this.angles[i][2],
this.angles[i][3],
this.radius / 2,
(this.angles[i][1]),
(this.angles[i][0]),
true);} else {
this.context.lineTo(this.angles[i][2], this.angles[i][3]);}
this.context.closePath();this.context.stroke();this.context.fill();}
if(this.Get('chart.labels.sticks')){
this.DrawSticks();var strokeStyle = this.Get('chart.strokestyle');var isWhite = strokeStyle == 'white' || strokeStyle == '#fff' || strokeStyle == '#fffffff' || strokeStyle == 'rgb(255,255,255)' || strokeStyle == 'rgba(255,255,255,0)';if(!isWhite || (isWhite && this.Get('chart.shadow'))){
this.DrawBorders();}
}
this.DrawLabels();if(this.Get('chart.contextmenu')){
RGraph.ShowContext(this);}
RGraph.InstallUserClickListener(this, this.Get('chart.events.click'));RGraph.InstallUserMousemoveListener(this, this.Get('chart.events.mousemove'));RGraph.AllowTooltips(this);if(this.Get('chart.border')){
this.context.beginPath();this.context.lineWidth = 5;this.context.strokeStyle = this.Get('chart.border.color');this.context.arc(this.centerx,
this.centery,
this.radius - 2,
0,
6.28,
0);this.context.stroke();}
if(this.Get('chart.key') != null){
RGraph.DrawKey(this, this.Get('chart.key'), this.Get('chart.colors'));}
RGraph.NoShadow(this);if(this.Get('chart.annotatable')){
RGraph.Annotate(this);}
if(this.Get('chart.zoom.mode') == 'thumbnail' || this.Get('chart.zoom.mode') == 'area'){
RGraph.ShowZoomWindow(this);}
if(this.Get('chart.resizable')){
RGraph.AllowResizing(this);}
RGraph.FireCustomEvent(this, 'ondraw');}
RGraph.Pie.prototype.DrawSegment = function (radians, color, last, index)
{
var context = this.context;var canvas = this.canvas;var subTotal = this.subTotal;radians = radians * this.Get('chart.effect.roundrobin.multiplier');context.beginPath();context.fillStyle = color;context.strokeStyle = this.Get('chart.strokestyle');context.lineWidth = 0;if(this.Get('chart.shadow')){
RGraph.SetShadow(this, this.Get('chart.shadow.color'),this.Get('chart.shadow.offsetx'), this.Get('chart.shadow.offsety'), this.Get('chart.shadow.blur'));}
if( (typeof(this.Get('chart.exploded')) == 'object' && this.Get('chart.exploded')[index] > 0) || typeof(this.Get('chart.exploded')) == 'number'){
var explosion = typeof(this.Get('chart.exploded')) == 'number' ? this.Get('chart.exploded') : this.Get('chart.exploded')[index];var x = 0;var y = 0;var h = explosion;var t = (subTotal + (radians / 2)) - 1.57;var x = (Math.cos(t) * explosion);var y = (Math.sin(t) * explosion);this.context.moveTo(this.centerx + x, this.centery + y);} else {
var x = 0;var y = 0;}
var startAngle = (subTotal) - 1.57;var endAngle = (((subTotal + radians))) - 1.57;context.arc(this.centerx + x,
this.centery + y,
this.radius,
startAngle,
endAngle,
0);if(this.Get('chart.variant') == 'donut'){
context.arc(this.centerx + x,
this.centery + y,
(this.radius / 2),
endAngle,
startAngle,
true);} else {
context.lineTo(this.centerx + x, this.centery + y);}
this.context.closePath();this.angles.push([subTotal - (Math.PI / 2), subTotal + radians - (Math.PI / 2), this.centerx + x, this.centery + y]);this.context.fill();this.Get('chart.segments').push([subTotal, subTotal + radians]);this.subTotal += radians;}
RGraph.Pie.prototype.DrawLabels = function ()
{
var hAlignment = 'left';var vAlignment = 'center';var labels = this.Get('chart.labels');var context = this.context;RGraph.NoShadow(this);context.fillStyle = 'black';context.beginPath();if(labels && labels.length){
var text_size = this.Get('chart.text.size');for (i=0; i<labels.length; ++i){
if(typeof(this.angles) == 'undefined'){
continue;}
context.moveTo(this.centerx,this.centery);var a = this.angles[i][0] + ((this.angles[i][1] - this.angles[i][0]) / 2);if(a < 1.57){
hAlignment = 'left';vAlignment = 'center';} else if(a < 3.14){
hAlignment = 'right';vAlignment = 'center';} else if(a < 4.71){
hAlignment = 'right';vAlignment = 'center';} else if(a < 6.28){
hAlignment = 'left';vAlignment = 'center';}
var angle = ((this.angles[i][1] - this.angles[i][0]) / 2) + this.angles[i][0];if(typeof(this.Get('chart.exploded')) == 'object' && this.Get('chart.exploded')[i] || typeof(this.Get('chart.exploded')) == 'number'){
var t = ((this.angles[i][1] - this.angles[i][0]) / 2);var seperation = typeof(this.Get('chart.exploded')) == 'number' ? this.Get('chart.exploded') : this.Get('chart.exploded')[i];var explosion_offsetx = (Math.cos(angle) * seperation);var explosion_offsety = (Math.sin(angle) * seperation);} else {
var explosion_offsetx = 0;var explosion_offsety = 0;}
if(this.Get('chart.labels.sticks')){
explosion_offsetx += (Math.cos(angle) * this.Get('chart.labels.sticks.length'));explosion_offsety += (Math.sin(angle) * this.Get('chart.labels.sticks.length'));}
context.fillStyle = this.Get('chart.text.color');RGraph.Text(context,
this.Get('chart.text.font'),
text_size,
this.centerx + explosion_offsetx + ((this.radius + 10)* Math.cos(a)) + (this.Get('chart.labels.sticks') ? (a < 1.57 || a > 4.71 ? 2 : -2) : 0),
this.centery + explosion_offsety + (((this.radius + 10) * Math.sin(a))),
labels[i],
vAlignment,
hAlignment);}
context.fill();}
}
RGraph.Pie.prototype.DrawSticks = function ()
{
var context = this.context;var offset = this.Get('chart.linewidth') / 2;var exploded = this.Get('chart.exploded');var sticks = this.Get('chart.labels.sticks');for (var i=0; i<this.angles.length; ++i){
if(typeof(sticks) == 'object' && !sticks[i]){
continue;}
var radians = this.angles[i][1] - this.angles[i][0];context.beginPath();context.strokeStyle = this.Get('chart.labels.sticks.color');context.lineWidth = 1;var midpoint = (this.angles[i][0] + (radians / 2));if(typeof(exploded) == 'object' && exploded[i]){
var extra = exploded[i];} else if(typeof(exploded) == 'number'){
var extra = exploded;} else {
var extra = 0;}
context.lineJoin = 'round';context.lineWidth = 1;context.arc(this.centerx,
this.centery,
this.radius + this.Get('chart.labels.sticks.length') + extra,
midpoint,
midpoint + 0.001,
0);context.arc(this.centerx,
this.centery,
this.radius + extra,
midpoint,
midpoint + 0.001,
0);context.stroke();}
}
RGraph.Pie.prototype.getSegment = function (e)
{
RGraph.FixEventObject(e);var accuracy = arguments[1] ? arguments[1] : 0;var canvas = this.canvas;var context = this.context;var mouseCoords = RGraph.getMouseXY(e);var r = this.radius;var angles = this.angles;var ret = [];for (var i=0; i<angles.length; ++i){
var x = mouseCoords[0] - angles[i][2];var y = mouseCoords[1] - angles[i][3];var theta = Math.atan(y / x);var hyp = y / Math.sin(theta);var hyp = (hyp < 0) ? hyp + accuracy : hyp - accuracy;if(x < 0 && y >= 0){
theta += Math.PI;} else if(x < 0 && y < 0){
theta += Math.PI;}
if(theta > (2 * Math.PI)){
theta -= (2 * Math.PI);}
if(theta >= angles[i][0] && theta < angles[i][1]){
hyp = Math.abs(hyp);if(!hyp || (this.radius && hyp > this.radius) ){
return null;}
if(this.type == 'pie' && this.Get('chart.variant') == 'donut' && (hyp > this.radius || hyp < (this.radius / 2) ) ){
return null;}
ret[0] = angles[i][2];ret[1] = angles[i][3];ret[2] = this.radius;ret[3] = angles[i][0] - (2 * Math.PI);ret[4] = angles[i][1];ret[5] = i;if(ret[3] < 0) ret[3] += (2 * Math.PI);if(ret[4] > (2 * Math.PI)) ret[4] -= (2 * Math.PI);ret[3] = ret[3];ret[4] = ret[4];ret['object'] = this;ret['x'] = ret[0];ret['y'] = ret[1];ret['radius'] = ret[2];ret['angle.start'] = ret[3];ret['angle.end'] = ret[4];ret['index'] = ret[5];return ret;}
}
return null;}
RGraph.Pie.prototype.DrawBorders = function ()
{
if(this.Get('chart.linewidth') > 0){
this.context.lineWidth = this.Get('chart.linewidth');this.context.strokeStyle = this.Get('chart.strokestyle');for (var i=0,len=this.angles.length; i<len; ++i){
this.context.beginPath();this.context.arc(this.angles[i][2],
this.angles[i][3],
this.radius,
(this.angles[i][0]),
(this.angles[i][0] + 0.001),
0);this.context.arc(this.angles[i][2],
this.angles[i][3],
this.Get('chart.variant') == 'donut' ? this.radius / 2: this.radius,
this.angles[i][0],
this.angles[i][0],
0);this.context.closePath();this.context.stroke();}
}
}
RGraph.Pie.prototype.getRadius = function ()
{
return Math.min(this.canvas.height - this.Get('chart.gutter.top') - this.Get('chart.gutter.bottom'), this.canvas.width - this.Get('chart.gutter.left') - this.Get('chart.gutter.right')) / 2;}
RGraph.Pie.prototype.Explode = function (index, size)
{
var obj = this;this.Set('chart.exploded', []);this.Get('chart.exploded')[index] = 0;for (var o=0; o<size; ++o){
setTimeout(
function ()
{
obj.Get('chart.exploded')[index] +=1;RGraph.Clear(obj.canvas);RGraph.Redraw()
}, o * (document.all ? 25 : 16.666));}
}
RGraph.Pie.prototype.highlight_segment = function (segment)
{
var context = this.context;context.beginPath();context.strokeStyle = this.Get('chart.highlight.style.2d.stroke');context.fillStyle = this.Get('chart.highlight.style.2d.fill');context.moveTo(segment[0], segment[1]);context.arc(segment[0], segment[1], segment[2], this.angles[segment[5]][0], this.angles[segment[5]][1], 0);context.lineTo(segment[0], segment[1]);context.closePath();context.stroke();context.fill();}
RGraph.Pie.prototype.Highlight = function (shape)
{
if(this.Get('chart.highlight.style') == 'explode'){
this.Explode(shape['index'], 25);var obj = this;setTimeout(function (){obj.Set('chart.exploded', []);}, document.all ? 1000 : 500);} else if(this.Get('chart.highlight.style') == '3d'){
this.context.lineWidth = 1;var extent = 2;this.context.beginPath();RGraph.NoShadow(this);this.context.fillStyle = 'rgba(0,0,0,0)';this.context.arc(shape['x'], shape['y'], shape['radius'], shape['angle.start'], shape['angle.end'], false);this.Get('chart.variant') == 'donut' ? this.context.arc(shape['x'], shape['y'], shape['radius'] / 2, shape['angle.start'], shape['angle.end'], true) : this.context.lineTo(shape['x'], shape['y']);this.context.closePath();this.context.fill();this.context.beginPath();this.context.shadowColor = '#666';this.context.shadowBlur = 3;this.context.shadowOffsetX = 3;this.context.shadowOffsetY = 3;this.context.fillStyle = this.Get('chart.colors')[shape['index']];this.context.strokeStyle = this.Get('chart.strokestyle');this.context.arc(shape['x'] - extent, shape['y'] - extent, shape['radius'], shape['angle.start'], shape['angle.end'], false);this.Get('chart.variant') == 'donut' ? this.context.arc(shape['x'] - extent, shape['y'] - extent, shape['radius'] / 2, shape['angle.start'], shape['angle.end'], true) : this.context.lineTo(shape['x'] - extent, shape['y'] - extent);this.context.closePath();this.context.stroke();this.context.fill();RGraph.NoShadow(this);if(this.Get('chart.border')){
this.context.beginPath();this.context.strokeStyle = obj.Get('chart.border.color');this.context.lineWidth = 5;this.context.arc(shape['x'] - extent, shape['y'] - extent, shape['radius'] - 2, shape['angle.start'], shape['angle.end'], false);this.context.stroke();}
} else {
this.context.beginPath();this.context.strokeStyle = this.Get('chart.highlight.style.2d.stroke');this.context.fillStyle = this.Get('chart.highlight.style.2d.fill');this.context.arc(shape['x'], shape['y'], shape['radius'], shape['angle.start'], shape['angle.end'], false);this.context.lineTo(shape['x'], shape['y']);this.context.closePath();this.context.stroke();this.context.fill();}
}
// THIS FILE HAS BEEN MINIFIED

if(typeof(RGraph) == 'undefined') RGraph = {isRGraph:true,type:'common'};RGraph.Effects = {}
RGraph.Effects.Fade = {}; RGraph.Effects.jQuery = {}
RGraph.Effects.jQuery.HBlinds = {}; RGraph.Effects.jQuery.VBlinds = {}
RGraph.Effects.jQuery.Slide = {}; RGraph.Effects.Pie = {}
RGraph.Effects.Bar = {}; RGraph.Effects.Line = {}
RGraph.Effects.Line.jQuery = {}; RGraph.Effects.Fuel = {}
RGraph.Effects.Rose = {}; RGraph.Effects.Odo = {}
RGraph.Effects.Gauge = {}; RGraph.Effects.Meter = {}
RGraph.Effects.HBar = {}; RGraph.Effects.HProgress = {}
RGraph.Effects.VProgress = {}; RGraph.Effects.Radar = {}
RGraph.Effects.Waterfall = {}; RGraph.Effects.Gantt = {}
RGraph.Effects.Fade.In = function (obj)
{
var canvas = obj.canvas;canvas.style.opacity = 0;RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);for (var i=1; i<=10; ++i){
setTimeout('document.getElementById("' + canvas.id + '").style.opacity = ' + (i * 0.1), i * 50);}
if(typeof(arguments[2]) == 'function'){
setTimeout(arguments[2], 500);}
}
RGraph.Effects.Fade.Out = function (obj)
{
var canvas = obj.canvas;RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);for (var i=10; i>=0; --i){
setTimeout('document.getElementById("' + canvas.id + '").style.opacity = ' + (i * 0.1), (10 - i) * 50);}
if(typeof(arguments[2]) == 'function'){
setTimeout(arguments[2], 500);}
}
RGraph.Effects.jQuery.Expand = function (obj)
{
if(typeof(jQuery) == 'undefined'){
alert('[ERROR] Could not find jQuery object - have you included the jQuery file?');}
var canvas = obj.canvas;if(!canvas.__rgraph_div_placeholder__){
var div = RGraph.Effects.ReplaceCanvasWithDIV(canvas);canvas.__rgraph_div_placeholder__ = div;} else {
div = canvas.__rgraph_div_placeholder__;}
canvas.style.position = 'relative';canvas.style.top = (canvas.height / 2) + 'px';canvas.style.left = (canvas.width / 2) + 'px';canvas.style.width = 0;canvas.style.height = 0;canvas.style.opacity = 0;RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);
$('#' + obj.id).animate({
opacity: 1,
width: parseInt(div.style.width) + 'px',
height: parseInt(div.style.height) + 'px',
left: '-=' + (obj.canvas.width / 2) + 'px',
top: '-=' + (obj.canvas.height / 2) + 'px'
}, 1000);if(typeof(arguments[2]) == 'function'){
setTimeout(arguments[2], 1000);}
}
RGraph.Effects.ReplaceCanvasWithDIV = function (canvas)
{
if(!canvas.replacementDIV){
var div = document.createElement('DIV');div.style.width = canvas.width + 'px';div.style.height = canvas.height + 'px';div.style.cssFloat = canvas.style.cssFloat;div.style.left = canvas.style.left;div.style.top = canvas.style.top;div.style.display = 'inline-block';canvas.parentNode.insertBefore(div, canvas);canvas.parentNode.removeChild(canvas);div.appendChild(canvas);canvas.style.position = 'relative';canvas.style.left = (div.offsetWidth / 2) + 'px';canvas.style.top = (div.offsetHeight / 2) + 'px';canvas.style.cssFloat = '';canvas.replacementDIV = div;} else {
var div = canvas.replacementDIV;}
return div;}
RGraph.Effects.jQuery.Snap = function (obj)
{
var delay = 500;var div = RGraph.Effects.ReplaceCanvasWithDIV(obj.canvas);obj.canvas.style.position = 'absolute';obj.canvas.style.top = 0;obj.canvas.style.left = 0;obj.canvas.style.width = 0;obj.canvas.style.height = 0;obj.canvas.style.opacity = 0;var targetLeft = div.offsetLeft;var targetTop = div.offsetTop;var targetWidth = div.offsetWidth;var targetHeight = div.offsetHeight;RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);
$('#' + obj.id).animate({
opacity: 1,
width: targetWidth + 'px',
height: targetHeight + 'px',
left: targetLeft + 'px',
top: targetTop + 'px'
}, delay);if(typeof(arguments[2]) == 'function'){
setTimeout(arguments[2], delay + 50);}
}
RGraph.Effects.jQuery.Reveal = function (obj)
{
var opts = arguments[1] ? arguments[1] : null;var delay = 1000;var canvas = obj.canvas;var xy = RGraph.getCanvasXY(obj.canvas);obj.canvas.style.visibility = 'hidden';RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);var divs = [
['reveal_left', xy[0], xy[1], obj.canvas.width  / 2, obj.canvas.height],
['reveal_right',(xy[0] + (obj.canvas.width  / 2)),xy[1],(obj.canvas.width  / 2),obj.canvas.height],
['reveal_top',xy[0],xy[1],obj.canvas.width,(obj.canvas.height / 2)],
['reveal_bottom',xy[0],(xy[1] + (obj.canvas.height  / 2)),obj.canvas.width,(obj.canvas.height / 2)]
];for (var i=0; i<divs.length; ++i){
var div = document.createElement('DIV');div.id = divs[i][0];div.style.width =  divs[i][3]+ 'px';div.style.height = divs[i][4] + 'px';div.style.left = divs[i][1] + 'px';div.style.top = divs[i][2] + 'px';div.style.position = 'absolute';div.style.backgroundColor = opts && typeof(opts['color']) == 'string' ? opts['color'] : 'white';document.body.appendChild(div);}
obj.canvas.style.visibility = 'visible';
$('#reveal_left').animate({width: 0}, delay);
$('#reveal_right').animate({left: '+=' + (obj.canvas.width / 2),width: 0}, delay);
$('#reveal_top').animate({height: 0}, delay);
$('#reveal_bottom').animate({top: '+=' + (obj.canvas.height / 2),height: 0}, delay);setTimeout(
function ()
{
document.body.removeChild(document.getElementById("reveal_top"))
document.body.removeChild(document.getElementById("reveal_bottom"))
document.body.removeChild(document.getElementById("reveal_left"))
document.body.removeChild(document.getElementById("reveal_right"))
}
, delay);if(typeof(arguments[2]) == 'function'){
setTimeout(arguments[2], delay);}
}
RGraph.Effects.jQuery.Conceal = function (obj)
{
var opts = arguments[1] ? arguments[1] : null;var delay = 1000;var canvas = obj.canvas;var xy = RGraph.getCanvasXY(obj.canvas);var divs = [
['conceal_left', xy[0], xy[1], 0, obj.canvas.height],
['conceal_right',(xy[0] + obj.canvas.width),xy[1],0,obj.canvas.height],
['conceal_top',xy[0],xy[1],obj.canvas.width,0],
['conceal_bottom',xy[0],(xy[1] + obj.canvas.height),obj.canvas.width,0]
];for (var i=0; i<divs.length; ++i){
var div = document.createElement('DIV');div.id = divs[i][0];div.style.width =  divs[i][3]+ 'px';div.style.height = divs[i][4] + 'px';div.style.left = divs[i][1] + 'px';div.style.top = divs[i][2] + 'px';div.style.position = 'absolute';div.style.backgroundColor = opts && typeof(opts['color']) == 'string' ? opts['color'] : 'white';document.body.appendChild(div);}
$('#conceal_left').animate({width: '+=' + (obj.canvas.width / 2)}, delay);
$('#conceal_right').animate({left: '-=' + (obj.canvas.width / 2),width: (obj.canvas.width / 2)}, delay);
$('#conceal_top').animate({height: '+=' + (obj.canvas.height / 2)}, delay);
$('#conceal_bottom').animate({top: '-=' + (obj.canvas.height / 2),height: (obj.canvas.height / 2)}, delay);setTimeout(
function ()
{
document.body.removeChild(document.getElementById("conceal_top"))
document.body.removeChild(document.getElementById("conceal_bottom"))
document.body.removeChild(document.getElementById("conceal_left"))
document.body.removeChild(document.getElementById("conceal_right"))
}
, delay);setTimeout(function (){RGraph.Clear(obj.canvas);}, delay);if(typeof(arguments[2]) == 'function'){
setTimeout(arguments[2], delay);}
}
RGraph.Effects.jQuery.HBlinds.Open = function (obj)
{
var canvas = obj.canvas;var opts = arguments[1] ? arguments[1] : [];var delay = 1000;var color = opts['color'] ? opts['color'] : 'white';var xy = RGraph.getCanvasXY(canvas);var height = canvas.height / 5;RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);for (var i=0; i<5; ++i){
var div = document.createElement('DIV');div.id = 'blinds_' + i;div.style.width =  canvas.width + 'px';div.style.height = height + 'px';div.style.left = xy[0] + 'px';div.style.top = (xy[1] + (canvas.height * (i / 5))) + 'px';div.style.position = 'absolute';div.style.backgroundColor = color;document.body.appendChild(div);
$('#blinds_' + i).animate({height: 0}, delay);}
setTimeout(function (){document.body.removeChild(document.getElementById('blinds_0'));}, delay);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_1'));}, delay);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_2'));}, delay);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_3'));}, delay);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_4'));}, delay);if(typeof(arguments[2]) == 'function'){
setTimeout(arguments[2], delay);}
}
RGraph.Effects.jQuery.HBlinds.Close = function (obj)
{
var canvas = obj.canvas;var opts = arguments[1] ? arguments[1] : [];var delay = 1000;var color = opts['color'] ? opts['color'] : 'white';var xy = RGraph.getCanvasXY(canvas);var height = canvas.height / 5;for (var i=0; i<5; ++i){
var div = document.createElement('DIV');div.id = 'blinds_' + i;div.style.width =  canvas.width + 'px';div.style.height = 0;div.style.left = xy[0] + 'px';div.style.top = (xy[1] + (canvas.height * (i / 5))) + 'px';div.style.position = 'absolute';div.style.backgroundColor = color;document.body.appendChild(div);
$('#blinds_' + i).animate({height: height + 'px'}, delay);}
setTimeout(function (){RGraph.Clear(obj.canvas);}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_0'));}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_1'));}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_2'));}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_3'));}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_4'));}, delay + 100);if(typeof(arguments[2]) == 'function'){
setTimeout(arguments[2], delay);}
}
RGraph.Effects.jQuery.VBlinds.Open = function (obj)
{
var canvas = obj.canvas;var opts = arguments[1] ? arguments[1] : [];var delay = 1000;var color = opts['color'] ? opts['color'] : 'white';var xy = RGraph.getCanvasXY(canvas);var width = canvas.width / 10;RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);for (var i=0; i<10; ++i){
var div = document.createElement('DIV');div.id = 'blinds_' + i;div.style.width =  width + 'px';div.style.height = canvas.height + 'px';div.style.left = (xy[0] + (canvas.width * (i / 10))) + 'px';div.style.top = (xy[1]) + 'px';div.style.position = 'absolute';div.style.backgroundColor = color;document.body.appendChild(div);
$('#blinds_' + i).animate({width: 0}, delay);}
setTimeout(function (){document.body.removeChild(document.getElementById('blinds_0'));}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_1'));}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_2'));}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_3'));}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_4'));}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_5'));}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_6'));}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_7'));}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_8'));}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_9'));}, delay + 100);if(typeof(arguments[2]) == 'function'){
setTimeout(arguments[2], delay);}
}
RGraph.Effects.jQuery.VBlinds.Close = function (obj)
{
var canvas = obj.canvas;var opts = arguments[1] ? arguments[1] : [];var delay = 1000;var color = opts['color'] ? opts['color'] : 'white';var xy = RGraph.getCanvasXY(canvas);var width = canvas.width / 10;for (var i=0; i<10; ++i){
var div = document.createElement('DIV');div.id = 'blinds_' + i;div.style.width =  0;div.style.height = canvas.height + 'px';div.style.left = (xy[0] + (canvas.width * (i / 10))) + 'px';div.style.top = (xy[1]) + 'px';div.style.position = 'absolute';div.style.backgroundColor = color;document.body.appendChild(div);
$('#blinds_' + i).animate({width: width}, delay);}
setTimeout(function (){RGraph.Clear(obj.canvas, color);}, delay + 100);if(opts['remove']){
setTimeout(function (){document.body.removeChild(document.getElementById('blinds_0'));}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_1'));}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_2'));}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_3'));}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_4'));}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_5'));}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_6'));}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_7'));}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_8'));}, delay + 100);setTimeout(function (){document.body.removeChild(document.getElementById('blinds_9'));}, delay + 100);}
if(typeof(arguments[2]) == 'function'){
setTimeout(arguments[2], delay);}
}
RGraph.Effects.Pie.Grow = function (obj)
{
var canvas = obj.canvas;var opts = arguments[1] ? arguments[1] : [];var color = opts['color'] ? opts['color'] : 'white';var xy = RGraph.getCanvasXY(canvas);canvas.style.visibility = 'hidden';RGraph.RedrawCanvas(canvas);var radius = obj.getRadius();if(typeof(obj.Get('chart.radius')) == 'number'){
radius = obj.Get('chart.radius');}
canvas.style.visibility = 'visible';obj.Set('chart.radius', 0);RGraph.Effects.Animate(obj, {'chart.radius': radius}, arguments[2]);}
RGraph.Effects.Bar.Grow = function (obj)
{
obj.original_data = RGraph.array_clone(obj.data);obj.__animation_frame__ = 0;if(obj.Get('chart.ymax') == null){
var ymax = 0;for (var i=0; i<obj.data.length; ++i){
if(RGraph.is_array(obj.data[i]) && obj.Get('chart.grouping') == 'stacked'){
ymax = Math.max(ymax, Math.abs(RGraph.array_sum(obj.data[i])));} else if(RGraph.is_array(obj.data[i]) && obj.Get('chart.grouping') == 'grouped'){
ymax = Math.max(ymax, Math.abs(RGraph.array_max(obj.data[i])));} else {
ymax = Math.max(ymax, Math.abs(obj.data[i]));}
}
ymax = RGraph.getScale(ymax, obj)[4];obj.Set('chart.ymax', ymax);}
function Grow ()
{
var numFrames = 30;if(!obj.__animation_frame__){
obj.__animation_frame__ = 0;obj.__original_hmargin__ = obj.Get('chart.hmargin');obj.__hmargin__ = ((obj.canvas.width - obj.Get('chart.gutter.left') - obj.Get('chart.gutter.right')) / obj.data.length) / 2;obj.Set('chart.hmargin', obj.__hmargin__);}
for (var j=0; j<obj.original_data.length; ++j){
if(typeof(obj.data[j]) == 'object'){
for (var k=0; k<obj.data[j].length; ++k){
obj.data[j][k] = (obj.__animation_frame__ / numFrames) * obj.original_data[j][k];}
} else {
obj.data[j] = (obj.__animation_frame__ / numFrames) * obj.original_data[j];}
}
obj.Set('chart.hmargin', ((1 - (obj.__animation_frame__ / numFrames)) * (obj.__hmargin__ - obj.__original_hmargin__)) + obj.__original_hmargin__);RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);if(obj.__animation_frame__ < numFrames){
obj.__animation_frame__ += 1;if(location.href.indexOf('?settimeout') > 0){
setTimeout(Grow, 40);} else {
RGraph.Effects.UpdateCanvas(Grow);}
}
}
RGraph.Effects.UpdateCanvas(Grow);}
RGraph.Effects.UpdateCanvas = function (func)
{
if(typeof(window.requestAnimationFrame) == 'function'){
window.requestAnimationFrame(func);} else if(typeof(window.msRequestAnimationFrame) == 'function'){
window.msRequestAnimationFrame(func);} else if(typeof(window.webkitRequestAnimationFrame) == 'function'){
window.webkitRequestAnimationFrame(func);} else if(window.mozRequestAnimationFrame){
window.mozRequestAnimationFrame(func);} else {
setTimeout(func, 1000 / 60);}
}
RGraph.Effects.Fuel.Grow = function (obj)
{
var totalFrames = 30;var currentFrame = 0;var diff = obj.value - obj.currentValue;var increment = diff / totalFrames;var callback = arguments[2] ? arguments[2] : null;function Grow ()
{
if(currentFrame < totalFrames){
obj.value = obj.currentValue + increment;RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);currentFrame++;RGraph.Effects.UpdateCanvas(Grow);} else if(callback){
callback(obj);}
}
RGraph.Effects.UpdateCanvas(Grow);}
RGraph.Effects.Animate = function (obj, map)
{
RGraph.RedrawCanvas(obj.canvas);RGraph.Effects.__total_frames__ = (map && map['frames']) ? map['frames'] : 30;function Animate_Iterator (func)
{
var id = [obj.id +  '_' + obj.type];if(typeof(RGraph.Effects.__current_frame__ ) == 'undefined'){
RGraph.Effects.__current_frame__ = new Array();RGraph.Effects.__original_values__ = new Array();RGraph.Effects.__diffs__ = new Array();RGraph.Effects.__steps__ = new Array();RGraph.Effects.__callback__ = new Array();}
if(!RGraph.Effects.__current_frame__[id]){
RGraph.Effects.__current_frame__[id] = RGraph.Effects.__total_frames__;RGraph.Effects.__original_values__[id] = {};RGraph.Effects.__diffs__[id] = {};RGraph.Effects.__steps__[id] = {};RGraph.Effects.__callback__[id] = func;}
for (var i in map){
if(typeof(map[i]) == 'string' || typeof(map[i]) == 'number'){
if(RGraph.Effects.__current_frame__[id] == RGraph.Effects.__total_frames__){
RGraph.Effects.__original_values__[id][i] = obj.Get(i);RGraph.Effects.__diffs__[id][i] = map[i] - RGraph.Effects.__original_values__[id][i];RGraph.Effects.__steps__[id][i] = RGraph.Effects.__diffs__[id][i] / RGraph.Effects.__total_frames__;}
obj.Set(i, obj.Get(i) + RGraph.Effects.__steps__[id][i]);RGraph.RedrawCanvas(obj.canvas);}
}
if(--RGraph.Effects.__current_frame__[id] > 0){
RGraph.Effects.UpdateCanvas(Animate_Iterator);} else {
if(typeof(RGraph.Effects.__callback__[id]) == 'function'){
(RGraph.Effects.__callback__[id])(obj);}
RGraph.Effects.__current_frame__[id] = null;RGraph.Effects.__original_values__[id] = null;RGraph.Effects.__diffs__[id] = null;RGraph.Effects.__steps__[id] = null;RGraph.Effects.__callback__[id] = null;}
}
Animate_Iterator(arguments[2]);}
RGraph.Effects.jQuery.Slide.In = function (obj)
{
RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);var canvas = obj.canvas;var div = RGraph.Effects.ReplaceCanvasWithDIV(obj.canvas);var delay = 1000;div.style.overflow= 'hidden';var from = typeof(arguments[1]) == 'object' && typeof(arguments[1]['from']) == 'string' ? arguments[1]['from'] : 'left';canvas.style.position = 'relative';if(from == 'left'){
canvas.style.left = (0 - div.offsetWidth) + 'px';canvas.style.top = 0;} else if(from == 'top'){
canvas.style.left = 0;canvas.style.top = (0 - div.offsetHeight) + 'px';} else if(from == 'bottom'){
canvas.style.left = 0;canvas.style.top = div.offsetHeight + 'px';} else {
canvas.style.left = div.offsetWidth + 'px';canvas.style.top = 0;}
$('#' + obj.id).animate({left:0,top:0}, delay);if(typeof(arguments[2]) == 'function'){
setTimeout(arguments[2], delay);}
}
RGraph.Effects.jQuery.Slide.Out = function (obj)
{
var canvas = obj.canvas;var div = RGraph.Effects.ReplaceCanvasWithDIV(obj.canvas);var delay = 1000;div.style.overflow= 'hidden';var to = typeof(arguments[1]) == 'object' && typeof(arguments[1]['to']) == 'string' ? arguments[1]['to'] : 'left';canvas.style.position = 'relative';canvas.style.left = 0;canvas.style.top = 0;if(to == 'left'){
$('#' + obj.id).animate({left: (0 - canvas.width) + 'px'}, delay);} else if(to == 'top'){
$('#' + obj.id).animate({left: 0, top: (0 - div.offsetHeight) + 'px'}, delay);} else if(to == 'bottom'){
$('#' + obj.id).animate({top: (0 + div.offsetHeight) + 'px'}, delay);} else {
$('#' + obj.id).animate({left: (0 + canvas.width) + 'px'}, delay);}
if(typeof(arguments[2]) == 'function'){
setTimeout(arguments[2], delay);}
}
RGraph.Effects.Line.Unfold = function (obj)
{
obj.Set('chart.animation.factor', obj.Get('chart.animation.unfold.initial'));RGraph.Effects.Animate(obj, {'chart.animation.factor': 1}, arguments[2]);}
RGraph.Effects.Rose.Grow = function (obj)
{
var numFrames = 60;var currentFrame = 0;var original_margin = obj.Get('chart.margin');var margin = (360 / obj.data.length) / 2;var callback = arguments[2];obj.Set('chart.margin', margin);obj.Set('chart.animation.grow.factor', 0);function Grow_inner ()
{
if(currentFrame++ < numFrames){
obj.Set('chart.animation.grow.factor', currentFrame / numFrames);obj.Set('chart.margin', (currentFrame / numFrames) * original_margin);RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);RGraph.Effects.UpdateCanvas(Grow_inner);} else {
obj.Set('chart.animation.grow.factor', 1);obj.Set('chart.margin', original_margin);RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);if(typeof(callback) == 'function'){
callback(obj);}
}
}
RGraph.Effects.UpdateCanvas(Grow_inner);}
RGraph.Effects.Line.UnfoldFromCenter = function (obj)
{
var numFrames = 30;var original_opacity = obj.canvas.style.opacity;obj.canvas.style.opacity = 0;obj.Draw();RGraph.RedrawCanvas(obj.canvas);var center_value = obj.scale[4] / 2;obj.Set('chart.ymax', Number(obj.scale[4]));RGraph.Clear(obj.canvas);obj.canvas.style.opacity = original_opacity;var original_data = RGraph.array_clone(obj.original_data);var original_blur = obj.Get('chart.shadow.blur');obj.Set('chart.shadow.blur', 0);var callback = arguments[2];if(!obj.__increments__){
obj.__increments__ = new Array();for (var dataset=0; dataset<original_data.length; ++dataset){
obj.__increments__[dataset] = new Array();for (var i=0; i<original_data[dataset].length; ++i){
obj.__increments__[dataset][i] = (original_data[dataset][i] - center_value) / numFrames;obj.original_data[dataset][i] = center_value;}
}
}
function UnfoldFromCenter ()
{
RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);for (var dataset=0; dataset<original_data.length; ++dataset){
for (var i=0; i<original_data[dataset].length; ++i){
obj.original_data[dataset][i] += obj.__increments__[dataset][i];}
}
if(--numFrames > 0){
RGraph.Effects.UpdateCanvas(UnfoldFromCenter);} else {
obj.original_data = RGraph.array_clone(original_data);obj.__increments__ = null;obj.Set('chart.shadow.blur', original_blur);RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);if(typeof(callback) == 'function'){
callback(obj);}
}
}
UnfoldFromCenter();}
RGraph.Effects.Line.FoldToCenter = function (obj)
{
var totalFrames = 30;var numFrame = totalFrames;RGraph.RedrawCanvas(obj.canvas);var center_value = obj.scale[4] / 2;obj.Set('chart.ymax', Number(obj.scale[4]));RGraph.Clear(obj.canvas);var original_data = RGraph.array_clone(obj.original_data);obj.Set('chart.shadow.blur', 0);var callback = arguments[2];function FoldToCenter ()
{
for (var i=0; i<obj.data.length; ++i){
if(obj.data[i].length){
for (var j=0; j<obj.data[i].length; ++j){
if(obj.original_data[i][j] > center_value){
obj.original_data[i][j] = ((original_data[i][j] - center_value) * (numFrame/totalFrames)) + center_value;} else {
obj.original_data[i][j] = center_value - ((center_value - original_data[i][j]) * (numFrame/totalFrames));}
}
}
}
RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas)
if(numFrame-- > 0){
RGraph.Effects.UpdateCanvas(FoldToCenter);} else if(typeof(callback) == 'function'){
callback(obj);}
}
RGraph.Effects.UpdateCanvas(FoldToCenter);}
RGraph.Effects.Odo.Grow = function (obj)
{
var numFrames = 30;var origValue = Number(obj.currentValue);var newValue = obj.value;var diff = newValue - origValue;var step = (diff / numFrames);var callback = arguments[2];function Grow_inner ()
{
if(obj.currentValue != newValue){
obj.value = Number(obj.currentValue) + step;}
RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);if(numFrames-- > 0){
RGraph.Effects.UpdateCanvas(Grow_inner);} else if(callback){
callback(obj);}
}
RGraph.Effects.UpdateCanvas(Grow_inner);}
RGraph.Effects.Meter.Grow = function (obj)
{
if(!obj.currentValue){
obj.currentValue = obj.min;}
var totalFrames = 60;var numFrame = 0;var diff = obj.value - obj.currentValue;var step = diff / totalFrames
var callback = arguments[2];function Grow_meter_inner ()
{
obj.value = obj.currentValue + step;RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);if(numFrame++ < totalFrames){
RGraph.Effects.UpdateCanvas(Grow_meter_inner);} else if(typeof(callback) == 'function'){
callback(obj);}
}
RGraph.Effects.UpdateCanvas(Grow_meter_inner);}
RGraph.Effects.HBar.Grow = function (obj)
{
obj.original_data = RGraph.array_clone(obj.data);obj.__animation_frame__ = 0;if(obj.Get('chart.xmax') == 0){
var xmax = 0;for (var i=0; i<obj.data.length; ++i){
if(RGraph.is_array(obj.data[i]) && obj.Get('chart.grouping') == 'stacked'){
xmax = Math.max(xmax, RGraph.array_sum(obj.data[i]));} else if(RGraph.is_array(obj.data[i]) && obj.Get('chart.grouping') == 'grouped'){
xmax = Math.max(xmax, RGraph.array_max(obj.data[i]));} else {
xmax = Math.max(xmax, RGraph.array_max(obj.data[i]));}
}
xmax = RGraph.getScale(xmax)[4];obj.Set('chart.xmax', xmax);}
if(obj.Get('chart.shadow.blur') > 0){
var __original_shadow_blur__ = obj.Get('chart.shadow.blur');obj.Set('chart.shadow.blur', 0);}
function Grow ()
{
var numFrames = 30;if(!obj.__animation_frame__){
obj.__animation_frame__ = 0;obj.__original_vmargin__ = obj.Get('chart.vmargin');obj.__vmargin__ = ((obj.canvas.height - obj.Get('chart.gutter.top') - obj.Get('chart.gutter.bottom')) / obj.data.length) / 2;obj.Set('chart.vmargin', obj.__vmargin__);}
for (var j=0; j<obj.original_data.length; ++j){
var easing = Math.pow(Math.sin((obj.__animation_frame__ * (90 / numFrames)) / (180 / Math.PI)), 4);if(typeof(obj.data[j]) == 'object'){
for (var k=0; k<obj.data[j].length; ++k){
obj.data[j][k] = (obj.__animation_frame__ / numFrames) * obj.original_data[j][k] * easing;}
} else {
obj.data[j] = (obj.__animation_frame__ / numFrames) * obj.original_data[j] * easing;}
}
obj.Set('chart.vmargin', ((1 - (obj.__animation_frame__ / numFrames)) * (obj.__vmargin__ - obj.__original_vmargin__)) + obj.__original_vmargin__);RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);if(obj.__animation_frame__ < numFrames){
obj.__animation_frame__ += 1;RGraph.Effects.UpdateCanvas(Grow);} else {
if(typeof(__original_shadow_blur__) == 'number' && __original_shadow_blur__ > 0){
obj.Set('chart.shadow.blur', __original_shadow_blur__);RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);}
}
}
RGraph.Effects.UpdateCanvas(Grow);}
RGraph.Effects.Line.jQuery.Trace = function (obj)
{
RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);var div = document.createElement('DIV');var xy = RGraph.getCanvasXY(obj.canvas);div.id = '__rgraph_trace_animation_' + RGraph.random(0, 4351623) + '__';div.style.left = xy[0] + 'px';div.style.top = xy[1] + 'px';div.style.width = obj.Get('chart.gutter.left');div.style.height = obj.canvas.height + 'px';div.style.position = 'absolute';div.style.overflow = 'hidden';document.body.appendChild(div);var id = '__rgraph_line_reveal_animation_' + RGraph.random(0, 99999999) + '__';var canvas2 = document.createElement('CANVAS');canvas2.width = obj.canvas.width;canvas2.height = obj.canvas.height;canvas2.style.position = 'absolute';canvas2.style.left = 0;canvas2.style.top = 0;canvas2.id = id;div.appendChild(canvas2);var reposition_canvas2 = function (e)
{
var xy = RGraph.getCanvasXY(obj.canvas);div.style.left = xy[0] + 'px';div.style.top = xy[1] + 'px';}
window.addEventListener('resize', reposition_canvas2, false)
var obj2 = new RGraph.Line(id, RGraph.array_clone(obj.original_data));for (i in obj.properties){
if(typeof(i) == 'string'){
obj2.Set(i, obj.properties[i]);}
}
obj2.Set('chart.labels', []);obj2.Set('chart.background.grid', false);obj2.Set('chart.ylabels', false);obj2.Set('chart.noaxes', true);obj2.Set('chart.title', '');obj2.Set('chart.title.xaxis', '');obj2.Set('chart.title.yaxis', '');obj2.Set('chart.filled.accumulative', obj.Get('chart.filled.accumulative'));obj.Set('chart.key', []);obj2.Draw();obj.Set('chart.line.visible', false);obj.Set('chart.colors', ['rgba(0,0,0,0)']);if(obj.Get('chart.filled')){
var original_fillstyle = obj.Get('chart.fillstyle');obj.Set('chart.fillstyle', 'rgba(0,0,0,0)');}
RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);
$('#' + div.id).animate({
width: obj.canvas.width + 'px'
}, arguments[2] ? arguments[2] : 1500, function (){RGraph.Effects.Line.Trace_callback()});RGraph.Effects.Line.Trace_callback = function ()
{
window.removeEventListener('resize', reposition_canvas2, false);div.parentNode.removeChild(div);div.removeChild(canvas2);obj.Set('chart.line.visible', true);obj.Set('chart.filled', RGraph.array_clone(obj2.Get('chart.filled')));obj.Set('chart.fillstyle', original_fillstyle);obj.Set('chart.colors', RGraph.array_clone(obj2.Get('chart.colors')));obj.Set('chart.key', RGraph.array_clone(obj2.Get('chart.key')));RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);}
}
RGraph.Effects.Pie.RoundRobin = function (obj)
{
var callback = arguments[2] ? arguments[2] : null;var opt = arguments[1];var currentFrame = 0;var numFrames = 90;var targetRadius =  typeof(obj.Get('chart.radius')) == 'number' ? obj.Get('chart.radius') : obj.getRadius();function RoundRobin_inner ()
{
obj.Set('chart.effect.roundrobin.multiplier', Math.pow(Math.sin((currentFrame * (90 / numFrames)) / (180 / Math.PI)), 2) * (currentFrame / numFrames) );if(!opt || opt['radius']){
obj.Set('chart.radius', targetRadius * obj.Get('chart.effect.roundrobin.multiplier'));}
RGraph.RedrawCanvas(obj.canvas);if(currentFrame++ < numFrames){
RGraph.Effects.UpdateCanvas(RoundRobin_inner);} else if(callback){
callback(obj);}
}
RGraph.Effects.UpdateCanvas(RoundRobin_inner);}
RGraph.Effects.Pie.Implode = function (obj)
{
var numFrames = 90;var distance = Math.min(obj.canvas.width, obj.canvas.height);function Implode_inner ()
{
obj.Set('chart.exploded', Math.sin(numFrames / 57.3) * distance);RGraph.Clear(obj.canvas)
RGraph.RedrawCanvas(obj.canvas);if(numFrames > 0){
numFrames--;RGraph.Effects.UpdateCanvas(Implode_inner);} else {
obj.Set('chart.exploded', 0);RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);}
}
RGraph.Effects.UpdateCanvas(Implode_inner);}
RGraph.Effects.Gauge.Grow = function (obj)
{
var numFrames = 30;var origValue = Number(obj.currentValue);if(obj.currentValue == null){
obj.currentValue = obj.min;origValue = obj.min;}
var newValue = obj.value;var diff = newValue - origValue;var step = (diff / numFrames);function Grow ()
{
if(obj.currentValue != newValue){
obj.value = Number(obj.currentValue) + step;}
if(obj.value > obj.max){
obj.value = obj.max;}
if(obj.value < obj.min){
obj.value = obj.min;}
RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);if(numFrames-- > 0){
RGraph.Effects.UpdateCanvas(Grow);}
}
RGraph.Effects.UpdateCanvas(Grow);}
RGraph.Effects.Radar.Grow = function (obj)
{
var totalframes = 30;var framenum = totalframes;var data = RGraph.array_clone(obj.data);var callback = arguments[2];obj.original_data = RGraph.array_clone(obj.original_data);function Grow_inner ()
{
for (var i=0; i<data.length; ++i){
if(obj.original_data[i] == null){
obj.original_data[i] = [];}
for (var j=0; j<data[i].length; ++j){
obj.original_data[i][j] = ((totalframes - framenum)/totalframes)  * data[i][j];}
}
RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);if(framenum > 0){
framenum--;RGraph.Effects.UpdateCanvas(Grow_inner);} else if(typeof(callback) == 'function'){
callback(obj);}
}
RGraph.Effects.UpdateCanvas(Grow_inner);}
RGraph.Effects.Waterfall.Grow = function (obj)
{
var totalFrames = 45;var numFrame = 0;var data = RGraph.array_clone(obj.data);var callback = arguments[2];for (var i=0; i<obj.data.length; ++i){
obj.data[i] /= totalFrames;}
if(obj.Get('chart.ymax') == null){
var max = RGraph.getScale(obj.getMax(data))[4]
obj.Set('chart.ymax', max);}
obj.Set('chart.multiplier.x', 0);obj.Set('chart.multiplier.w', 0);function Grow_inner ()
{
for (var i=0; i<obj.data.length; ++i){
obj.data[i] = data[i] * (numFrame/totalFrames);}
var multiplier = Math.pow(Math.sin(((numFrame / totalFrames) * 90) / 57.3), 20);obj.Set('chart.multiplier.x', (numFrame / totalFrames) * multiplier);obj.Set('chart.multiplier.w', (numFrame / totalFrames) * multiplier);RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);if(numFrame++ < totalFrames){
RGraph.Effects.UpdateCanvas(Grow_inner);} else if(typeof(callback) == 'function'){
callback(obj);}
}
RGraph.Effects.UpdateCanvas(Grow_inner)
}
RGraph.Effects.Bar.Wave = function (obj)
{
var callback = arguments[2] ? arguments[2] : null;var max = 0;for (var i=0; i<obj.data.length; ++i){
if(typeof(obj.data[i]) == 'number'){
max = Math.max(max, obj.data[i])
} else {
if(obj.Get('chart.grouping') == 'stacked'){
max = Math.max(max, RGraph.array_sum(obj.data[i]))
} else {
max = Math.max(max, RGraph.array_max(obj.data[i]))
}
}
}
var scale = RGraph.getScale(max);obj.Set('chart.ymax', scale[4]);original_bar_data = RGraph.array_clone(obj.data);
__rgraph_bar_wave_object__ = obj;for (var i=0; i<obj.data.length; ++i){
if(typeof(obj.data[i]) == 'number'){
obj.data[i] = 0;} else {
obj.data[i] = new Array(obj.data[i].length);}
var totalFrames = 25;var delay = 25;setTimeout('RGraph.Effects.Bar.Wave_inner(' + i + ', ' + totalFrames + ', ' + delay + ')', i * 150);}
RGraph.Effects.Bar.Wave_inner = function  (idx, totalFrames, delay)
{
for (var k=0; k<=totalFrames; ++k){
setTimeout('RGraph.Effects.Bar.Wave_inner_iterator(__rgraph_bar_wave_object__, '+idx+', '+(k / totalFrames)+');', delay * k);}
}
setTimeout(callback, (i * 150) + (totalFrames * delay), totalFrames, delay);}
RGraph.Effects.Bar.Wave_inner_iterator = function (obj, idx, factor)
{
if(typeof(obj.data[idx]) == 'number'){
obj.data[idx] = original_bar_data[idx] * factor;} else {
for (var i=0; i<obj.data[idx].length; ++i){
obj.data[idx][i] = factor * original_bar_data[idx][i];}
}
RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);}
RGraph.Effects.HProgress.Grow = function (obj)
{
var canvas = obj.canvas;var context = obj.context;var diff = obj.value - Number(obj.currentValue);var numFrames = 30;var currentFrame = 0
var increment = diff  / numFrames;var callback = arguments[2] ? arguments[2] : null;function Grow_hprogress_inner ()
{
if(currentFrame++ < 30){
obj.value = obj.currentValue + increment;RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);RGraph.Effects.UpdateCanvas(Grow_hprogress_inner);} else if(callback){
callback(obj);}
}
RGraph.Effects.UpdateCanvas(Grow_hprogress_inner);}
RGraph.Effects.VProgress.Grow = function (obj)
{
var canvas = obj.canvas;var context = obj.context;var diff = obj.value - Number(obj.currentValue);var numFrames = 30;var currentFrame = 0
var increment = diff  / numFrames;var callback = arguments[2] ? arguments[2] : null;function Grow_vprogress_inner ()
{
if(currentFrame++ < 30){
obj.value = obj.currentValue + increment;RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);RGraph.Effects.UpdateCanvas(Grow_vprogress_inner);} else if(callback){
callback(obj);}
}
RGraph.Effects.UpdateCanvas(Grow_vprogress_inner);}
        
RGraph.Effects.Pie.Wave = function (obj)
{
var max = RGraph.array_max(obj.data);var scale = RGraph.getScale(max);obj.Set('chart.ymax', scale[4]);original_pie_data = RGraph.array_clone(obj.data);
__rgraph_pie_wave_object__ = obj;for (var i=0; i<obj.data.length; ++i){
obj.data[i] = 0;setTimeout('RGraph.Effects.Pie.Wave_inner(' + i + ')', i * 100);}
RGraph.Effects.Pie.Wave_inner = function  (idx)
{
var totalFrames = 25;for (var k=0; k<=totalFrames; ++k){
setTimeout('RGraph.Effects.Pie.Wave_inner_iterator(__rgraph_pie_wave_object__, '+idx+', '+(k / totalFrames)+');', 20 * k);}
}
}
RGraph.Effects.Pie.Wave_inner_iterator = function (obj, idx, factor)
{
obj.data[idx] = original_pie_data[idx] * factor;RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);}
RGraph.Effects.Bar.Wave2 = function (obj)
{
var callback = arguments[2] ? arguments[2] : null;var max = 0;for (var i=0; i<obj.data.length; ++i){
if(typeof(obj.data[i]) == 'number'){
max = Math.max(max, obj.data[i])
} else {
if(obj.Get('chart.grouping') == 'stacked'){
max = Math.max(max, RGraph.array_sum(obj.data[i]))
} else {
max = Math.max(max, RGraph.array_max(obj.data[i]))
}
}
}
var scale = RGraph.getScale(max);obj.Set('chart.ymax', scale[4]);original_bar_data = RGraph.array_clone(obj.data);
__rgraph_bar_wave_object__ = obj;for (var i=0; i<obj.data.length; ++i){
if(typeof(obj.data[i]) == 'number'){
obj.data[i] = 0;} else {
obj.data[i] = new Array(obj.data[i].length);}
setTimeout('a = new RGraph.Effects.Bar.Wave2.Iterator(__rgraph_bar_wave_object__, ' + i + ', 45); a.Animate();', i * 150);}
}
RGraph.Effects.Bar.Wave2.Iterator = function (obj, idx, frames)
{
this.obj = obj;this.idx = idx;this.frames = frames;this.curFrame = 0;}
RGraph.Effects.Bar.Wave2.Iterator.prototype.Animate = function ()
{
if(typeof(this.obj.data[this.idx]) == 'number'){
this.obj.data[this.idx] = (this.curFrame / this.frames) * original_bar_data[this.idx];} else if(typeof(this.obj.data[this.idx]) == 'object'){
for (var j=0; j<this.obj.data[this.idx].length; ++j){
this.obj.data[this.idx][j] = (this.curFrame / this.frames) * original_bar_data[this.idx][j];}
}
RGraph.RedrawCanvas(this.obj.canvas);if(this.curFrame < this.frames){
this.curFrame += 1;RGraph.Effects.UpdateCanvas(this.Animate.bind(this));}
}
RGraph.Effects.Gantt.Grow = function (obj)
{
var canvas = obj.canvas;var context = obj.context;var numFrames = 30;var currentFrame = 0;var callback = arguments[2] ? arguments[2] : null;var events = obj.Get('chart.events');var original_events = RGraph.array_clone(events);function Grow_gantt_inner ()
{
if(currentFrame <= numFrames){
for (var i=0; i<events.length; ++i){
if(typeof(events[i][0]) == 'object'){
for (var j=0; j<events[i].length; ++j){
events[i][j][1] = (currentFrame / numFrames) * original_events[i][j][1];}
} else {
events[i][1] = (currentFrame / numFrames) * original_events[i][1];}
}
obj.Set('chart.events', events);RGraph.Clear(obj.canvas);RGraph.RedrawCanvas(obj.canvas);currentFrame++;RGraph.Effects.UpdateCanvas(Grow_gantt_inner);} else if(callback){            
callback(obj);}
}
RGraph.Effects.UpdateCanvas(Grow_gantt_inner);}
if(!Function.prototype.bind){  
Function.prototype.bind = function (oThis){  
if(typeof this !== "function"){  
throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");  
}  
var aArgs = Array.prototype.slice.call(arguments, 1),   
fToBind = this,   
fNOP = function (){},  
fBound = function (){  
return fToBind.apply(this instanceof fNOP  
? this  
: oThis || window,  
aArgs.concat(Array.prototype.slice.call(arguments)));  
};  
fNOP.prototype = this.prototype;  
fBound.prototype = new fNOP();  
return fBound;  
};  
}
RGraph.Effects.Rose.Explode = function (obj)
{
var canvas = obj.canvas;var opts = arguments[1] ? arguments[1] : [];var callback = arguments[2] ? arguments[2] : null;var frames = opts['frames'] ? opts['frames'] : 60;obj.Set('chart.exploded', 0);RGraph.Effects.Animate(obj, {'frames': frames, 'chart.exploded': Math.min(canvas.width, canvas.height)}, callback);}
RGraph.Effects.Rose.Implode = function (obj)
{
var canvas = obj.canvas;var opts = arguments[1] ? arguments[1] : [];var callback = arguments[2] ? arguments[2] : null;var frames = opts['frames'] ? opts['frames'] : 60;obj.Set('chart.exploded', Math.min(canvas.width, canvas.height));RGraph.Effects.Animate(obj, {'frames': frames, 'chart.exploded': 0}, callback);}
// THIS FILE HAS BEEN MINIFIED

if(typeof(RGraph) == 'undefined') RGraph = {};RGraph.Gauge = function (id, min, max, value)
{
this.id = id;this.canvas = document.getElementById(id);this.context = this.canvas.getContext ? this.canvas.getContext("2d") : null;this.canvas.__object__ = this;this.type = 'gauge';this.min = min;this.max = max;this.value = value;this.isRGraph = true;this.currentValue = null;this.uid = RGraph.CreateUID();if(this.value > this.max){
this.value = max;}
if(this.value < this.min){
this.value = min;}
RGraph.OldBrowserCompat(this.context);this.properties = {
'chart.gutter.left':   5,
'chart.gutter.right':  5,
'chart.gutter.top':    5,
'chart.gutter.bottom': 5,
'chart.border.width':  10,
'chart.title.top':     '',
'chart.title.top.font':'Arial',
'chart.title.top.size':14,
'chart.title.top.color':'#333',
'chart.title.top.bold':false,
'chart.title.top.pos': null,
'chart.title.bottom':  '',
'chart.title.bottom.font':'Arial',
'chart.title.bottom.size':14,
'chart.title.bottom.color':'#333',
'chart.title.bottom.bold':false,
'chart.title.bottom.pos':null,
'chart.text.align':    'top',
'chart.text.x':         null,
'chart.text.y':         null,
'chart.text.color':     '#666',
'chart.text.size':      10,
'chart.scale.decimals': 0,
'chart.scale.point':    '.',
'chart.scale.thousand': ',',
'chart.units.pre':      '',
'chart.units.post':     '',
'chart.value.text':     false,
'chart.value.text.y.pos': 0.5,
'chart.value.text.units.pre': null,
'chart.value.text.units.post': null,
'chart.red.start':      0.9 * this.max,
'chart.red.color':      '#DC3912',
'chart.yellow.color':   '#FF9900',
'chart.green.end':      0.7 * this.max,
'chart.green.color':    'rgba(0,0,0,0)',
'chart.colors.ranges':  null,
'chart.needle.tail':    false,
'chart.needle.color':    '#D5604D',
'chart.border.outer':   '#ccc',
'chart.border.inner':   '#f1f1f1',
'chart.centerpin.color':        'blue',
'chart.centerpin.radius':       null,
'chart.zoom.mode':              'canvas',
'chart.zoom.thumbnail.width':   75,
'chart.zoom.thumbnail.height':  75,
'chart.zoom.thumbnail.fixed':   false,
'chart.zoom.background':        true,
'chart.zoom.action':            'zoom',
'chart.tickmarks.small':        25,
'chart.tickmarks.medium':       0,
'chart.tickmarks.big':          5,
'chart.labels.count':           5
}
RGraph.Register(this);}
RGraph.Gauge.prototype.Set = function (name, value)
{
if(name == 'chart.title')       name = 'chart.title.top';if(name == 'chart.title.font')  name = 'chart.title.top.font';if(name == 'chart.title.size')  name = 'chart.title.top.size';if(name == 'chart.title.color') name = 'chart.title.top.color';if(name == 'chart.title.bold')  name = 'chart.title.top.bold';this.properties[name] = value;}
RGraph.Gauge.prototype.Get = function (name)
{
return this.properties[name];}
RGraph.Gauge.prototype.Draw = function ()
{
RGraph.FireCustomEvent(this, 'onbeforedraw');this.currentValue = this.value;this.gutterLeft = this.Get('chart.gutter.left');this.gutterRight = this.Get('chart.gutter.right');this.gutterTop = this.Get('chart.gutter.top');this.gutterBottom = this.Get('chart.gutter.bottom');this.centerx = ((this.canvas.width - this.gutterLeft - this.gutterRight) / 2) + this.gutterLeft;this.centery = ((this.canvas.height - this.gutterTop - this.gutterBottom) / 2) + this.gutterTop;this.radius = Math.min(
((this.canvas.width - this.gutterLeft - this.gutterRight) / 2),
((this.canvas.height - this.gutterTop - this.gutterBottom) / 2)
);this.startAngle = ((Math.PI / 2) / 3) + (Math.PI / 2);this.endAngle = (2 * Math.PI) + (Math.PI / 2) - ((Math.PI / 2) / 3);this.centerpinRadius = 0.16 * this.radius;if(typeof(this.Get('chart.centerpin.radius')) == 'number'){
this.centerpinRadius = this.Get('chart.centerpin.radius');}
if(this.Get('chart.contextmenu')){
RGraph.ShowContext(this);}
this.DrawBackGround();this.DrawColorBands();this.DrawSmallTickmarks();this.DrawMediumTickmarks();this.DrawBigTickmarks();this.DrawLabels();this.DrawTopTitle();this.DrawBottomTitle();this.DrawNeedle();this.DrawCenterpin();if(this.Get('chart.annotatable')){
RGraph.Annotate(this);}
if(this.Get('chart.zoom.mode') == 'thumbnail'){
RGraph.ShowZoomWindow(this);}
if(this.Get('chart.zoom.mode') == 'area'){
RGraph.ZoomArea(this);}
if(this.Get('chart.resizable')){
RGraph.AllowResizing(this);}
RGraph.FireCustomEvent(this, 'ondraw');}
RGraph.Gauge.prototype.DrawBackGround = function ()
{
var borderWidth = this.Get('chart.border.width');this.context.beginPath();this.context.fillStyle = 'white';this.context.arc(this.centerx, this.centery, this.radius, 0, 6.28, 0);this.context.fill();this.context.beginPath();this.context.fillStyle = this.Get('chart.border.outer');this.context.arc(this.centerx, this.centery, this.radius, 0, 6.28, 0);this.context.fill();this.context.beginPath();this.context.fillStyle = this.Get('chart.border.inner');this.context.arc(this.centerx, this.centery, this.radius - borderWidth, 0, 6.28, 0);this.context.fill();this.context.beginPath();this.context.fillStyle = 'white';this.context.arc(this.centerx, this.centery, this.radius - borderWidth - 4, 0, 6.28, 0);this.context.fill();this.context.beginPath();this.context.strokeStyle = 'black';this.context.arc(this.centerx, this.centery, this.radius, 0, 6.28, 0);this.context.stroke();}
RGraph.Gauge.prototype.DrawSmallTickmarks = function ()
{
var numTicks = this.Get('chart.tickmarks.small');for (var i=0; i<=numTicks; ++i){
this.context.beginPath();this.context.strokeStyle = 'black';var a = (((this.endAngle - this.startAngle) / numTicks) * i) + this.startAngle;this.context.arc(this.centerx, this.centery, this.radius - this.Get('chart.border.width') - 10, a, a + 0.00001, 0);this.context.arc(this.centerx, this.centery, this.radius - this.Get('chart.border.width') - 10 - 5, a, a + 0.00001, 0);this.context.stroke();}
}
RGraph.Gauge.prototype.DrawMediumTickmarks = function ()
{
if(this.Get('chart.tickmarks.medium')){
var numTicks = this.Get('chart.tickmarks.medium');this.context.lineWidth = 3;this.context.lineCap = 'round';this.context.strokeStyle = 'black';for (var i=0; i<=numTicks; ++i){
this.context.beginPath();var a = (((this.endAngle - this.startAngle) / numTicks) * i) + this.startAngle + (((this.endAngle - this.startAngle) / (2 * numTicks)));if(a > this.startAngle && a< this.endAngle){
this.context.arc(this.centerx, this.centery, this.radius - this.Get('chart.border.width') - 10, a, a + 0.00001, 0);this.context.arc(this.centerx, this.centery, this.radius - this.Get('chart.border.width') - 10 - 6, a, a + 0.00001, 0);}
this.context.stroke();}
}
}
RGraph.Gauge.prototype.DrawBigTickmarks = function ()
{
var numTicks = this.Get('chart.tickmarks.big');this.context.lineWidth = 3;this.context.lineCap = 'round';for (var i=0; i<=numTicks; ++i){
this.context.beginPath();this.context.strokeStyle = 'black';var a = (((this.endAngle - this.startAngle) / numTicks) * i) + this.startAngle;this.context.arc(this.centerx, this.centery, this.radius - this.Get('chart.border.width') - 10, a, a + 0.00001, 0);this.context.arc(this.centerx, this.centery, this.radius - this.Get('chart.border.width') - 10 - 10, a, a + 0.00001, 0);this.context.stroke();}
}
RGraph.Gauge.prototype.DrawCenterpin = function ()
{
var offset = 6;var grad = this.context.createRadialGradient(this.centerx + offset, this.centery - offset, 0, this.centerx + offset, this.centery - offset, 25);grad.addColorStop(0, '#ddf');grad.addColorStop(1, this.Get('chart.centerpin.color'));this.context.beginPath();this.context.fillStyle = grad;this.context.arc(this.centerx, this.centery, this.centerpinRadius, 0, 6.28, 0);this.context.fill();}
RGraph.Gauge.prototype.DrawLabels = function ()
{
this.context.fillStyle = this.Get('chart.text.color');var font = this.Get('chart.text.font');var size = this.Get('chart.text.size');var num = this.Get('chart.labels.count');this.context.beginPath();for (var i=0; i<=num; ++i){
var hyp = (this.radius - 35 - this.Get('chart.border.width'));var a = (this.endAngle - this.startAngle) / num
a = this.startAngle + (i * a);a  -= (Math.PI / 2)
var x = this.centerx - (Math.sin(a) * hyp);var y = this.centery + (Math.cos(a) * hyp);var hAlign = 'center';var vAlign = 'center'
RGraph.Text(this.context,
font,
size,
x,
y,
RGraph.number_format(this, (((this.max - this.min) * (i / num)) + this.min).toFixed(this.Get('chart.scale.decimals')), this.Get('chart.units.pre'), this.Get('chart.units.post')),
vAlign,
hAlign);}
this.context.fill();if(this.Get('chart.value.text')){
var x = this.centerx;var y = this.centery + (this.Get('chart.value.text.y.pos') * this.radius);var units_pre = typeof(this.Get('chart.value.text.units.pre')) == 'string' ? this.Get('chart.value.text.units.pre') : this.Get('chart.units.pre');var units_post = typeof(this.Get('chart.value.text.units.post')) == 'string' ? this.Get('chart.value.text.units.post') : this.Get('chart.units.post');this.context.beginPath();RGraph.Text(this.context,
font,
size + 2,
x,
y,
RGraph.number_format(this, this.value.toFixed(this.Get('chart.scale.decimals')), units_pre, units_post),
'center',
'center',
true,
null,
'white');this.context.fill();}
}
RGraph.Gauge.prototype.DrawTopTitle = function ()
{
var x = this.centerx;var y = this.centery - 25;if(typeof(this.Get('chart.title.top.pos')) == 'number'){
y = this.centery - (this.radius * this.Get('chart.title.top.pos'));}
if(this.Get('chart.title.top')){
this.context.fillStyle = this.Get('chart.title.top.color');this.context.beginPath();RGraph.Text(this.context,
this.Get('chart.title.top.font'),
this.Get('chart.title.top.size'),
x,
y,
String(this.Get('chart.title.top')),
'bottom',
'center',
null,
null,
null,
this.Get('chart.title.top.bold'));this.context.fill();}
}
RGraph.Gauge.prototype.DrawBottomTitle = function ()
{
var x = this.centerx;var y = this.centery + this.centerpinRadius + 10;if(typeof(this.Get('chart.title.bottom.pos')) == 'number'){
y = this.centery + (this.radius * this.Get('chart.title.bottom.pos'));}
if(this.Get('chart.title.bottom')){
this.context.fillStyle = this.Get('chart.title.bottom.color');this.context.beginPath();RGraph.Text(this.context,
this.Get('chart.title.bottom.font'),
this.Get('chart.title.bottom.size'),
x,
y,
String(this.Get('chart.title.bottom')),
'top',
'center',
null,
null,
null,
this.Get('chart.title.bottom.bold'));this.context.fill();}
}
RGraph.Gauge.prototype.DrawNeedle = function ()
{
this.context.lineWidth = 0.5;this.context.strokeStyle = '#983724';this.context.fillStyle = this.Get('chart.needle.color');var angle = (this.endAngle - this.startAngle) * ((this.value - this.min) / (this.max - this.min));angle += this.startAngle;this.context.beginPath();this.context.arc(this.centerx, this.centery, this.radius - 25 - this.Get('chart.border.width'), angle, angle + 0.00001, false);this.context.arc(this.centerx, this.centery, this.centerpinRadius * 0.5, angle + 1.57, angle + 0.00001 + 1.57, false);if(this.Get('chart.needle.tail')){
this.context.arc(this.centerx, this.centery, this.radius * 0.2  , angle + 3.14, angle + 0.00001 + 3.14, false);}
this.context.arc(this.centerx, this.centery, this.centerpinRadius * 0.5, angle - 1.57, angle - 0.00001 - 1.57, false);this.context.stroke();this.context.fill();this.angle = angle;}
RGraph.Gauge.prototype.DrawColorBands = function ()
{
if(RGraph.is_array(this.Get('chart.colors.ranges'))){
var ranges = this.Get('chart.colors.ranges');for (var i=0; i<ranges.length; ++i){
this.context.fillStyle = ranges[i][2];this.context.lineWidth = 0;this.context.beginPath();this.context.arc(this.centerx,
this.centery,
this.radius - 10 - this.Get('chart.border.width'),
(((ranges[i][0] - this.min) / (this.max - this.min)) * (this.endAngle - this.startAngle)) + this.startAngle,
(((ranges[i][1] - this.min) / (this.max - this.min)) * (this.endAngle - this.startAngle)) + this.startAngle,
false);this.context.arc(this.centerx,
this.centery,
this.radius - 20 - this.Get('chart.border.width'),
(((ranges[i][1] - this.min) / (this.max - this.min)) * (this.endAngle - this.startAngle)) + this.startAngle,
(((ranges[i][0] - this.min) / (this.max - this.min)) * (this.endAngle - this.startAngle)) + this.startAngle,
true);this.context.closePath();this.context.fill();}
return;}
this.context.strokeStyle = this.Get('chart.green.color');this.context.fillStyle = this.Get('chart.green.color');var greenStart = this.startAngle;var greenEnd = this.startAngle + (this.endAngle - this.startAngle) * ((this.Get('chart.green.end') - this.min) / (this.max - this.min))
this.context.beginPath();this.context.arc(this.centerx, this.centery, this.radius - 10 - this.Get('chart.border.width'), greenStart, greenEnd, false);this.context.arc(this.centerx, this.centery, this.radius - 20 - this.Get('chart.border.width'), greenEnd, greenStart, true);this.context.fill();this.context.strokeStyle = this.Get('chart.yellow.color');this.context.fillStyle = this.Get('chart.yellow.color');var yellowStart = greenEnd;var yellowEnd = this.startAngle + (this.endAngle - this.startAngle) * ((this.Get('chart.red.start') - this.min) / (this.max - this.min))
this.context.beginPath();this.context.arc(this.centerx, this.centery, this.radius - 10 - this.Get('chart.border.width'), yellowStart, yellowEnd, false);this.context.arc(this.centerx, this.centery, this.radius - 20 - this.Get('chart.border.width'), yellowEnd, yellowStart, true);this.context.fill();this.context.strokeStyle = this.Get('chart.red.color');this.context.fillStyle = this.Get('chart.red.color');var redStart = yellowEnd;var redEnd = this.startAngle + (this.endAngle - this.startAngle) * ((this.max - this.min) / (this.max - this.min))
this.context.beginPath();this.context.arc(this.centerx, this.centery, this.radius - 10 - this.Get('chart.border.width'), redStart, redEnd, false);this.context.arc(this.centerx, this.centery, this.radius - 20 - this.Get('chart.border.width'), redEnd, redStart, true);this.context.fill();}
RGraph.Gauge.prototype.getShape = function (e)
{
}