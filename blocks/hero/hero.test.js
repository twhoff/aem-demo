import { JSDOM } from 'jsdom';
import assert from 'assert';
import sinon from 'sinon';

// Mock jQuery setup
let slickStub;
let $mock;

// Self-returning stub like jQuery
function createMockJQuery() {
  const fn = function () {
    return fn;
  };
  fn.ready = (cb) => cb();
  fn.slick = slickStub;
  fn.parents = () => ({ addClass: sinon.stub() });
  return fn;
}

describe('hero block', () => {
  let dom;

  beforeEach(async () => {
    // Define HTML with 2 slides worth of table data
    const html = `
      <div class="block">
        <div>
          <div>https://example.com/slide1.jpg</div>
          <div>Slide 1 Title\nSlide 1 Text\nCTA\n/slide-1</div>
        </div>
        <div>
          <div>https://example.com/slide2.jpg</div>
          <div>Slide 2 Title\nSlide 2 Text\nCTA\n/slide-2</div>
        </div>
      </div>`;

    // Set up JSDOM
    dom = new JSDOM(html, { runScripts: 'dangerously' });
    global.window = dom.window;
    global.document = dom.window.document;

    // Create jQuery stub
    slickStub = sinon.stub();
    $mock = createMockJQuery();
    global.$ = $mock;
    global.window.$ = $mock;
  });

  afterEach(() => {
    delete global.window;
    delete global.document;
    delete global.$;
  });

  it('should convert table rows into slick slides', async () => {
    const { default: decorate } = await import('./hero.js');
    const block = document.querySelector('.block');

    decorate(block);

    // Check slides were created
    const slides = block.querySelectorAll('.slick-slide-banner');
    assert.strictEqual(slides.length, 2);
  });

  it('should handle an empty block gracefully', async () => {
    const { default: decorate } = await import('./hero.js');
    const emptyBlock = document.createElement('div');

    assert.doesNotThrow(() => decorate(emptyBlock));
  });
});

describe('hero block carousel initialisation', () => {
  let dom;

  beforeEach(() => {
    // Set up basic block structure
    const html = `
      <div class="hero-wrapper">
        <div class="block">
          <div>
            <div>https://example.com/hero.jpg</div>
            <div>Heading\nText\nCTA\n/#</div>
          </div>
        </div>
      </div>`;

    dom = new JSDOM(html, { url: 'http://localhost' });
    global.window = dom.window;
    global.document = dom.window.document;

    // Setup stubs
    slickStub = sinon.stub();
    $mock = createMockJQuery();
    global.$ = $mock;
    global.window.$ = $mock;
  });

  afterEach(() => {
    delete global.window;
    delete global.document;
    delete global.$;
  });

  it('should call .slick() with expected options', async () => {
    const { default: decorate } = await import('./hero.js');
    const block = document.querySelector('.block');

    decorate(block);

    // .slick should have been called once
    assert(slickStub.calledOnce, 'slick() was not called');

    const expectedOptions = {
      dots: true,
      arrows: false,
      infinite: false,
      autoplay: false,
      fade: false,
      cssEase: 'ease',
    };

    assert.deepStrictEqual(slickStub.firstCall.args[0], expectedOptions);
  });
});
