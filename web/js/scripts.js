'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Colour palette tools
 */

/**
 * Colour class
 */
var Colour = function Colour() {
  _classCallCheck(this, Colour);
};

/**
 * ColourElement class
 */


var ColourElement = function () {
  function ColourElement(selector) {
    _classCallCheck(this, ColourElement);

    this._selector = selector;
    this._element = $(selector);
  }

  /**
   * Fire change event
   */


  _createClass(ColourElement, [{
    key: 'change',
    value: function change() {
      this.element.trigger('element-change');
    }

    /**
     * Get the element
     */

  }, {
    key: 'element',
    get: function get() {
      return this._element;
    }
  }]);

  return ColourElement;
}();

/**
 * ColourSlider class
 */


var ColourSlider = function (_ColourElement) {
  _inherits(ColourSlider, _ColourElement);

  function ColourSlider(selector, options) {
    _classCallCheck(this, ColourSlider);

    // Set options
    var _this = _possibleConstructorReturn(this, (ColourSlider.__proto__ || Object.getPrototypeOf(ColourSlider)).call(this, selector));

    var defaults = {
      min: 0,
      max: 100,
      decimal_places: 0,
      value: null,
      update: function update(colour) {}
    };
    _this.options = $.extend({}, defaults, options);

    // Set slider elements
    _this._range = $('<div />').attr('class', '.js-slider-range slider__range');
    _this.element.append(_this._range);
    _this._slide = $('<div />').attr('class', '.js-slider-slide slider__slide');
    _this._range.append(_this._slide);
    _this._input = $('<input />').attr('type', 'text').attr('class', '.js-slider-value slider__value');
    _this.element.append(_this._input);

    // Set the slider value
    if (_this.options.value == null) {
      _this.value = _this.options.min;
    } else {
      _this.value = _this.options.value;
    }

    // Add events
    _this._range.click(function (e) {
      var offset = _this._range.parent().offset();
      _this.value = _this.calc_value(e.pageY - offset.top);
    });
    _this._input.change(function () {
      _this.value = parseInt(_this._input.val());
    });

    // Add dragging
    _this._slide.udraggable({
      axis: 'y',
      containment: [-6, -8, 70, 472],
      drag: function drag(e, ui) {
        _this.value = _this.calc_value(ui.offset.top + _this._slide.outerHeight() / 2);
      },
      start: function start() {
        ColourSlider.Dragging = true;
      },
      stop: function stop() {
        ColourSlider.Dragging = false;
      }
    });
    return _this;
  }

  /**
   * Fire change event
   */


  _createClass(ColourSlider, [{
    key: 'change',
    value: function change() {
      this.element.trigger('slider-change');
    }

    /**
     * Get slider value
     */

  }, {
    key: 'set_value',


    /**
     * Set slider value
     */
    value: function set_value(value) {
      var trigger_events = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var val = value;

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

  }, {
    key: 'calc_value',
    value: function calc_value(position) {
      var range = this.options.max - this.options.min;
      return this.options.max + this.options.min - range * position / this._range.height();
    }

    /**
     * Calculate position
     */

  }, {
    key: 'calc_position',
    value: function calc_position(value) {
      var range = this.options.max - this.options.min;
      return (this.options.max + this.options.min - value) * this._range.height() / range;
    }

    /**
     * Update the slider
     */

  }, {
    key: 'update',
    value: function update(colour) {
      if (typeof this.options.update === 'function') {
        this.options.update.call(this, colour);
      }
    }

    /**
     * Set range colour
     */

  }, {
    key: 'set_range_colour',
    value: function set_range_colour(colour_string) {
      this._range.css('background', colour_string);
    }

    /**
     * Set slide colours
     */

  }, {
    key: 'set_slide_colour',
    value: function set_slide_colour(colour_string) {
      this._slide.css('background', colour_string);
    }

    /**
     * Set the slide position
     */

  }, {
    key: 'set_slide',
    value: function set_slide() {
      var position = this.calc_position(this.value);
      if (ColourSlider.Dragging) {
        this._slide.css({ top: position - this._slide.outerHeight() / 2 });
      } else {
        this._slide.animate({ top: position - this._slide.outerHeight() / 2 });
      }
    }
  }, {
    key: 'value',
    get: function get() {
      return this._value;
    }

    /**
     * Set slider value and trigger change events
     */
    ,
    set: function set(value) {
      this.set_value(value, true);
    }
  }]);

  return ColourSlider;
}(ColourElement);

/**
 * ColourSlider Dragging class variable
 */


ColourSlider.Dragging = false;

/**
 * ColourSwatch class
 */

var ColourSwatch = function (_ColourElement2) {
  _inherits(ColourSwatch, _ColourElement2);

  function ColourSwatch(selector, colour) {
    _classCallCheck(this, ColourSwatch);

    var _this2 = _possibleConstructorReturn(this, (ColourSwatch.__proto__ || Object.getPrototypeOf(ColourSwatch)).call(this, selector));

    _this2.chroma = colour;
    return _this2;
  }

  /**
   * Fire change event
   */


  _createClass(ColourSwatch, [{
    key: 'change',
    value: function change() {
      this.element.trigger('swatch-change');
    }

    /**
     * Return the chroma colour
     */

  }, {
    key: 'get',


    /**
     * Return the colour property given by chroma
     */
    value: function get(property) {
      return this._colour.get(property);
    }

    /**
     * Set the swatch colour from RGB channels
     */

  }, {
    key: 'rgb',
    value: function rgb(r, g, b) {
      this.chroma = chroma(r, g, b);
    }

    /**
     * Set the swatch colour from HSL
     */

  }, {
    key: 'hsl',
    value: function hsl(h, s, l) {
      this.chroma = chroma(h, s, l, 'hsl');
    }
  }, {
    key: 'chroma',
    get: function get() {
      return this._colour;
    }

    /**
     * Set the chroma colour
     */
    ,
    set: function set(colour) {
      this._colour = colour;
      this.element.css('background-color', this.colour);
      this.change();
    }

    /**
     * Return the chroma colour in hex
     */

  }, {
    key: 'colour',
    get: function get() {
      return this._colour.hex();
    }

    /**
     * Set the colour from string
     */
    ,
    set: function set(colour) {
      this.chroma = chroma(colour);
    }
  }]);

  return ColourSwatch;
}(ColourElement);

/**
 * ColourStats class
 */


var ColourStats = function (_ColourElement3) {
  _inherits(ColourStats, _ColourElement3);

  function ColourStats(selector, colour) {
    _classCallCheck(this, ColourStats);

    var _this3 = _possibleConstructorReturn(this, (ColourStats.__proto__ || Object.getPrototypeOf(ColourStats)).call(this, selector));

    _this3._colour = null;

    // Add stats elements
    _this3._hex = $('.js-colour-stats-hex');
    _this3._hsl_h = $('.js-colour-stats-hsl-h');
    _this3._hsl_s = $('.js-colour-stats-hsl-s');
    _this3._hsl_l = $('.js-colour-stats-hsl-l');
    _this3._hsl_css = $('.js-colour-stats-hsl-css');
    _this3._rgb_r = $('.js-colour-stats-rgb-r');
    _this3._rgb_g = $('.js-colour-stats-rgb-g');
    _this3._rgb_b = $('.js-colour-stats-rgb-b');
    _this3._rgb_css = $('.js-colour-stats-rgb-css');

    // Set the colour
    _this3.set_colour(colour, false);
    return _this3;
  }

  /**
   * Fire change event
   */


  _createClass(ColourStats, [{
    key: 'change',
    value: function change() {
      this.element.trigger('stats-change');
    }

    /**
     * Get colour
     */

  }, {
    key: 'set_colour',


    /**
     * Set colour
     */
    value: function set_colour(colour, trigger_events) {
      if (this.colour === null || this.colour.hex() !== colour.hex()) {
        this._colour = colour;
        this._hex.val(this.colour.hex());
        this._hsl_h.val(this.colour.get('hsl.h'));
        this._hsl_s.val(this.colour.get('hsl.s'));
        this._hsl_l.val(this.colour.get('hsl.l'));
        this._hsl_css.html(this.colour.css('hsl'));
        this._rgb_r.val(this.colour.get('rgb.r'));
        this._rgb_g.val(this.colour.get('rgb.g'));
        this._rgb_b.val(this.colour.get('rgb.b'));
        this._rgb_css.html(this.colour.css());
        if (trigger_events) {
          this.change();
        }
      }
    }
  }, {
    key: 'colour',
    get: function get() {
      return this._colour;
    }

    /**
     * Set colour and trigger change event
     */
    ,
    set: function set(colour) {
      this.set_colour(colour, true);
    }
  }]);

  return ColourStats;
}(ColourElement);

/**
 * Main colour palette routine
 */


if ($('#colour-palette-tools').length > 0) {
  $(function () {
    var colour = void 0;
    try {
      colour = chroma(window.location.hash);
    } catch (err) {
      colour = chroma('cyan');
    }

    var colour_block = new ColourSwatch('.js-colour-block', colour);
    var hue = new ColourSlider('.js-slider-hue', {
      max: 360,
      decimal_places: 4,
      value: colour.get('hsl.h'),
      update: function update(color) {
        this.set_value(color.get('hsl.h'), false);
        this.set_slide_colour(color.hex());
        var c = chroma(color.hex());
        var gradient = 'linear-gradient(0deg';
        for (var i = 0; i <= 361; i += 1) {
          gradient += ' , ' + c.set('hsl.h', i).hex();
        }
        gradient += ')';
        this.set_range_colour(gradient);
      }
    });
    var saturation = new ColourSlider('.js-slider-saturation', {
      value: 100 * colour.get('hsl.s'),
      decimal_places: 4,
      update: function update(color) {
        this.set_value(100 * color.get('hsl.s'), false);
        this.set_slide_colour(color.hex());
        var c = chroma(color.hex());
        this.set_range_colour('linear-gradient(180deg, ' + c.set('hsl.s', 1).hex() + ', ' + c.set('hsl.s', 0).hex() + ')');
      }
    });
    var luminosity = new ColourSlider('.js-slider-luminosity', {
      value: 100 * colour.get('hsl.l'),
      decimal_places: 4,
      update: function update(color) {
        this.set_value(100 * color.get('hsl.l'), false);
        this.set_slide_colour(color.hex());
        var h = color.get('hsl.h');
        var s = 100 * color.get('hsl.s');
        var l = 100 * color.get('hsl.l');
        this.set_range_colour('linear-gradient(180deg, hsl(' + h + ', ' + s + '%, 100%), hsl(' + h + ', ' + s + '%, 50%), hsl(' + h + ', ' + s + '%, 0%))');
      }
    });
    var red = new ColourSlider('.js-slider-red', {
      max: 255,
      value: colour.get('rgb.r'),
      update: function update(color) {
        this.set_value(parseInt(color.get('rgb.r')), false);
        this.set_slide_colour(color.hex());
        var c = chroma(color.hex());
        this.set_range_colour('linear-gradient(180deg, ' + c.set('rgb.r', 255).hex() + ', ' + c.set('rgb.r', 0).hex() + ')');
      }
    });
    var green = new ColourSlider('.js-slider-green', {
      max: 255,
      value: colour.get('rgb.g'),
      update: function update(color) {
        this.set_value(parseInt(color.get('rgb.g')), false);
        this.set_slide_colour(color.hex());
        var c = chroma(color.hex());
        this.set_range_colour('linear-gradient(180deg, ' + c.set('rgb.g', 255).hex() + ', ' + c.set('rgb.g', 0).hex() + ')');
      }
    });
    var blue = new ColourSlider('.js-slider-blue', {
      max: 255,
      value: colour.get('rgb.b'),
      update: function update(color) {
        this.set_value(parseInt(color.get('rgb.b')), false);
        this.set_slide_colour(color.hex());
        var c = chroma(color.hex());
        this.set_range_colour('linear-gradient(180deg, ' + c.set('rgb.b', 255).hex() + ', ' + c.set('rgb.b', 0).hex() + ')');
      }
    });
    var stats = new ColourStats('.js-colour-stats', colour);

    // Bind swatch-change event
    colour_block.element.on('swatch-change', function () {
      hue.update(colour_block.chroma);
      saturation.update(colour_block.chroma);
      luminosity.update(colour_block.chroma);
      red.update(colour_block.chroma);
      green.update(colour_block.chroma);
      blue.update(colour_block.chroma);
      stats.colour = colour_block.chroma;
    });
    colour_block.change();

    // Bind slider-change events
    hue.element.on('slider-change', function () {
      colour_block.hsl(hue.value, saturation.value / 100, luminosity.value / 100);
    });
    saturation.element.on('slider-change', function () {
      colour_block.hsl(hue.value, saturation.value / 100, luminosity.value / 100);
    });
    luminosity.element.on('slider-change', function () {
      colour_block.hsl(hue.value, saturation.value / 100, luminosity.value / 100);
    });
    red.element.on('slider-change', function () {
      colour_block.rgb(red.value, green.value, blue.value);
    });
    green.element.on('slider-change', function () {
      colour_block.rgb(red.value, green.value, blue.value);
    });
    blue.element.on('slider-change', function () {
      colour_block.rgb(red.value, green.value, blue.value);
    });
  });
}
'use strict';

/*
 * jQuery plugin for unified mouse and touch events
 *
 * Copyright (c) 2013-2016 Michael S. Mikowski
 * (mike[dot]mikowski[at]gmail[dotcom])
 *
 * Dual licensed under the MIT or GPL Version 2
 * http://jquery.org/license
 *
 * Versions
 *  1.3.x   - Removed all console references
 *          - Change bind to on, unbind to off
 *          - Reinstated ignore_select to ignore text and input areas by default
 *  1.2.x   - ignore_class => ignore_select, now defaults to ''
 *  1.1.9   - Fixed ue-test.html demo to scale properly
 *  1.1.8   - Removed prevent default from non-ue events
 *  1.1.7   - Corrected desktop zoom motion description
 *  1.1.0-5 - No code changes. Updated npm keywords. Fixed typos.
 *            Bumped version to represent maturity and stability.
 *  0.6.1   - Change px_radius from 5 to 10 pixels
 *  0.6.0   - Added px_tdelta_x and px_tdelta_y for deltas from start
 *          - Fixed onheld and drag conflicts
 *  0.5.0   - Updated docs, removed cruft, updated for jslint,
 *            updated test page (zoom)
 *  0.4.3   - Removed fatal execption possibility if originalEvent
 *            is not defined on event object
 *  0.4.2   - Updated documentation
 *  0.3.2   - Updated to jQuery 1.9.1.
 *            Confirmed 1.7.0-1.9.1 compatibility.
 *  0.3.1   - Change for jQuery plugins site
 *  0.3.0   - Initial jQuery plugin site release
 *          - Replaced scrollwheel zoom with drag motion.
 *            This resolved a conflict with scrollable areas.
 *
*/

/*jslint           browser : true,   continue : true,
  devel  : true,    indent : 2,       maxerr  : 50,
  newcap : true,  plusplus : true,    regexp  : true,
  sloppy : true,      vars : false,     white  : true
*/
/*global jQuery */

(function ($) {
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var $Special = $.event.special,
      // Shortcut for special event
  motionMapMap = {},
      // Map of pointer motions by cursor
  isMoveBound = false,
      // Flag if move handlers bound
  pxPinchZoom = -1,
      // Distance between pinch-zoom points
  optionKey = 'ue_bound',
      // Data key for storing options
  doDisableMouse = false,
      // Flag to discard mouse input
  defaultOptMap = { // Default option map
    bound_ns_map: {}, // Map of bound namespaces e.g.
    // bound_ns_map.utap.fred
    px_radius: 10, // Tolerated distance before dragstart
    ignore_select: 'textarea, select, input', // Elements to ignore
    max_tap_ms: 200, // Maximum time allowed for tap
    min_held_ms: 300 // Minimum time require for long-press
  },
      callbackList = [],
      // global callback stack
  zoomMouseNum = 1,
      // multiplier for mouse zoom
  zoomTouchNum = 4,
      // multiplier for touch zoom

  boundList,
      Ue,
      motionDragId,
      motionHeldId,
      motionDzoomId,
      motion1ZoomId,
      motion2ZoomId,
      checkMatchVal,
      removeListVal,
      pushUniqVal,
      makeListPlus,
      fnHeld,
      fnMotionStart,
      fnMotionMove,
      fnMotionEnd,
      onMouse,
      onTouch;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  // Begin utiltity /makeListPlus/
  // Returns an array with much desired methods:
  //   * remove_val(value) : remove element that matches
  //     the provided value. Returns number of elements
  //     removed.
  //   * match_val(value)  : shows if a value exists
  //   * push_uniq(value)  : pushes a value onto the stack
  //     iff it does not already exist there
  // Note: the reason I need this is to compare objects to
  //   objects (perhaps jQuery has something similar?)
  checkMatchVal = function checkMatchVal(data) {
    var match_count = 0,
        idx;
    for (idx = this.length; idx; 0) {
      if (this[--idx] === data) {
        match_count++;
      }
    }
    return match_count;
  };
  removeListVal = function removeListVal(data) {
    var removed_count = 0,
        idx;
    for (idx = this.length; idx; 0) {
      if (this[--idx] === data) {
        this.splice(idx, 1);
        removed_count++;
        idx++;
      }
    }
    return removed_count;
  };
  pushUniqVal = function pushUniqVal(data) {
    if (checkMatchVal.call(this, data)) {
      return false;
    }
    this.push(data);
    return true;
  };
  // primary utility
  makeListPlus = function makeListPlus(input_list) {
    if (input_list && $.isArray(input_list)) {
      if (input_list.remove_val) {
        // The array appears to already have listPlus capabilities
        return input_list;
      }
    } else {
      input_list = [];
    }
    input_list.remove_val = removeListVal;
    input_list.match_val = checkMatchVal;
    input_list.push_uniq = pushUniqVal;

    return input_list;
  };
  // End utility /makeListPlus/
  //-------------------- END UTILITY METHODS -------------------

  //--------------- BEGIN JQUERY SPECIAL EVENTS ----------------
  // Unique array for bound objects
  boundList = makeListPlus();

  // Begin define special event handlers
  /*jslint unparam:true */
  Ue = {
    setup: function setup(data, name_list, bind_fn) {
      var this_el = this,
          $to_bind = $(this_el),
          seen_map = {},
          option_map,
          idx,
          namespace_key,
          ue_namespace_code,
          namespace_list;

      // if previous related event bound do not rebind, but do add to
      // type of event bound to this element, if not already noted
      if ($.data(this, optionKey)) {
        return;
      }

      option_map = {};
      $.extend(true, option_map, defaultOptMap);
      $.data(this_el, optionKey, option_map);

      namespace_list = makeListPlus(name_list.slice(0));
      if (!namespace_list.length || namespace_list[0] === "") {
        namespace_list = ["000"];
      }

      NSPACE_00: for (idx = 0; idx < namespace_list.length; idx++) {
        namespace_key = namespace_list[idx];

        if (!namespace_key) {
          continue NSPACE_00;
        }
        if (seen_map.hasOwnProperty(namespace_key)) {
          continue NSPACE_00;
        }

        seen_map[namespace_key] = true;

        ue_namespace_code = '.__ue' + namespace_key;

        $to_bind.on('mousedown' + ue_namespace_code, onMouse);
        $to_bind.on('touchstart' + ue_namespace_code, onTouch);
      }

      boundList.push_uniq(this_el); // record as bound element

      if (!isMoveBound) {
        // first element bound - adding global binds
        $(document).on('mousemove.__ue', onMouse);
        $(document).on('touchmove.__ue', onTouch);
        $(document).on('mouseup.__ue', onMouse);
        $(document).on('touchend.__ue', onTouch);
        $(document).on('touchcancel.__ue', onTouch);
        isMoveBound = true;
      }
    },

    // arg_map.type = string - name of event to bind
    // arg_map.data = poly - whatever (optional) data was passed when binding
    // arg_map.namespace = string - A sorted, dot-delimited list of namespaces
    //   specified when binding the event
    // arg_map.handler  = fn - the event handler the developer wishes to be bound
    //   to the event.  This function should be called whenever the event
    //   is triggered
    // arg_map.guid = number - unique ID for event handler, provided by jQuery
    // arg_map.selector = string - selector used by 'delegate' or 'live' jQuery
    //   methods.  Only available when these methods are used.
    //
    // this - the element to which the event handler is being bound
    // this always executes immediate after setup (if first binding)
    add: function add(arg_map) {
      var this_el = this,
          option_map = $.data(this_el, optionKey),
          namespace_str = arg_map.namespace,
          event_type = arg_map.type,
          bound_ns_map,
          namespace_list,
          idx,
          namespace_key;
      if (!option_map) {
        return;
      }

      bound_ns_map = option_map.bound_ns_map;

      if (!bound_ns_map[event_type]) {
        // this indicates a non-namespaced entry
        bound_ns_map[event_type] = {};
      }

      if (!namespace_str) {
        return;
      }

      namespace_list = namespace_str.split('.');

      for (idx = 0; idx < namespace_list.length; idx++) {
        namespace_key = namespace_list[idx];
        bound_ns_map[event_type][namespace_key] = true;
      }
    },

    remove: function remove(arg_map) {
      var elem_bound = this,
          option_map = $.data(elem_bound, optionKey),
          bound_ns_map = option_map.bound_ns_map,
          event_type = arg_map.type,
          namespace_str = arg_map.namespace,
          namespace_list,
          idx,
          namespace_key;

      if (!bound_ns_map[event_type]) {
        return;
      }

      // No namespace(s) provided:
      // Remove complete record for custom event type (e.g. utap)
      if (!namespace_str) {
        delete bound_ns_map[event_type];
        return;
      }

      // Namespace(s) provided:
      // Remove namespace flags from each custom event typei (e.g. utap)
      // record.  If all claimed namespaces are removed, remove
      // complete record.
      namespace_list = namespace_str.split('.');

      for (idx = 0; idx < namespace_list.length; idx++) {
        namespace_key = namespace_list[idx];
        if (bound_ns_map[event_type][namespace_key]) {
          delete bound_ns_map[event_type][namespace_key];
        }
      }

      if ($.isEmptyObject(bound_ns_map[event_type])) {
        delete bound_ns_map[event_type];
      }
    },

    teardown: function teardown(name_list) {
      var elem_bound = this,
          $bound = $(elem_bound),
          option_map = $.data(elem_bound, optionKey),
          bound_ns_map = option_map.bound_ns_map,
          idx,
          namespace_key,
          ue_namespace_code,
          namespace_list;

      // do not tear down if related handlers are still bound
      if (!$.isEmptyObject(bound_ns_map)) {
        return;
      }

      namespace_list = makeListPlus(name_list);
      namespace_list.push_uniq('000');

      NSPACE_01: for (idx = 0; idx < namespace_list.length; idx++) {
        namespace_key = namespace_list[idx];

        if (!namespace_key) {
          continue NSPACE_01;
        }

        ue_namespace_code = '.__ue' + namespace_key;
        $bound.off('mousedown' + ue_namespace_code);
        $bound.off('touchstart' + ue_namespace_code);
        $bound.off('mousewheel' + ue_namespace_code);
      }

      $.removeData(elem_bound, optionKey);

      // Unbind document events only after last element element is removed
      boundList.remove_val(this);
      if (boundList.length === 0) {
        // last bound element removed - removing global binds
        $(document).off('mousemove.__ue');
        $(document).off('touchmove.__ue');
        $(document).off('mouseup.__ue');
        $(document).off('touchend.__ue');
        $(document).off('touchcancel.__ue');
        isMoveBound = false;
      }
    }
  };
  /*jslint unparam:false */
  // End define special event handlers
  //--------------- BEGIN JQUERY SPECIAL EVENTS ----------------

  //------------------ BEGIN MOTION CONTROLS -------------------
  // Begin motion control /fnHeld/
  fnHeld = function fnHeld(arg_map) {
    var timestamp = +new Date(),
        motion_id = arg_map.motion_id,
        motion_map = arg_map.motion_map,
        bound_ns_map = arg_map.bound_ns_map,
        event_ue;

    delete motion_map.tapheld_toid;

    if (!motion_map.do_allow_held) {
      return;
    }

    motion_map.px_end_x = motion_map.px_start_x;
    motion_map.px_end_y = motion_map.px_start_y;
    motion_map.ms_timestop = timestamp;
    motion_map.ms_elapsed = timestamp - motion_map.ms_timestart;

    if (bound_ns_map.uheld) {
      event_ue = $.Event('uheld');
      $.extend(event_ue, motion_map);
      $(motion_map.elem_bound).trigger(event_ue);
    }

    // remove tracking, as we want no futher action on this motion
    if (bound_ns_map.uheldstart) {
      event_ue = $.Event('uheldstart');
      $.extend(event_ue, motion_map);
      $(motion_map.elem_bound).trigger(event_ue);
      motionHeldId = motion_id;
    } else {
      delete motionMapMap[motion_id];
    }
  };
  // End motion control /fnHeld/


  // Begin motion control /fnMotionStart/
  fnMotionStart = function fnMotionStart(arg_map) {
    var motion_id = arg_map.motion_id,
        event_src = arg_map.event_src,
        request_dzoom = arg_map.request_dzoom,
        option_map = $.data(arg_map.elem, optionKey),
        bound_ns_map = option_map.bound_ns_map,
        $target = $(event_src.target),
        do_zoomstart = false,
        motion_map,
        cb_map,
        event_ue;

    // this should never happen, but it does
    if (motionMapMap[motion_id]) {
      return;
    }

    // ignore on zoom
    if (request_dzoom && !bound_ns_map.uzoomstart) {
      return;
    }

    // :input selector includes text areas
    if ($target.is(option_map.ignore_select)) {
      return;
    }

    // Prevent default only after confirming handling this event
    event_src.preventDefault();

    cb_map = callbackList.pop();
    while (cb_map) {
      if ($target.is(cb_map.selector_str) || $(arg_map.elem).is(cb_map.selector_str)) {
        if (cb_map.callback_match) {
          cb_map.callback_match(arg_map);
        }
      } else {
        if (cb_map.callback_nomatch) {
          cb_map.callback_nomatch(arg_map);
        }
      }
      cb_map = callbackList.pop();
    }

    motion_map = {
      do_allow_tap: bound_ns_map.utap ? true : false,
      do_allow_held: bound_ns_map.uheld || bound_ns_map.uheldstart ? true : false,
      elem_bound: arg_map.elem,
      elem_target: event_src.target,
      ms_elapsed: 0,
      ms_timestart: event_src.timeStamp,
      ms_timestop: undefined,
      option_map: option_map,
      orig_target: event_src.target,
      px_current_x: event_src.clientX,
      px_current_y: event_src.clientY,
      px_end_x: undefined,
      px_end_y: undefined,
      px_start_x: event_src.clientX,
      px_start_y: event_src.clientY,
      timeStamp: event_src.timeStamp
    };

    motionMapMap[motion_id] = motion_map;

    if (bound_ns_map.uzoomstart) {
      if (request_dzoom) {
        motionDzoomId = motion_id;
      } else if (!motion1ZoomId) {
        motion1ZoomId = motion_id;
      } else if (!motion2ZoomId) {
        motion2ZoomId = motion_id;
        event_ue = $.Event('uzoomstart');
        do_zoomstart = true;
      }

      if (do_zoomstart) {
        event_ue = $.Event('uzoomstart');
        motion_map.px_delta_zoom = 0;
        $.extend(event_ue, motion_map);
        $(motion_map.elem_bound).trigger(event_ue);
        return;
      }
    }

    if (bound_ns_map.uheld || bound_ns_map.uheldstart) {
      motion_map.tapheld_toid = setTimeout(function () {
        fnHeld({
          motion_id: motion_id,
          motion_map: motion_map,
          bound_ns_map: bound_ns_map
        });
      }, option_map.min_held_ms);
    }
  };
  // End motion control /fnMotionStart/

  // Begin motion control /fnMotionMove/
  fnMotionMove = function fnMotionMove(arg_map) {
    var motion_id = arg_map.motion_id,
        event_src = arg_map.event_src,
        do_zoommove = false,
        motion_map,
        option_map,
        bound_ns_map,
        is_over_rad,
        event_ue,
        px_pinch_zoom,
        px_delta_zoom,
        mzoom1_map,
        mzoom2_map;

    if (!motionMapMap[motion_id]) {
      return;
    }

    // Prevent default only after confirming handling this event
    event_src.preventDefault();

    motion_map = motionMapMap[motion_id];
    option_map = motion_map.option_map;
    bound_ns_map = option_map.bound_ns_map;

    motion_map.timeStamp = event_src.timeStamp;
    motion_map.elem_target = event_src.target;
    motion_map.ms_elapsed = event_src.timeStamp - motion_map.ms_timestart;

    motion_map.px_delta_x = event_src.clientX - motion_map.px_current_x;
    motion_map.px_delta_y = event_src.clientY - motion_map.px_current_y;

    motion_map.px_current_x = event_src.clientX;
    motion_map.px_current_y = event_src.clientY;

    motion_map.px_tdelta_x = motion_map.px_start_x - event_src.clientX;
    motion_map.px_tdelta_y = motion_map.px_start_y - event_src.clientY;

    is_over_rad = Math.abs(motion_map.px_tdelta_x) > option_map.px_radius || Math.abs(motion_map.px_tdelta_y) > option_map.px_radius;
    // native event object override
    motion_map.timeStamp = event_src.timeStamp;

    // disallow held or tap if outside of zone
    if (is_over_rad) {
      motion_map.do_allow_tap = false;
      motion_map.do_allow_held = false;
    }

    // disallow tap if time has elapsed 
    if (motion_map.ms_elapsed > option_map.max_tap_ms) {
      motion_map.do_allow_tap = false;
    }

    if (motion1ZoomId && motion2ZoomId && (motion_id === motion1ZoomId || motion_id === motion2ZoomId)) {
      motionMapMap[motion_id] = motion_map;
      mzoom1_map = motionMapMap[motion1ZoomId];
      mzoom2_map = motionMapMap[motion2ZoomId];

      px_pinch_zoom = Math.floor(Math.sqrt(Math.pow(mzoom1_map.px_current_x - mzoom2_map.px_current_x, 2) + Math.pow(mzoom1_map.px_current_y - mzoom2_map.px_current_y, 2)) + 0.5);

      if (pxPinchZoom === -1) {
        px_delta_zoom = 0;
      } else {
        px_delta_zoom = (px_pinch_zoom - pxPinchZoom) * zoomTouchNum;
      }

      // save value for next iteration delta comparison
      pxPinchZoom = px_pinch_zoom;
      do_zoommove = true;
    } else if (motionDzoomId === motion_id) {
      if (bound_ns_map.uzoommove) {
        px_delta_zoom = motion_map.px_delta_y * zoomMouseNum;
        do_zoommove = true;
      }
    }

    if (do_zoommove) {
      event_ue = $.Event('uzoommove');
      motion_map.px_delta_zoom = px_delta_zoom;
      $.extend(event_ue, motion_map);
      $(motion_map.elem_bound).trigger(event_ue);
      return;
    }

    if (motionHeldId === motion_id) {
      if (bound_ns_map.uheldmove) {
        event_ue = $.Event('uheldmove');
        $.extend(event_ue, motion_map);
        $(motion_map.elem_bound).trigger(event_ue);
      }
      return;
    }

    if (motionDragId === motion_id) {
      if (bound_ns_map.udragmove) {
        event_ue = $.Event('udragmove');
        $.extend(event_ue, motion_map);
        $(motion_map.elem_bound).trigger(event_ue);
      }
      return;
    }

    if (bound_ns_map.udragstart && motion_map.do_allow_tap === false && motion_map.do_allow_held === false && !(motionDragId && motionHeldId)) {
      motionDragId = motion_id;
      event_ue = $.Event('udragstart');
      $.extend(event_ue, motion_map);
      $(motion_map.elem_bound).trigger(event_ue);

      if (motion_map.tapheld_toid) {
        clearTimeout(motion_map.tapheld_toid);
        delete motion_map.tapheld_toid;
      }
    }
  };
  // End motion control /fnMotionMove/

  // Begin motion control /fnMotionEnd/
  fnMotionEnd = function fnMotionEnd(arg_map) {
    var motion_id = arg_map.motion_id,
        event_src = arg_map.event_src,
        do_zoomend = false,
        motion_map,
        option_map,
        bound_ns_map,
        event_ue;

    doDisableMouse = false;

    if (!motionMapMap[motion_id]) {
      return;
    }

    motion_map = motionMapMap[motion_id];
    option_map = motion_map.option_map;
    bound_ns_map = option_map.bound_ns_map;

    motion_map.elem_target = event_src.target;
    motion_map.ms_elapsed = event_src.timeStamp - motion_map.ms_timestart;
    motion_map.ms_timestop = event_src.timeStamp;

    if (motion_map.px_current_x) {
      motion_map.px_delta_x = event_src.clientX - motion_map.px_current_x;
      motion_map.px_delta_y = event_src.clientY - motion_map.px_current_y;
    }

    motion_map.px_current_x = event_src.clientX;
    motion_map.px_current_y = event_src.clientY;

    motion_map.px_end_x = event_src.clientX;
    motion_map.px_end_y = event_src.clientY;

    motion_map.px_tdelta_x = motion_map.px_start_x - motion_map.px_end_x;
    motion_map.px_tdelta_y = motion_map.px_start_y - motion_map.px_end_y;

    // native event object override
    motion_map.timeStamp = event_src.timeStamp;

    // clear-out any long-hold tap timer
    if (motion_map.tapheld_toid) {
      clearTimeout(motion_map.tapheld_toid);
      delete motion_map.tapheld_toid;
    }

    // trigger utap
    if (bound_ns_map.utap && motion_map.ms_elapsed <= option_map.max_tap_ms && motion_map.do_allow_tap) {
      event_ue = $.Event('utap');
      $.extend(event_ue, motion_map);
      $(motion_map.elem_bound).trigger(event_ue);
    }

    // trigger udragend
    if (motion_id === motionDragId) {
      if (bound_ns_map.udragend) {
        event_ue = $.Event('udragend');
        $.extend(event_ue, motion_map);
        $(motion_map.elem_bound).trigger(event_ue);
      }
      motionDragId = undefined;
    }

    // trigger heldend
    if (motion_id === motionHeldId) {
      if (bound_ns_map.uheldend) {
        event_ue = $.Event('uheldend');
        $.extend(event_ue, motion_map);
        $(motion_map.elem_bound).trigger(event_ue);
      }
      motionHeldId = undefined;
    }

    // trigger uzoomend
    if (motion_id === motionDzoomId) {
      do_zoomend = true;
      motionDzoomId = undefined;
    }

    // cleanup zoom info
    else if (motion_id === motion1ZoomId) {
        if (motion2ZoomId) {
          motion1ZoomId = motion2ZoomId;
          motion2ZoomId = undefined;
          do_zoomend = true;
        } else {
          motion1ZoomId = undefined;
        }
        pxPinchZoom = -1;
      }
    if (motion_id === motion2ZoomId) {
      motion2ZoomId = undefined;
      pxPinchZoom = -1;
      do_zoomend = true;
    }

    if (do_zoomend && bound_ns_map.uzoomend) {
      event_ue = $.Event('uzoomend');
      motion_map.px_delta_zoom = 0;
      $.extend(event_ue, motion_map);
      $(motion_map.elem_bound).trigger(event_ue);
    }
    // remove pointer from consideration
    delete motionMapMap[motion_id];
  };
  // End motion control /fnMotionEnd/
  //------------------ END MOTION CONTROLS -------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // Begin event handler /onTouch/ for all touch events.
  // We use the 'type' attribute to dispatch to motion control
  onTouch = function onTouch(event) {
    var this_el = this,
        timestamp = +new Date(),
        o_event = event.originalEvent,
        touch_list = o_event ? o_event.changedTouches || [] : [],
        touch_count = touch_list.length,
        idx,
        touch_event,
        motion_id,
        handler_fn;

    doDisableMouse = true;

    event.timeStamp = timestamp;

    switch (event.type) {
      case 'touchstart':
        handler_fn = fnMotionStart;break;
      case 'touchmove':
        handler_fn = fnMotionMove;break;
      case 'touchend':
      case 'touchcancel':
        handler_fn = fnMotionEnd;break;
      default:
        handler_fn = null;
    }

    if (!handler_fn) {
      return;
    }

    for (idx = 0; idx < touch_count; idx++) {
      touch_event = touch_list[idx];

      motion_id = 'touch' + String(touch_event.identifier);

      event.clientX = touch_event.clientX;
      event.clientY = touch_event.clientY;
      handler_fn({
        elem: this_el,
        motion_id: motion_id,
        event_src: event
      });
    }
  };
  // End event handler /onTouch/


  // Begin event handler /onMouse/ for all mouse events
  // We use the 'type' attribute to dispatch to motion control
  onMouse = function onMouse(event) {
    var this_el = this,
        motion_id = 'mouse' + String(event.button),
        request_dzoom = false,
        handler_fn;

    if (doDisableMouse) {
      event.stopImmediatePropagation();
      return;
    }

    if (event.shiftKey) {
      request_dzoom = true;
    }

    // skip left or middle clicks
    if (event.type !== 'mousemove') {
      if (event.button !== 0) {
        return true;
      }
    }

    switch (event.type) {
      case 'mousedown':
        handler_fn = fnMotionStart;break;
      case 'mouseup':
        handler_fn = fnMotionEnd;break;
      case 'mousemove':
        handler_fn = fnMotionMove;break;
      default:
        handler_fn = null;
    }

    if (!handler_fn) {
      return;
    }

    handler_fn({
      elem: this_el,
      event_src: event,
      request_dzoom: request_dzoom,
      motion_id: motion_id
    });
  };
  // End event handler /onMouse/
  //-------------------- END EVENT HANDLERS --------------------

  // Export special events through jQuery API
  $Special.ue = $Special.utap = $Special.uheld = $Special.uzoomstart = $Special.uzoommove = $Special.uzoomend = $Special.udragstart = $Special.udragmove = $Special.udragend = $Special.uheldstart = $Special.uheldmove = $Special.uheldend = Ue;
  $.ueSetGlobalCb = function (selector_str, callback_match, callback_nomatch) {
    callbackList.push({
      selector_str: selector_str || '',
      callback_match: callback_match || null,
      callback_nomatch: callback_nomatch || null
    });
  };
})(jQuery);
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 * jQuery udraggable plugin v0.3.0
 * Copyright (c) 2013-2014 Grant McLean (grant@mclean.net.nz)
 *
 * Homepage: https://github.com/grantm/jquery-udraggable
 *
 * Dual licensed under the MIT and GPL (v2.0 or later) licenses:
 *   http://opensource.org/licenses/MIT
 *   http://opensource.org/licenses/GPL-2.0
 *
 * This library requires Michael S. Mikowski's unified mouse and touch
 * event plugin: https://github.com/mmikowski/jquery.event.ue
 *
 */

(function ($) {
    "use strict";

    var floor = Math.floor;
    var min = Math.min;
    var max = Math.max;

    window.requestAnimationFrame = window.requestAnimationFrame || function (work) {
        return setTimeout(work, 10);
    };

    window.cancelAnimationFrame = window.cancelAnimationFrame || function (id) {
        return clearTimeout(id);
    };

    // Constructor function

    var UDraggable = function UDraggable(el, options) {
        var that = this;
        this.el = el;
        this.$el = $(el);
        this.options = $.extend({}, $.fn.udraggable.defaults, options);
        this.positionElement = this.options.positionElement || this.positionElement;
        this.getStartPosition = this.options.getStartPosition || this.getStartPosition;
        this.normalisePosition = this.options.normalisePosition || this.normalisePosition;
        this.updatePositionFrameHandler = function () {
            delete that.queuedUpdate;
            var pos = that.ui.position;
            that.positionElement(that.$el, that.started, pos.left, pos.top);
            if (that.options.dragUpdate) {
                that.options.dragUpdate.apply(that.el, [that.ui]);
            }
        };
        this.queuePositionUpdate = function () {
            if (!that.queuedUpdate) {
                that.queuedUpdate = window.requestAnimationFrame(that.updatePositionFrameHandler);
            }
        };
        this.init();
    };

    UDraggable.prototype = {

        constructor: UDraggable,

        init: function init() {
            var that = this;
            this.disabled = false;
            this.started = false;
            this.normalisePosition();
            var $target = this.options.handle ? this.$el.find(this.options.handle) : this.$el;
            if (this.options.longPress) {
                $target.on('uheldstart.udraggable', function (e) {
                    that.start(e);
                }).on('uheldmove.udraggable', function (e) {
                    that.move(e);
                }).on('uheldend.udraggable', function (e) {
                    that.end(e);
                });
            } else {
                $target.on('udragstart.udraggable', function (e) {
                    that.start(e);
                }).on('udragmove.udraggable', function (e) {
                    that.move(e);
                }).on('udragend.udraggable', function (e) {
                    that.end(e);
                });
            }
        },

        destroy: function destroy() {
            var $target = this.options.handle ? this.$el.find(this.options.handle) : this.$el;
            $target.off('.udraggable');
            this.$el.removeData('udraggable');
        },

        disable: function disable() {
            this.disabled = true;
        },

        enable: function enable() {
            this.disabled = false;
        },

        option: function option() {
            var name;
            if (arguments.length === 0) {
                return this.options;
            }
            if (arguments.length === 2) {
                this.options[arguments[0]] = arguments[1];
                return;
            }
            if (arguments.length === 1) {
                if (typeof arguments[0] === 'string') {
                    return this.options[arguments[0]];
                }
                if (_typeof(arguments[0]) === 'object') {
                    for (name in arguments[0]) {
                        if (arguments[0].hasOwnProperty(name)) {
                            this.options[name] = arguments[0][name];
                        }
                    }
                }
            }
            if (this.options.containment) {
                this._initContainment();
            }
        },

        normalisePosition: function normalisePosition() {
            var pos = this.$el.position();
            this.$el.css({
                position: 'absolute',
                top: pos.top,
                left: pos.left,
                right: 'auto',
                bottom: 'auto'
            });
        },

        start: function start(e) {
            if (this.disabled) {
                return;
            }
            var start = this.getStartPosition(this.$el);
            this._initContainment();
            this.ui = {
                helper: this.$el,
                offset: { top: start.y, left: start.x },
                originalPosition: { top: start.y, left: start.x },
                position: { top: start.y, left: start.x }
            };
            if (this.options.longPress) {
                this._start(e);
            }
            return this._stopPropagation(e);
        },

        move: function move(e) {
            if (this.disabled || !this.started && !this._start(e)) {
                return;
            }
            var delta_x = e.px_current_x - e.px_start_x;
            var delta_y = e.px_current_y - e.px_start_y;
            var axis = this.options.axis;
            if (axis && axis === "x") {
                delta_y = 0;
            }
            if (axis && axis === "y") {
                delta_x = 0;
            }
            var cur = {
                left: this.ui.originalPosition.left,
                top: this.ui.originalPosition.top
            };
            if (!axis || axis === "x") {
                cur.left += delta_x;
            }
            if (!axis || axis === "y") {
                cur.top += delta_y;
            }
            this._applyGrid(cur);
            this._applyContainment(cur);
            var pos = this.ui.position;
            if (cur.top !== pos.top || cur.left !== pos.left) {
                this.ui.position.left = cur.left;
                this.ui.position.top = cur.top;
                this.ui.offset.left = cur.left;
                this.ui.offset.top = cur.top;
                if (this.options.drag) {
                    this.options.drag.apply(this.el, [e, this.ui]);
                }
                this.queuePositionUpdate();
            }
            return this._stopPropagation(e);
        },

        end: function end(e) {
            if (this.started || this._start(e)) {
                this.$el.removeClass("udraggable-dragging");
                this.started = false;
                if (this.queuedUpdate) {
                    window.cancelAnimationFrame(this.queuedUpdate);
                }
                this.updatePositionFrameHandler();
                if (this.options.stop) {
                    this.options.stop.apply(this.el, [e, this.ui]);
                }
            }
            return this._stopPropagation(e);
        },

        // helper methods

        _stopPropagation: function _stopPropagation(e) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        },

        _start: function _start(e) {
            if (!this._mouseDistanceMet(e) || !this._mouseDelayMet(e)) {
                return;
            }
            this.started = true;
            this.queuePositionUpdate();
            if (this.options.start) {
                this.options.start.apply(this.el, [e, this.ui]);
            }
            this.$el.addClass("udraggable-dragging");
            return true;
        },

        _mouseDistanceMet: function _mouseDistanceMet(e) {
            return max(Math.abs(e.px_start_x - e.px_current_x), Math.abs(e.px_start_y - e.px_current_y)) >= this.options.distance;
        },

        _mouseDelayMet: function _mouseDelayMet(e) {
            return e.ms_elapsed > this.options.delay;
        },

        _initContainment: function _initContainment() {
            var o = this.options;
            var $c, ce;

            if (!o.containment) {
                this.containment = null;
                return;
            }

            if (o.containment.constructor === Array) {
                this.containment = o.containment;
                return;
            }

            if (o.containment === "parent") {
                o.containment = this.$el.offsetParent();
            }

            $c = $(o.containment);
            ce = $c[0];
            if (!ce) {
                return;
            }

            this.containment = [0, 0, $c.innerWidth() - this.$el.outerWidth(), $c.innerHeight() - this.$el.outerHeight()];
        },

        _applyGrid: function _applyGrid(cur) {
            if (this.options.grid) {
                var gx = this.options.grid[0];
                var gy = this.options.grid[1];
                cur.left = floor((cur.left + gx / 2) / gx) * gx;
                cur.top = floor((cur.top + gy / 2) / gy) * gy;
            }
        },

        _applyContainment: function _applyContainment(cur) {
            var cont = this.containment;
            if (cont) {
                cur.left = min(max(cur.left, cont[0]), cont[2]);
                cur.top = min(max(cur.top, cont[1]), cont[3]);
            }
        },

        getStartPosition: function getStartPosition($el) {
            return {
                x: parseInt($el.css('left'), 10) || 0,
                y: parseInt($el.css('top'), 10) || 0
            };
        },

        positionElement: function positionElement($el, dragging, left, top) {
            $el.css({ left: left, top: top });
        }

    };

    // jQuery plugin function

    $.fn.udraggable = function (option) {
        var args = Array.prototype.slice.call(arguments, 1);
        var results = [];
        this.each(function () {
            var $this = $(this);
            var data = $this.data('udraggable');
            if (!data) {
                data = new UDraggable(this, option);
                $this.data('udraggable', data);
            }
            if (typeof option === 'string') {
                // option is a method - call it
                if (typeof data[option] !== 'function') {
                    throw "jquery.udraggable has no '" + option + "' method";
                }
                var result = data[option].apply(data, args);
                if (result !== undefined) {
                    results.push(result);
                }
            }
        });
        return results.length > 0 ? results[0] : this;
    };

    $.fn.udraggable.defaults = {
        axis: null,
        delay: 0,
        distance: 0,
        longPress: false,
        // callbacks
        drag: null,
        start: null,
        stop: null
    };
})(jQuery);
'use strict';

/**
 * Display W3C Named colours
 */

if ($('#named-colours').length > 0) {
  $(function () {

    var c, colour, row, cell, text, i;
    var table = $('table');
    var properties = ['name', 'hex', 'rgb.r', 'rgb.g', 'rgb.b', 'temperature', 'hsl.h', 'hsl.s', 'hsl.l', 'hsv.h', 'hsv.s', 'hsv.v', 'cmyk.c', 'cmyk.m', 'cmyk.y', 'cmyk.k'];

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
    colours.sort(function (a, b) {
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