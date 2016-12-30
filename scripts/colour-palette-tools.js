/**
 * Main colour palette routine
 */
if ($('#colour-palette-tools').length > 0) {
  $(function() {

    var colour = chroma('cyan');

    // Initialise
    var colour_block = $('.js-colour-block');
    var hue = $('.js-slider-hue').colour_slider({
      max: 360,
      value: colour.get('hsl.h'),
      update: function(value, colour) {
        var h = colour.get('hsl.h');
        var s = 100 * colour.get('hsl.s');
        var l = 100 * colour.get('hsl.l');
        var gradient = 'linear-gradient(0deg';
        for (var i = 0; i <= 361; i++) {
          gradient += ' ,hsl('+i+', '+s+'%, '+l+'%)';
        }
        gradient += ')';
        this.set_range_colour(gradient);
        this.set_slide_colour('hsl('+h+', '+s+'%, '+l+'%)');
        this.val(value, false);
      }
    });
    var saturation = $('.js-slider-saturation').colour_slider({
      value: 100 * colour.get('hsl.s'),
      update: function(value, colour) {
        var h = colour.get('hsl.h');
        var s = 100 * colour.get('hsl.s');
        var l = 100 * colour.get('hsl.l');
        this.set_range_colour('linear-gradient(180deg, hsl('+h+', 100%, '+l+'%), hsl('+h+', 0%, '+l+'%))');
        this.set_slide_colour('hsl('+h+', '+s+'%, '+l+'%)');
        this.val(value, false);
      }
    });
    var luminosity = $('.js-slider-luminosity').colour_slider({
      value: 100 * colour.get('hsl.l'),
      update: function(value, colour) {
        var h = colour.get('hsl.h');
        var s = 100 * colour.get('hsl.s');
        var l = 100 * colour.get('hsl.l');
        this.set_range_colour('linear-gradient(180deg, hsl('+h+', '+s+'%, 100%), hsl('+h+', '+s+'%, 50%), hsl('+h+', '+s+'%, 0%))');
        this.set_slide_colour('hsl('+h+', '+s+'%, '+l+'%)');
        this.val(value, false);
      }
    });
    var red = $('.js-slider-red').colour_slider({
      max: 255,
      value: colour.get('rgb.r'),
      update: function(value, colour) {
        var r = colour.get('rgb.r');
        var g = colour.get('rgb.g');
        var b = colour.get('rgb.b');
        this.set_range_colour('linear-gradient(180deg, rgb(255, '+g+', '+b+'), rgb(0, '+g+', '+b+')');
        this.set_slide_colour('rgb('+r+', '+g+', '+b+')');
        this.val(value, false);
      }
    });
    var green = $('.js-slider-green').colour_slider({
      max: 255,
      value: colour.get('rgb.g'),
      update: function(value, colour) {
        var r = colour.get('rgb.r');
        var g = colour.get('rgb.g');
        var b = colour.get('rgb.b');
        this.set_range_colour('linear-gradient(180deg, rgb('+r+', 255, '+b+'), rgb('+r+', 0, '+b+')');
        this.set_slide_colour('rgb('+r+', '+g+', '+b+')');
        this.val(value, false);
      }
    });
    var blue = $('.js-slider-blue').colour_slider({
      max: 255,
      value: colour.get('rgb.b'),
      update: function(value, colour) {
        var r = colour.get('rgb.r');
        var g = colour.get('rgb.g');
        var b = colour.get('rgb.b');
        this.set_range_colour('linear-gradient(180deg, rgb('+r+', '+g+', 255), rgb('+r+', '+g+', 0)');
        this.set_slide_colour('rgb('+r+', '+g+', '+b+')');
        this.val(value, false);
      }
    });
    var hex_text = $('.js-colour-details-hex');
    var hsl_text = $('.js-colour-details-hsl');
    var rgb_text = $('.js-colour-details-rgb');
    update_colour_block_hsl();

    // Bind events
    hue.bind('colour-change', function(event) {
      update_colour_block_hsl();
    });
    saturation.bind('colour-change', function(event) {
      update_colour_block_hsl();
    });
    luminosity.bind('colour-change', function(event) {
      update_colour_block_hsl();
    });
    red.bind('colour-change', function(event) {
      update_colour_block_rgb();
    });
    green.bind('colour-change', function(event) {
      update_colour_block_rgb();
    });
    blue.bind('colour-change', function(event) {
      update_colour_block_rgb();
    });

    // Update Colour block from hsl sliders
    function update_colour_block_hsl() {
      var h = hue.val();
      var s = saturation.val();
      var l = luminosity.val();
      colour_block.css('background-color', 'hsl('+h+', '+s+'%, '+l+'%)');
      update_sliders()
    }

    // Update Colour block from rgb sliders
    function update_colour_block_rgb() {
      var r = red.val();
      var g = green.val();
      var b = blue.val();
      colour_block.css('background-color', 'rgb('+r+', '+g+', '+b+')');
      update_sliders()
    }

    // Update sliders
    function update_sliders() {
      colour = chroma(colour_block.css('background-color'));
      var h = colour.get('hsl.h');
      var s = 100 * colour.get('hsl.s');
      var l = 100 * colour.get('hsl.l');
      var r = colour.get('rgb.r');
      var g = colour.get('rgb.g');
      var b = colour.get('rgb.b');
      hue.update(h, colour);
      saturation.update(s, colour);
      luminosity.update(l, colour);
      red.update(r, colour);
      green.update(g, colour);
      blue.update(b, colour);
      hex_text.text(colour.hex());
      hsl_text.text('hsl('+Math.round(h)+', '+Math.round(s)+'%, '+Math.round(l)+'%)');
      rgb_text.text('rgb('+r+', '+g+', '+b+')');
    }
  });
}