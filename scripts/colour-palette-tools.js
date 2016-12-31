/**
 * ColourElement class
 */
class ColourElement {

  constructor(selector) {
    this._selector = selector;
    this._element = $(selector);
  }

  /**
   * Fire any change events
   */
  change() {
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
    let defaults = {
      min: 0,
      max: 100,
      decimal_places: 0,
      value: null,
      update: function(colour) { }
    };
    this.options = $.extend({}, defaults, options);

    // Set slider elements
    this._range = this.element.find('.js-slider-range');
    this._input = this.element.find('.js-slider-value');
    this._slide = this.element.find('.js-slider-slide');

    // Set the slider value
    if (this.options.value == null) {
      this.value = this.options.min;
    }
    else {
      this.value = this.options.value;
    }

    // Add events
    let slider = this;
    this._range.click(function(e) {
      let offset =  $(this).parent().offset();
      slider.value = slider.calc_value(e.pageY - offset.top);
    });
    this._input.change(function(e) {
      slider.value = parseInt(slider._input.val());
    });

    // Add dragging
    this._slide.udraggable({
      axis: "y",
      containment: [-6, -8, 70, 471],
      drag: function(e, ui) {
        slider.value = slider.calc_value(ui.offset.top + slider._slide.outerHeight() / 2);
      },
      start: function() {
        slider.dragging = true;
      },
      stop: function() {
        slider.dragging = false;
      }
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
  set_value(value, trigger_events=true) {
    if (typeof value == 'number') {
      if (isNaN(value)) {
        value = this._value;
      }
      else if (value < this.options.min) {
        value = this.options.min;
      }
      else if (value > this.options.max) {
        value = this.options.max;
      }

      if (this.value != value) {
        this._value = value.toFixed(this.options.decimal_places);
        this._input.val(this.value);
        this.set_slide();
        if (trigger_events) {
          this.change();
        }
      }
    }
    else {
      throw 'Colour slider value not a number';
    }
  }

  /**
   * Calculate value
   */
  calc_value(position) {
    return this.options.max + this.options.min - (this.options.max - this.options.min) * position / this._range.height();
  }

  /**
   * Calculate position
   */
  calc_position(value) {
    return (this.options.max + this.options.min - value) * this._range.height() / (this.options.max - this.options.min);
  }

  /**
   * Update the slider
   */
  update(colour) {
    if (typeof this.options.update == 'function') {
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
    let position = this.calc_position(this.value);
    if (this.dragging) {
      this._slide.css({'top': position - this._slide.outerHeight() / 2});
    }
    else {
      this._slide.animate({'top': position - this._slide.outerHeight() / 2});
    }
  }

  /**
   * Fire change event
   */
  change() {
    this.element.trigger('slider-change');
  }

  /**
   * Get dragging class variable
   */
  get dragging() {
    return ColourSlider.Dragging;
  }

  /**
   * Set dragging class variable
   */
  set dragging(drag) {
    ColourSlider.Dragging = drag;
  }
}

/**
 * ColourSlider class variable
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
 * Main colour palette routine
 */
if ($('#colour-palette-tools').length > 0) {

  $(function() {

    try {
      var colour = chroma(window.location.hash);
    }
    catch(err) {
      var colour = chroma('cyan');
    }

    var colour_block = new ColourSwatch('.js-colour-block', colour);
    var hue =new ColourSlider('.js-slider-hue', {
      max: 360,
      decimal_places: 4,
      value: colour.get('hsl.h'),
      update: function(colour) {
        this.set_value(colour.get('hsl.h'), false);
        this.set_slide_colour(colour.hex());
        let c = chroma(colour.hex());
        let gradient = 'linear-gradient(0deg';
        for (let i = 0; i <= 361; i++) {
          gradient += ' ,' + c.set('hsl.h', i).hex();
        }
        gradient += ')';
        this.set_range_colour(gradient);
      }
    });
    var saturation = new ColourSlider('.js-slider-saturation', {
      value: 100 * colour.get('hsl.s'),
      decimal_places: 4,
      update: function(colour) {
        this.set_value(100 * colour.get('hsl.s'), false);
        this.set_slide_colour(colour.hex());
        let c = chroma(colour.hex());
        this.set_range_colour('linear-gradient(180deg, '+c.set('hsl.s', 1).hex()+', '+c.set('hsl.s', 0).hex()+')');
      }
    });
    var luminosity = new ColourSlider('.js-slider-luminosity', {
      value: 100 * colour.get('hsl.l'),
      decimal_places: 4,
      update: function(colour) {
        this.set_value(100 * colour.get('hsl.l'), false);
        this.set_slide_colour(colour.hex());
        var h = colour.get('hsl.h');
        var s = 100 * colour.get('hsl.s');
        var l = 100 * colour.get('hsl.l');
        this.set_range_colour('linear-gradient(180deg, hsl('+h+', '+s+'%, 100%), hsl('+h+', '+s+'%, 50%), hsl('+h+', '+s+'%, 0%))');
      }
    });
    var red = new ColourSlider('.js-slider-red', {
      max: 255,
      value: colour.get('rgb.r'),
      update: function(colour) {
        this.set_value(parseInt(colour.get('rgb.r')), false);
        this.set_slide_colour(colour.hex());
        let c = chroma(colour.hex());
        this.set_range_colour('linear-gradient(180deg, '+c.set('rgb.r', 255).hex()+', '+c.set('rgb.r', 0).hex()+')');
      }
    });
    var green = new ColourSlider('.js-slider-green', {
      max: 255,
      value: colour.get('rgb.g'),
      update: function(colour) {
        this.set_value(parseInt(colour.get('rgb.g')), false);
        this.set_slide_colour(colour.hex());
        let c = chroma(colour.hex());
        this.set_range_colour('linear-gradient(180deg, '+c.set('rgb.g', 255).hex()+', '+c.set('rgb.g', 0).hex()+')');
      }
    });
    var blue = new ColourSlider('.js-slider-blue', {
      max: 255,
      value: colour.get('rgb.b'),
      update: function(colour) {
        this.set_value(parseInt(colour.get('rgb.b')), false);
        this.set_slide_colour(colour.hex());
        let c = chroma(colour.hex());
        this.set_range_colour('linear-gradient(180deg, '+c.set('rgb.b', 255).hex()+', '+c.set('rgb.b', 0).hex()+')');
      }
    });
    var hex_text = $('.js-colour-details-hex');
    var hsl_text = $('.js-colour-details-hsl');
    var rgb_text = $('.js-colour-details-rgb');

    // Bind swatch-change event
    colour_block.element.on('swatch-change', function(event) {
      hue.update(colour_block.chroma);
      saturation.update(colour_block.chroma);
      luminosity.update(colour_block.chroma);
      red.update(colour_block.chroma);
      green.update(colour_block.chroma);
      blue.update(colour_block.chroma);
      hex_text.text(colour_block.chroma.hex());
      hsl_text.text(colour_block.chroma.css('hsl'));
      rgb_text.text(colour_block.chroma.css());
    });
    colour_block.change();

    // Bind slider-change events
    hue.element.on('slider-change', function(event) {
      colour_block.hsl(hue.value, saturation.value / 100, luminosity.value / 100);
    });
    saturation.element.on('slider-change', function(event) {
      colour_block.hsl(hue.value, saturation.value / 100, luminosity.value / 100);
    });
    luminosity.element.on('slider-change', function(event) {
      colour_block.hsl(hue.value, saturation.value / 100, luminosity.value / 100);
    });
    red.element.on('slider-change', function(event) {
      colour_block.rgb(red.value, green.value, blue.value);
    });
    green.element.on('slider-change', function(event) {
      colour_block.rgb(red.value, green.value, blue.value);
    });
    blue.element.on('slider-change', function(event) {
      colour_block.rgb(red.value, green.value, blue.value);
    });
  });
}