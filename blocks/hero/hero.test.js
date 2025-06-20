import { JSDOM } from 'jsdom';
import assert from 'assert';
import sinon from 'sinon';

// The jQuery library code is fetched ahead of time
const jqueryUrl = 'https://code.jquery.com/jquery-3.6.0.min.js';
const jqueryCode = await fetch(jqueryUrl).then((res) => res.text());

// jQuery is injected into the DOM and set on globals
function injectJQuery(dom) {
  const jqueryScript = new dom.window.Function(jqueryCode);
  jqueryScript.call(dom.window);
  global.$ = dom.window.$;
}

describe('hero block', () => {
  let dom;

  beforeEach(() => {
    // A sample block HTML structure is created
    const html = `
      <div class="block">
        <div>
          <div>https://example.com/slide1.jpg</div>
          <div><h2>Slide 1 Title</h2><p>Slide 1 Text</p></div>
        </div>
        <div>
          <div>https://example.com/slide2.jpg</div>
          <div><h2>Slide 2 Title</h2><p>Slide 2 Text</p></div>
        </div>
      </div>`;

    // A virtual DOM is created and jQuery is injected
    dom = new JSDOM(html, { runScripts: 'dangerously' });
    global.window = dom.window;
    global.document = dom.window.document;
    injectJQuery(dom);
  });

  afterEach(() => {
    // The globals are cleaned up after each test
    delete global.window;
    delete global.document;
    delete global.$;
  });

  it('should convert table rows into slick slides', async () => {
    const { default: decorate } = await import('./hero.js');
    const block = document.querySelector('.block');

    // The decorate function is executed
    decorate(block);

    // The number of transformed slides is verified
    const slides = block.querySelectorAll('.slick-slide');
    assert.strictEqual(slides.length, 2);
  });

  it('should handle an empty block gracefully', async () => {
    const { default: decorate } = await import('./hero.js');
    const emptyBlock = document.createElement('div');

    // The decorate function is expected to not throw on empty input
    assert.doesNotThrow(() => decorate(emptyBlock));
  });
});

describe('hero block carousel initialisation', () => {
  let dom;
  let $mock;
  let slickStub;

  beforeEach(() => {
    // A block containing one hero item is created
    const html = `
      <div class="block">
        <div>
          <div>https://example.com/hero.jpg</div>
          <div><h2>Heading</h2><p>Text</p><a href="#">CTA</a></div>
        </div>
      </div>`;

    // A new virtual DOM is instantiated
    dom = new JSDOM(html, { url: 'http://localhost' });
    global.window = dom.window;
    global.document = dom.window.document;

    // jQuery and its .slick method are stubbed
    slickStub = sinon.stub();
    $mock = sinon.stub().returns({ slick: slickStub });

    // The stub is assigned to both global and window jQuery references
    Object.defineProperty(global.window, '$', { get: () => $mock });
    global.$ = $mock;
  });

  afterEach(() => {
    // The globals are removed after each test
    delete global.window;
    delete global.document;
    delete global.$;
  });

  it('should call .slick() with expected options', async () => {
    const block = document.querySelector('.block');
    const { default: decorate } = await import('./hero.js');

    // The decorate function is invoked
    decorate(block);

    // The arguments passed to jQuery are inspected
    const actualBlock = $mock.firstCall?.args?.[0];
    assert(
      actualBlock instanceof dom.window.Element,
      '$ was not called with a DOM Element',
    );

    // It is asserted that .slick() was called once
    assert(slickStub.calledOnce, 'slick() was not called');

    // The expected Slick options are verified
    const options = slickStub.firstCall.args[0];
    assert.deepStrictEqual(options, {
      dots: true,
      arrows: true,
      infinite: false,
      autoplay: false,
      fade: false,
      cssEase: 'ease',
    });
  });
});
