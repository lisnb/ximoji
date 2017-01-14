/**
* @Author: lisnb
* @Date:   2017-01-13T23:40:10+08:00
* @Email:  lisnb.h@hotmail.com
* @Last modified by:   lisnb
* @Last modified time: 2017-01-14T11:02:43+08:00
*/
$ximoji = {};



// $ximoji.emojiSrc = './emoji.jpg';
// $ximoji.emojiSrc = './raw_emoji/emoij1.jpg';

// $ximoji.emojiRoot = './raw_emoji/'
$ximoji.emojiRoot = './'

$ximoji.emojiSrc = $ximoji.emojiRoot + location.hash.substr(1);

$ximoji.layers = {}

$ximoji.layerKey = 1;

$ximoji.getLayerKey = function() {
  $ximoji.layerKey += 1;
  return $ximoji.layerKey - 1;
}

$ximoji.deleteLayer = function(key) {
  if ($ximoji.layers.hasOwnProperty(key)) {
    $ximoji.layers[key].remove();
    $ximoji.layers[key].destroy();
    delete $ximoji.layers[key]
  }
}

$ximoji.addImageLayer = function(imageSrc) {
  var imageLayer = new Konva.Layer();
  var imageObj = new Image();
  imageObj.onload = function() {
    $ximoji.stage.setWidth(imageObj.width);
    $ximoji.stage.setHeight(imageObj.height);
    var konvaImage = new Konva.Image({
      x: 0,
      y: 0,
      image: imageObj
    })
    imageLayer.add(konvaImage);
    $ximoji.layers[$ximoji.getLayerKey()] = imageLayer;
    $ximoji.stage.add(imageLayer);
  }
  imageObj.src = imageSrc;
}

$ximoji.addTextLayer = function(text, size) {
  var simpleText = new Konva.Text({
    x: 20,
    y: 20,
    text: text,
    fontSize: size,
    fontFamily: 'Calibri',
    fill: 'black',
    draggable: true
  });
  var textLayer = new Konva.Layer();
  textLayer.add(simpleText);
  var key = $ximoji.getLayerKey();
  $ximoji.layers[key] = textLayer;
  $ximoji.stage.add(textLayer);
  return key;
}

$ximoji.saveImage = function(quality, callback) {
  var url = $ximoji.stage.toDataURL({quality: quality});
  callback(url);
  return url;
}

$ximoji.addLayerIndicator = function(key, text) {
  var currentLayer = [
    '<li><span>',
    text,
    '</span><a class="delete-layer" data-layer=',
    key.toString(),
    '>x</a></li>'].join('');
  var layers = document.getElementById('layers');
  layers.innerHTML += currentLayer;
}

function addTextLayer() {
  var text = document.getElementById('text').value;
  if (!text) {
    return;
  }
  var fontSize = Number.parseInt(document.getElementById('font-size').value);
  var key = $ximoji.addTextLayer(text, fontSize);
  $ximoji.addLayerIndicator(key, text);
  return key;
}

function deleteTextLayer(target) {
  console.log(target);
  var key = target.dataset.layer;
  $ximoji.deleteLayer(key);
  target.parentNode.parentNode.removeChild(target.parentNode);
}

window.onload = function() {
  $ximoji.stage = new Konva.Stage({
    container: 'canvas-panel',
    width: 400,
    height: 400
  });

  $ximoji.addImageLayer($ximoji.emojiSrc);

  document.getElementById('add-text-button').addEventListener('click', addTextLayer);
  document.getElementById('download-button').addEventListener('click', function() {
    $ximoji.saveImage(0.1, function(url){
      window.open(url, '_blank');
    })
  });
  document.addEventListener('click',function(e){
    if(e.target && e.target.className == 'delete-layer'){
      deleteTextLayer(e.target);
      e.preventDefault();
    }
  })
}
