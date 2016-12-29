/**
 * Main colour palette routine
 */

if ($('#colour-palette-tools').length > 0) {
  $(function() {

    // Initialise
    var colour_block = $('.js-colour-block');
    var hue = $('.js-slider-hue').colour_slider({ max: 360, value: 180 });
    var saturation = $('.js-slider-saturation').colour_slider({ value: 100 });
    var luminosity = $('.js-slider-luminosity').colour_slider({ value: 50 });
    set_colour(hue.val(), saturation.val(), luminosity.val());

    // Bind events
    hue.bind('colour-change', function(event) {
      set_colour(hue.val(), saturation.val(), luminosity.val());
    });
    saturation.bind('colour-change', function(event) {
      set_colour(hue.val(), saturation.val(), luminosity.val());
    });
    luminosity.bind('colour-change', function(event) {
      set_colour(hue.val(), saturation.val(), luminosity.val());
    });

    // Set colour
    function set_colour(h, s, l) {
      colour_block.css('background-color', 'hsl('+h+', '+s+'%, '+l+'%)');
      saturation.find('.js-slider-range').css('background', 'linear-gradient(180deg, hsl('+h+', 100%, 50%), hsl('+h+', 0%, 50%))');
      //luminosity.find('.js-slider-range').css('background', 'linear-gradient(180deg, hsl('+h+', 100%, 100%), hsl('+h+', 100%, 0%))');
    }
  });
}
/**
 * Colour slider widget
 */
(function ( $ ) {

  /**
   * colour_slider plugin definition
   */
  $.fn.colour_slider = function(options) {

    var plugin = this;

    /**
     * Default settings
     */
    plugin.defaults = {
      min: 0,
      max: 100,
      value: null
    };

    /**
     * Initialise variables
     */
    var opts = $.extend({}, plugin.defaults, options);
    var slider = plugin.find('.js-slider-range');
    var input = plugin.find('.js-slider-value');
    var offset = plugin.offset();

    /**
     * Add events
     */
    slider.click(function(e) {
      var position = e.pageY - offset.top;
      var value = opts.max + opts.min - (opts.max - opts.min) * position / slider.height();
      plugin.val(value);
    });
    input.change(function(e) {
      plugin.val(parseInt(input.val()));
    });

    /**
     * Get or set widget value method
     */
    plugin.val = function(value) {
      if (value === undefined) {
        // Get value
        return opts.value;
      }
      else if (typeof value == 'number') {
        // Set value
        if (value < opts.min || value > opts.max) {
          throw 'Colour slider value out of range';
        }
        opts.value = value;
        input.val(Math.round(opts.value));
        plugin.trigger('colour-change');
        return plugin;
      }
      else {
        throw 'Colour slider value not a number';
      }
    };

    /**
     * Initialise plugin
     */
    if (opts.value == null) {
      plugin.val(opts.min);
    }
    else {
      plugin.val(opts.value);
    }

    return plugin;
  };


}( jQuery ));

/**
 * Display W3C Named colours
 */

if ($('#named-colours').length > 0) {
  $(function() {

    var c, colour, row, cell, text, i;
    var table = $('table');
    var properties = [
      'name',
      'hex',
      'rgb.r',
      'rgb.g',
      'rgb.b',
      'temperature',
      'hsl.h',
      'hsl.s',
      'hsl.l',
      'hsv.h',
      'hsv.s',
      'hsv.v',
      'cmyk.c',
      'cmyk.m',
      'cmyk.y',
      'cmyk.k'

    ];

    // Get sort
    var sort = 'name';
    if (window.location.hash) {
      sort = window.location.hash.replace('#', '');
      if (properties.indexOf(sort) == -1) {
        sort = 'name';
      }
    }

    // Initialise and sort colour array
    var colours = [];
    for (c in chroma.colors) {
      colours.push(chroma(c));
    }
    colours.sort(function(a, b) {
      if (a.get(sort) > b.get(sort)) {
        return 1;
      }
      if (a.get(sort) < b.get(sort)) {
        return -1;
      }
      return 0;
    });

    for (c in colours) {
      colour = colours[c];
      row = $('<tr/>').appendTo(table.find('tbody:last'));
      row.addClass('colour-table__row');

      cell = $('<td/>').text(' ');
      cell.addClass('colour-table__colour');
      cell.css('background-color', colour.name());
      row.append(cell);

      for (i in properties) {
        text = colour.get(properties[i]);
        if (typeof text == 'number' && properties[i] != 'temperature') {
          text = text.toPrecision(3);
        }
        cell = $('<td/>').text(text);
        cell.addClass('colour-table__' + properties[i]);
        row.append(cell);
      }
    }
  });
}

