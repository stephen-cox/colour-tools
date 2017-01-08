/**
 * Colour palette tools
 */

/* global chroma */

/**
 * ColourElement class
 */
class ColourElement {

  constructor(selector) {
    this._selector = selector;
    this._element = $(selector);
  }

  /**
   * Get the element
   */
  get element() {
    return this._element;
  }
}


/**
 * ColourSlider class
 */
class ColourSlider extends ColourElement {

  constructor(selector, options) {
    super(selector);

    // Set options
    const defaults = {
      min: 0,
      max: 100,
      decimal_places: 0,
      value: null,
      update(colour) { },
    };
    this.options = $.extend({}, defaults, options);

    // Set slider elements
    this._range = $('<div />')
      .attr('class', '.js-slider-range slider__range');
    this.element.append(this._range);
    this._slide = $('<div />')
        .attr('class', '.js-slider-slide slider__slide');
    this._range.append(this._slide);
    this._input = $('<input />')
        .attr('type', 'text')
        .attr('class', '.js-slider-value slider__value');
    this.element.append(this._input);

    // Set the slider value
    if (this.options.value == null) {
      this.value = this.options.min;
    } else {
      this.value = this.options.value;
    }

    // Add events
    this._range.click((e) => {
      const offset = $(this).parent().offset();
      this.value = this.calc_value(e.pageY - offset.top);
    });
    this._input.change(() => {
      this.value = parseInt(this._input.val());
    });

    // Add dragging
    this._slide.udraggable({
      axis: 'y',
      containment: [-6, -8, 70, 471],
      drag: (e, ui) => {
        this.value = this.calc_value(ui.offset.top + (this._slide.outerHeight() / 2));
      },
      start: () => {
        ColourSlider.Dragging = true;
      },
      stop: () => {
        ColourSlider.Dragging = false;
      },
    });
  }

  /**
   * Fire change event
   */
  change() {
    this.element.trigger('slider-change');
  }

  /**
   * Get slider value
   */
  get value() {
    return this._value;
  }

  /**
   * Set slider value and trigger change events
   */
  set value(value) {
    this.set_value(value, true);
  }

  /**
   * Set slider value
   */
  set_value(value, trigger_events = true) {
    let val = value;

    if (typeof value === 'number') {
      if (isNaN(value)) {
        val = this._value;
      } else if (value < this.options.min) {
        val = this.options.min;
      } else if (value > this.options.max) {
        val = this.options.max;
      }

      if (this.value !== val) {
        this._value = val.toFixed(this.options.decimal_places);
        this._input.val(this.value);
        this.set_slide();
        if (trigger_events) {
          this.change();
        }
      }
    } else {
      throw new Error('Colour slider value not a number');
    }
  }

  /**
   * Calculate value
   */
  calc_value(position) {
    const range = this.options.max - this.options.min;
    return this.options.max + this.options.min - (range * position / this._range.height());
  }

  /**
   * Calculate position
   */
  calc_position(value) {
    const range = this.options.max - this.options.min;
    return (this.options.max + this.options.min - value) * this._range.height() / range;
  }

  /**
   * Update the slider
   */
  update(colour) {
    if (typeof this.options.update === 'function') {
      this.options.update.call(this, colour);
    }
  }

  /**
   * Set range colour
   */
  set_range_colour(colour_string) {
    this._range.css('background', colour_string);
  }

  /**
   * Set slide colours
   */
  set_slide_colour(colour_string) {
    this._slide.css('background', colour_string);
  }

  /**
   * Set the slide position
   */
  set_slide() {
    const position = this.calc_position(this.value);
    if (ColourSlider.Dragging) {
      this._slide.css({ top: position - this._slide.outerHeight() / 2 });
    } else {
      this._slide.animate({ top: position - this._slide.outerHeight() / 2 });
    }
  }
}

/**
 * ColourSlider Dragging class variable
 */
ColourSlider.Dragging = false;

/**
 * ColourSwatch class
 */
class ColourSwatch extends ColourElement {

  constructor(selector, colour) {
    super(selector);
    this.chroma = colour;
  }

  /**
   * Fire change event
   */
  change() {
    this.element.trigger('swatch-change');
  }

  /**
   * Return the chroma colour
   */
  get chroma() {
    return this._colour;
  }

  /**
   * Set the chroma colour
   */
  set chroma(colour) {
    this._colour = colour;
    this.element.css('background-color', this.colour);
    this.change();
  }

  /**
   * Return the chroma colour in hex
   */
  get colour() {
    return this._colour.hex();
  }

  /**
   * Set the colour from string
   */
  set colour(colour) {
    this.chroma = chroma(colour);
  }

  /**
   * Return the colour property given by chroma
   */
  get(property) {
    return this._colour.get(property);
  }

  /**
   * Set the swatch colour from RGB channels
   */
  rgb(r, g, b) {
    this.chroma = chroma(r, g, b);
  }

  /**
   * Set the swatch colour from HSL
   */
  hsl(h, s, l) {
    this.chroma = chroma(h, s, l, 'hsl');
  }
}

/**
 * ColourStats class
 */
class ColourStats extends ColourElement {

  constructor(selector) {
    super(selector);
    
    this._hex = $('<input />')
        .attr('type', 'text')
        .attr('class', '.js-colour-stats-hex stats__hex');
    this.element.append(this._hex);
  }
}


/**
 * Main colour palette routine
 */
if ($('#colour-palette-tools').length > 0) {
  $(() => {
    let colour;
    try {
      colour = chroma(window.location.hash);
    } catch (err) {
      colour = chroma('cyan');
    }

    const colour_block = new ColourSwatch('.js-colour-block', colour);
    const hue = new ColourSlider('.js-slider-hue', {
      max: 360,
      decimal_places: 4,
      value: colour.get('hsl.h'),
      update(color) {
        this.set_value(color.get('hsl.h'), false);
        this.set_slide_colour(color.hex());
        const c = chroma(color.hex());
        let gradient = 'linear-gradient(0deg';
        for (let i = 0; i <= 361; i += 1) {
          gradient += ` , ${c.set('hsl.h', i).hex()}`;
        }
        gradient += ')';
        this.set_range_colour(gradient);
      },
    });
    const saturation = new ColourSlider('.js-slider-saturation', {
      value: 100 * colour.get('hsl.s'),
      decimal_places: 4,
      update(color) {
        this.set_value(100 * color.get('hsl.s'), false);
        this.set_slide_colour(color.hex());
        const c = chroma(color.hex());
        this.set_range_colour(`linear-gradient(180deg, ${c.set('hsl.s', 1).hex()}, ${c.set('hsl.s', 0).hex()})`);
      },
    });
    const luminosity = new ColourSlider('.js-slider-luminosity', {
      value: 100 * colour.get('hsl.l'),
      decimal_places: 4,
      update(color) {
        this.set_value(100 * color.get('hsl.l'), false);
        this.set_slide_colour(color.hex());
        const h = color.get('hsl.h');
        const s = 100 * color.get('hsl.s');
        const l = 100 * color.get('hsl.l');
        this.set_range_colour(`linear-gradient(180deg, hsl(${h}, ${s}%, 100%), hsl(${h}, ${s}%, 50%), hsl(${h}, ${s}%, 0%))`);
      },
    });
    const red = new ColourSlider('.js-slider-red', {
      max: 255,
      value: colour.get('rgb.r'),
      update(color) {
        this.set_value(parseInt(color.get('rgb.r')), false);
        this.set_slide_colour(color.hex());
        const c = chroma(color.hex());
        this.set_range_colour(`linear-gradient(180deg, ${c.set('rgb.r', 255).hex()}, ${c.set('rgb.r', 0).hex()})`);
      },
    });
    const green = new ColourSlider('.js-slider-green', {
      max: 255,
      value: colour.get('rgb.g'),
      update(color) {
        this.set_value(parseInt(color.get('rgb.g')), false);
        this.set_slide_colour(color.hex());
        const c = chroma(color.hex());
        this.set_range_colour(`linear-gradient(180deg, ${c.set('rgb.g', 255).hex()}, ${c.set('rgb.g', 0).hex()})`);
      },
    });
    const blue = new ColourSlider('.js-slider-blue', {
      max: 255,
      value: colour.get('rgb.b'),
      update(color) {
        this.set_value(parseInt(color.get('rgb.b')), false);
        this.set_slide_colour(color.hex());
        const c = chroma(color.hex());
        this.set_range_colour(`linear-gradient(180deg, ${c.set('rgb.b', 255).hex()}, ${c.set('rgb.b', 0).hex()})`);
      },
    });
    const stats = new ColourStats('.js-colour-stats');

    // Bind swatch-change event
    colour_block.element.on('swatch-change', () => {
      hue.update(colour_block.chroma);
      saturation.update(colour_block.chroma);
      luminosity.update(colour_block.chroma);
      red.update(colour_block.chroma);
      green.update(colour_block.chroma);
      blue.update(colour_block.chroma);
      stats.value = colour_block.chroma;
    });
    colour_block.change();

    // Bind slider-change events
    hue.element.on('slider-change', () => {
      colour_block.hsl(hue.value, saturation.value / 100, luminosity.value / 100);
    });
    saturation.element.on('slider-change', () => {
      colour_block.hsl(hue.value, saturation.value / 100, luminosity.value / 100);
    });
    luminosity.element.on('slider-change', () => {
      colour_block.hsl(hue.value, saturation.value / 100, luminosity.value / 100);
    });
    red.element.on('slider-change', () => {
      colour_block.rgb(red.value, green.value, blue.value);
    });
    green.element.on('slider-change', () => {
      colour_block.rgb(red.value, green.value, blue.value);
    });
    blue.element.on('slider-change', () => {
      colour_block.rgb(red.value, green.value, blue.value);
    });
  });
}