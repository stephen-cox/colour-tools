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
