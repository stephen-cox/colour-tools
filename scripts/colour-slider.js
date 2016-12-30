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
      decimal_places: 0,
      value: null,
      update: function(value, colour) {
        this.val(value, false);
      }
    };

    /**
     * Initialise variables
     */
    plugin.value = null;
    var opts = $.extend({}, plugin.defaults, options);
    var range = plugin.find('.js-slider-range');
    var input = plugin.find('.js-slider-value');
    var slide = plugin.find('.js-slider-slide');
    slide.udraggable({
      axis: "y",
      containment: [-6, -8, 70, 471],
      drag: function(e, ui) {
        var position = ui.offset.top + slide.outerHeight() / 2;
        var value = opts.max + opts.min - (opts.max - opts.min) * position / range.height();
        plugin.val(value);
      }
    });

    /**
     * Add events
     */
    range.click(function(e) {
      var offset =  $(this).parent().offset();
      var position = e.pageY - offset.top;
      var value = opts.max + opts.min - (opts.max - opts.min) * position / range.height();
      plugin.val(value);
    });
    input.change(function(e) {
      plugin.val(parseInt(input.val()));
    });

    /**
     * Get or set widget value method
     */
    plugin.val = function(value, trigger_events) {
      if (value === undefined) {
        // Get value
        return plugin.value;
      }
      else if (typeof value == 'number') {
        // Set value
        if (trigger_events === undefined) {
          trigger_events = true;
        }
        if (value < opts.min || value > opts.max) {
          throw 'Colour slider value out of range';
        }
        if (plugin.value != value) {
          plugin.value = value.toFixed(opts.decimal_places);
          input.val(plugin.value);
          set_slide();
          if (trigger_events) {
            plugin.trigger('colour-change');
          }
        }
        return plugin;
      }
      else {
        throw 'Colour slider value not a number';
      }
    };

    /**
     * Update the slider
     */
    plugin.update = function(value, colour) {
      if (typeof opts.update == 'function') {
        opts.update.call(this, value, colour);
      }
    };

    /**
     * Set range colour
     */
    plugin.set_range_colour = function(colour_string) {
      range.css('background', colour_string);
    };

    /**
     * Set slide colours
     */
    plugin.set_slide_colour = function(colour_string) {
      slide.css('background', colour_string);
    };

    /**
     * Set the slide position
     */
    var set_slide = function(animate) {
      var position = (opts.max + opts.min - plugin.val()) * range.height() / (opts.max - opts.min);
      if (animate) {
        slide.animate({'top': position - slide.outerHeight() / 2});
      }
      else {
        slide.css({'top': position - slide.outerHeight() / 2});
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
