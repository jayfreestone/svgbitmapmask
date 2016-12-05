const svgMask = (() => {
  // The 'wrapped' elements
  const wrappedImages = [];
  // The images we will be replacing
  const images = document.querySelectorAll('.img-mask');

  function init() {
    // Setup the SVG wrapper(s) and add the returned
    // reference to wrappedImages
    for (const image of images) {
      wrappedImages.push(setupSVG(image));
    }

    // Setup listeners
    bindUIEvents();
  }

  function bindUIEvents() {
    window.addEventListener('resize', () => {
      // Re-set source as it may have changed
      wrappedImages.forEach(wrappedImage => {
        wrappedImage.setAttr();
      });
    });
  }

  // Setup the SVG element
  function setupSVG(image) {
    // ID, needed for mask
    const id = image.getAttribute('data-id');

    // Set up the new SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svgImage = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    const svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const svgMask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
    const svgMaskImage = document.createElementNS('http://www.w3.org/2000/svg', 'image');

    // The primary image
    const img = image.querySelector('.img-mask__img');

    // Automatically add the element to the DOM
    (function addElement() {
      // Set up the mask
      svgMask.appendChild(svgMaskImage);
      svgDefs.appendChild(svgMask);

      // Setup the SVG
      svg.appendChild(svgDefs);
      svg.appendChild(svgImage);

      // Set appropriate attributes on generated SVG/Image
      svgImage.setAttribute('mask', `url(#${id})`);

      // Set appropriate (unchanging) attributes on the mask
      svgMask.setAttribute('id', id);

      // Set the current sources
      setAttr(image, svg, svgImage, svgMaskImage);

      // Append everything to the wrapper
      image.appendChild(svg);
    }());

    // Sets the source/width/height etc. on the image
    function setAttr() {
      const imgSrc = img.currentSrc;
      const mask = img.getAttribute('data-mask');
      const delimiter = img.getAttribute('data-delimiter');

      // The 'size' of the image, presuming the mask follows the same naming (e.g. --large)
      const maskSize = imgSrc.substring(imgSrc.indexOf('--'), imgSrc.lastIndexOf('.'));
      const maskSplit = mask.split('.');

      // Create the mask source from the file name and the 'size' modifier
      const maskSrc = maskSplit[0] + maskSize + '.' + maskSplit[1];

      const width = img.naturalWidth;
      const height = img.naturalHeight;

      // TODO: A flash on load, because PNG is being loaded after the fact
      // Load PNG first, then show/swap source?

      // Set attributes on SVGImage
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svgImage.setAttribute('width', width);
      svgImage.setAttribute('height', height);
      svgImage.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', imgSrc);

      // Set attributes on SVGMask
      svgMaskImage.setAttribute('width', width);
      svgMaskImage.setAttribute('height', height);
      svgMaskImage.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', maskSrc);
    }

    // Expose later as we'll need to update the attributes
    return {
      setAttr,
    }
  }

  return {
    init,
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  svgMask.init();
});
