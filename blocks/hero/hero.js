export default function decorate(block) {
  block.classList.add('hero-carousel');

  const slides = [...block.children].map((row) => {
    const [imgCell, textCell] = row.children;

    // Parse content lines from GDoc
    const [heading = '', description = '', ctaLabel = '', ctaHref = '#'] =
      textCell.textContent.trim().split('\n');

    // Construct the slide
    const slide = document.createElement('div');
    slide.classList.add('slick-slide-banner');
    slide.style.backgroundImage = `url('${imgCell.textContent.trim()}')`;

    // Hero text
    const heroText = document.createElement('div');
    heroText.classList.add('hero-text');
    // Render semantic layout inside
    heroText.innerHTML = `
    <h2>${heading}</h2>
    <p>${description}</p>
    <p></p>
    <p><a href="${ctaHref}" class="hero-button">${ctaLabel}</a><p>
`;

    slide.appendChild(heroText);

    return slide;
  });

  block.innerHTML = '';
  slides.forEach((slide) => block.appendChild(slide));

  if (window.$ && typeof $(block).slick === 'function') {
    $(document).ready(() => {
      const result = $('.hero-carousel').slick({
        dots: true,
        arrows: false,
        infinite: false,
        autoplay: false,
        fade: false,
        cssEase: 'ease',
      });

      // Add class `slick-root` to div with class `hero-wrapper`
      $(block).parents('.hero-wrapper').addClass('slick-root');

      console.log('Slick carousel initialized:', result);
    });
  } else {
    console.warn(
      'Slick carousel is not available. Please ensure it is included in your project.',
    );
  }
}
