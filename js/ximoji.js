/**
* @Author: lisnb
* @Date:   2017-01-13T23:40:10+08:00
* @Email:  lisnb.h@hotmail.com
* @Last modified by:   lisnb
* @Last modified time: 2017-01-28T14:48:03+08:00
*/
$ximoji = {};



// $ximoji.emojiSrc = './emoji.jpg';
// $ximoji.emojiSrc = './raw_emoji/emoij1.jpg';

$ximoji.emojiRoot = './raw_emoji/'
// $ximoji.emojiRoot = './'
$ximoji.emojiName = location.hash.substr(1);
$ximoji.emojiSrc = $ximoji.emojiRoot + $ximoji.emojiName;

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

function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {

    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth*ratio, height: srcHeight*ratio };
 }

$ximoji.addImageLayer = function(imageSrc) {
  var imageLayer = new Konva.Layer();
  var imageObj = new Image();
  imageObj.onload = function() {
    var rightSize = calculateAspectRatioFit(imageObj.width, imageObj.height, 400, 400);
    console.log(rightSize);
    imageObj.width = rightSize.width;
    imageObj.height = rightSize.height;
    $ximoji.stage.setWidth(rightSize.width);
    $ximoji.stage.setHeight(rightSize.height);
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

$ximoji.addTextLayer = function(text, size, color) {
  var simpleText = new Konva.Text({
    x: 20,
    y: 20,
    text: text,
    fontSize: size,
    fontFamily: 'Calibri',
    fill: color,
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
  var url = $ximoji.stage.toDataURL({quality: quality, mimeType: 'image/jpeg'});
  callback(url);
  return url;
}

$ximoji.addLayerIndicator = function(key, text) {
  var currentLayer = [
    '<li class="delete-layer" data-layer="',
    key.toString(),
    '">',
    text,
    '(点击删除)</li>'].join('');
  var layers = document.getElementById('layers');
  layers.innerHTML += currentLayer;
}

function addTextLayer() {
  var text = document.getElementById('text').value;
  if (!text) {
    return;
  }
  var fontSize = Number.parseInt(document.getElementById('font-size').value);
  var textColor = document.querySelector('input[name="text-color"]:checked').value;
  var key = $ximoji.addTextLayer(text, fontSize, textColor);
  $ximoji.addLayerIndicator(key, text);
  return key;
}

function deleteTextLayer(target) {
  console.log(target);
  var key = target.dataset.layer;
  $ximoji.deleteLayer(key);
  target.parentNode.removeChild(target);
}


function attachEventListener() {
  document.getElementById('add-text-button').addEventListener('click', addTextLayer);
  document.getElementById('text').addEventListener('keyup', function(event) {
    if (event.key == 'Enter') {
      addTextLayer();
    }
  })
  document.getElementById('download-button').addEventListener('click', function() {
    $ximoji.saveImage(0.4, function(url){
      window.open(url, '_blank');
    })
  });
  document.addEventListener('click',function(e){
    console.log('bind click');
    if(e.target && e.target.className == 'delete-layer'){
      deleteTextLayer(e.target);
      e.preventDefault();
    }
  })
  document.addEventListener('touchend',function(e){
    console.log('bind click');
    if(e.target && e.target.className == 'delete-layer'){
      deleteTextLayer(e.target);
      e.preventDefault();
    }
  })
}

function handleImage(e, callback){
    var reader = new FileReader();
    reader.onload = function(event){
        callback(event.target.result);
        return;
    }
    reader.readAsDataURL(e.target.files[0]);
}


function getImageSrc(callback) {
  if (!$ximoji.emojiName || $ximoji.emojiName == 'upload') {
    console.log('getImageSrc');
    var uploadImageField = document.getElementById('uploaded-image-field');
    uploadImageField.classList.remove('hidden');
    var imageInput = document.getElementById('uploaded-image');
    imageInput.addEventListener('change', function(e) {
      handleImage(e, callback);
    }, false);
  } else {
    callback($ximoji.emojiSrc);
  }

}

window.onload = function() {
  console.log('window onload');
  $ximoji.stage = new Konva.Stage({
    container: 'canvas-panel',
    width: 400,
    height: 400
  });

  getImageSrc($ximoji.addImageLayer);
  // $ximoji.addImageLayer($ximoji.emojiSrc);

  attachEventListener();
}
