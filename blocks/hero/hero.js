export default function decorate(block) {
  block.classList.add('hero-carousel');

  const slides = [...block.children].map((row) => {
    const [imgCell, textCell] = row.children;

    // Parse content lines from GDoc
    const [heading = '', description = '', ctaLabel = '', ctaHref = '#'] =
      textCell.textContent.trim().split('\n');

    // Construct the slide
    const slide = document.createElement('div');
    slide.classList.add('hero-slide');
    slide.style.backgroundImage = `url('${imgCell.textContent.trim()}')`;

    // Render semantic layout inside
    slide.innerHTML = `
  <div class="hero-text">
    <h2>${heading}</h2>
    <p>${description}</p>
    <a href="${ctaHref}" class="hero-button">${ctaLabel}</a>
  </div>
`;

    return slide;
  });

  block.innerHTML = '';
  slides.forEach((slide) => block.append(slide));

  if (window.$ && typeof $(block).slick === 'function') {
    $(block).slick({
      dots: true,
      arrows: true,
      infinite: false,
      autoplay: false,
      fade: false,
      cssEase: 'ease',
    });
  }
}
