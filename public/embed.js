/* HomeWaterMath embed auto-height. No network calls, no cookies. */
(function () {
  function apply(frames, data) {
    if (!data || data.type !== 'hwm-embed-height' || !data.tool || typeof data.height !== 'number') return;
    var needle = '/embed/' + data.tool + '/';
    for (var i = 0; i < frames.length; i++) {
      var f = frames[i];
      var src = f.getAttribute('src') || '';
      if (src.indexOf(needle) !== -1) f.style.height = data.height + 'px';
    }
  }
  window.addEventListener('message', function (e) {
    apply(document.getElementsByTagName('iframe'), e.data);
  });
})();
