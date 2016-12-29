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

