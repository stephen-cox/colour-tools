/**
 * Colour class
 */
class Colour {

  /**
   * Colour class constructor
   *
   * Create a Colour class object with the colour determined by the number of args
   *  - no args an empty colour is created
   *  - 1 arg supplied, colour assumed to be a string hex code
   *  - 3 args supplied, a guess is made to determine whether RGB or HSL
   *  - a 4th arg of 'rgb' or 'hsl' can be supplied
   */
  constructor(...args) {
    // HSL colour values
    this._h = 0;
    this._s = 0;
    this._l = 0;

    // RGB colour values
    this._r = 0;
    this._g = 0;
    this._b = 0;

    // Hex colour value
    this._hex = '000000';

    // Check args
    if (args.length === 0) {
    }
    else if (args.length === 1) {
      this.hex = args[0];
    }
    else if (args.length === 4 && args[3] === 'rgb') {
      this.rgb = args;
    }
    else if (args.length === 4 && args[3] === 'hsl') {
      this.hsl = args;
    }
    else if (args.length === 3
        && this.is_rgb(args[0])
        && this.is_rgb(args[1])
        && this.is_rgb(args[2])) {
      this.rgb = args;
    }
    else if (args.length === 3
        && this.is_hue(args[0])
        && this.is_saturation(args[1])
        && this.is_luminosity(args[0])) {
      this.hsl = args;
    }
    else {
      TypeError('Unable to determine colour type');
    }
  }

  /**
   * Get HSL value array
   */
  get hsl() {
    return [this.hue, this.saturation, this.luminosity];
  }

  /**
   * Set value from HSL
   */
  set hsl(value) {
    const h = value[0];
    const s = value[1];
    const l = value[2];

    // Check hue
    if (h >= 0 && h <= 360) {
      this._h = h;
    }
    else {
      RangeError('HSL hue value out of range');
    }

    // Check saturation
    if (s >= 0 && s <= 1) {
      this._s = s;
    }
    else {
      RangeError('HSL saturation value out of range');
    }

    // Check luminosity
    if (l >= 0 && l <= 1) {
      this._l = l;
    }
    else {
      RangeError('HSL luminosity value out of range');
    }

    // Set RGB from HSL
    let r;
    let g;
    let b;

    if (s === 0) {
      this._r = this._g = this._b = 255 * l;
    }
    else {
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      }

    }

  }

  /**
   * Get HSL hue value
   */
  get hue() {
    return this._h;
  }

  /**
   * Set HSL hue value
   */
  set hue(h) {
    this.hsl = [h, this._s, this._l];
  }

  /**
   * Get HSL saturation value
   */
  get saturation() {
    return this._s;
  }

  /**
   * Set HSL saturation value
   */
  set saturation(s) {
    this.hsl = [this._h, s, this._l];
  }

  /**
   * Get HSL luminosity value
   */
  get luminosity() {
    return this._l;
  }

  /**
   * Set HSL luminosity value
   */
  set luminosity(l) {
    this.hsl = [this._h, this._s, l];
  }

  /**
   * Get RGB value array
   */
  get rgb() {
    return [this.red, this.green, this.blue];
  }

  /**
   * Set value from RGB
   */
  set rgb(value) {
    const r = value[0];
    const g = value[1];
    const b = value[2];

    // Check red
    if (r === parseInt(r) && r <= 0 && r <= 255) {
      this._r = r;
    }
    else {
      RangeError('RGB red value out of range');
    }

    // Check green
    if (g === parseInt(g) && g <= 0 && g <= 255) {
      this._g = g;
    }
    else {
      RangeError('RGB green value out of range');
    }

    // Check blue
    if (b === parseInt(b) && b <= 0 && b <= 255) {
      this._b = b;
    }
    else {
      RangeError('RGB blue value out of range');
    }

    // Set HSL from RGB
  }

  /**
   * Get RGB red value
   */
  get red() {
    return this._r;
  }

  /**
   * Set RGB red value
   */
  set red(r) {
    this.rgb = [r, this._g, this._b];
  }

  /**
   * Get RGB green value
   */
  get green() {
    return this._g;
  }

  /**
   * Set RGB green value
   */
  set green(g) {
    this.rgb = [this._r, g, this._b];
  }

  /**
   * Get RGB blue value
   */
  get blue() {
    return this._b;
  }

  /**
   * Set RGB blue value
   */
  set blue(b) {
    this.rgb = [this._r, this._g, b];
  }

  /**
   * Get HTML hex value
   */
  get hex() {

  }

  /**
   * Set value from HTML hex
   */
  set hex(value) {

  }

}