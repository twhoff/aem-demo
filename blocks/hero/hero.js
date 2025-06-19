export default function decorate(block) {
  block.classList.add('hero-carousel');

  const slides = [...block.children].map((row) => {
    const [imgCell, textCell] = row.children;
    const imageUrl = imgCell.textContent.trim();

    const slide = document.createElement('div');
    slide.classList.add('hero-slide');
    slide.style.backgroundImage = `url('${imageUrl}')`;

    slide.innerHTML = `
      <div class="hero-text">
        ${textCell.innerHTML}
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
