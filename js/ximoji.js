/**
* @Author: lisnb
* @Date:   2017-01-13T23:40:10+08:00
* @Email:  lisnb.h@hotmail.com
* @Last modified by:   lisnb
* @Last modified time: 2017-01-14T00:32:41+08:00
*/
$ximoji = {};



$ximoji.emojiSrc = './emoji.jpg';
// $ximoji.emojiSrc = './raw_emoji/emoij1.jpg';

$ximoji.sizes = {
  'large': 50,
  'midium': 40,
  'small': 30
}

$ximoji.layers = {}

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
    $ximoji.layers[new Date()] = imageLayer;
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
  $ximoji.layers[new Date()] = textLayer;
  $ximoji.stage.add(textLayer);
}

$ximoji.saveImage = function(quality, callback) {
  var url = $ximoji.stage.toDataURL({quality: quality});
  callback(url);
  return url;
}


function addTextLayer() {
  var text = document.getElementById('text').value;
  if (!text) {
    return;
  }
  var fontSize = Number.parseInt(document.getElementById('font-size').value);
  $ximoji.addTextLayer(text, fontSize);
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

}
