document.addEventListener('DOMContentLoaded', function () {
  // Lightbox with next/prev navigation through all visuals in a project
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML =
    '<span class="close">&times;</span>' +
    '<span class="lb-nav lb-prev">&#8249;</span>' +
    '<img src="" alt="">' +
    '<span class="lb-nav lb-next">&#8250;</span>' +
    '<div class="lb-counter"></div>';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector('img');
  var lbCounter = lb.querySelector('.lb-counter');
  var lbPrev = lb.querySelector('.lb-prev');
  var lbNext = lb.querySelector('.lb-next');
  var lbClose = lb.querySelector('.close');

  var groupSlides = [];
  var currentIndex = -1;
  var closeCallback = null;

  // Normalize either <a> elements (old-style thumbnail groups) or plain
  // {src, alt} slide objects (used by the project-page carousel) into a
  // single {src, alt} shape.
  function toSlide(item) {
    if (item && item.tagName === 'A') {
      var img = item.querySelector('img');
      return { src: item.getAttribute('href'), alt: img ? (img.getAttribute('alt') || '') : '' };
    }
    return { src: item.src, alt: item.alt || '' };
  }

  function openAt(items, index, onClose) {
    groupSlides = items.map(toSlide);
    currentIndex = index;
    closeCallback = onClose || null;
    show();
    lb.classList.add('open');
  }

  function show() {
    var s = groupSlides[currentIndex];
    lbImg.src = s.src;
    lbImg.alt = s.alt;
    lbCounter.textContent = groupSlides.length > 1 ? (currentIndex + 1) + ' / ' + groupSlides.length : '';
    var multi = groupSlides.length > 1;
    lbPrev.style.display = multi ? 'flex' : 'none';
    lbNext.style.display = multi ? 'flex' : 'none';
  }

  function next(e) {
    if (e) e.stopPropagation();
    currentIndex = (currentIndex + 1) % groupSlides.length;
    show();
  }
  function prev(e) {
    if (e) e.stopPropagation();
    currentIndex = (currentIndex - 1 + groupSlides.length) % groupSlides.length;
    show();
  }
  function close() {
    lb.classList.remove('open');
    if (closeCallback) closeCallback(currentIndex);
  }

  // Exposed so the project-page carousel (assets/js/carousel.js) can open
  // the same fullscreen viewer on its slides.
  window.openLightbox = openAt;

  // Each project-block is its own browsing group; visuals outside a
  // project-block (if any) are grouped per containing section instead.
  var blocks = document.querySelectorAll('.project-block');
  if (blocks.length) {
    blocks.forEach(function (block) {
      var links = Array.prototype.slice.call(block.querySelectorAll('.project-visuals a'));
      links.forEach(function (a, i) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          openAt(links, i);
        });
      });
    });
  } else {
    var links = Array.prototype.slice.call(document.querySelectorAll('.project-visuals a, .gallery a'));
    links.forEach(function (a, i) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        openAt(links, i);
      });
    });
  }

  lbNext.addEventListener('click', next);
  lbPrev.addEventListener('click', prev);
  lbClose.addEventListener('click', function (e) {
    e.stopPropagation();
    close();
  });
  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target === lbImg) close();
  });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // Mark active nav link
  var path = location.pathname.split('/').pop() || 'index.html';
  var projectPages = ['canopy.html', 'westin.html', 'strang.html', 'kelowna.html', 'sana.html'];
  document.querySelectorAll('nav.site-nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
    if (href === 'portfolio.html' && projectPages.indexOf(path) !== -1) a.classList.add('active');
  });
});
