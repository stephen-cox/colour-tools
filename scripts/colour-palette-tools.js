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