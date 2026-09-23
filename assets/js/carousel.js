document.addEventListener('DOMContentLoaded', function () {
  if (!window.PROJECT_SLIDES || !window.PROJECT_SLIDES.length) return;

  var slides = window.PROJECT_SLIDES;
  var index = 0;

  var img = document.querySelector('.car-img');
  var tag = document.querySelector('.car-tag');
  var counter = document.querySelector('.car-counter');
  var prevBtn = document.querySelector('.car-prev');
  var nextBtn = document.querySelector('.car-next');
  var frame = document.querySelector('.car-frame');

  if (!img) return;

  function render() {
    var s = slides[index];
    img.src = s.src;
    img.alt = s.alt || '';
    if (tag) tag.textContent = s.tag || '';
    if (counter) counter.textContent = (index + 1) + ' / ' + slides.length;
  }

  function next(e) {
    if (e) e.stopPropagation();
    index = (index + 1) % slides.length;
    render();
  }
  function prev(e) {
    if (e) e.stopPropagation();
    index = (index - 1 + slides.length) % slides.length;
    render();
  }

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // Click the main image to open it fullscreen, browsing the same set of
  // slides with the sitewide lightbox (assets/js/main.js). When the
  // lightbox is closed, the inline carousel jumps to wherever it was left.
  if (frame && window.openLightbox) {
    frame.style.cursor = 'zoom-in';
    frame.addEventListener('click', function () {
      window.openLightbox(slides, index, function (finalIndex) {
        index = finalIndex;
        render();
      });
    });
  }

  render();
});
