dmleyeEcho_getScript('./js/vendor/BRFv4Demo.js?'+sessionTimeString,function(){
  console.log("BRF4 loaded");
  blinkingModuleLoaded = true;

});

dmleyeEcho_getScript('./js/vendor/libs/createjs/preloadjs.min.js?'+sessionTimeString,function(){
  console.log("preloadjs loaded");
});
