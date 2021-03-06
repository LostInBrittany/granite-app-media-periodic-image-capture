import '@polymer/polymer/polymer-element.js';
import '@polymer/app-media/app-media-image-capture.js';
/**
  * `granite-app-media-periodic-image-capture`
  * An element extending app-media-image-capture allowing a periodic image capture (i.e. x images per second)
  *
  * @customElement
  * @polymer
  * @demo demo/index.html
  */
class GraniteAppMediaPeriodicImageCapture extends window.customElements.get('app-media-image-capture') {
  static get is() { return 'granite-app-media-periodic-image-capture'; }
  static get properties() {
    return {
      /**
       * Number of captured images per second
       */
      frequency: {
        type: Number,
        value: 10,
        observer: '_onFrequencyChange',
      },
      /**
       * If true, the element captures `frequency` images per second
       */
      capture: {
        type: Boolean,
        value: false,
        observer: '_onCaptureChange',
      },
      /**
       * If true, send logs to the console
       */
      debug: {
        type: Boolean,
        value: false,
      },
      _timeoutId: {
        type: Number,
        value: 0,
      },
    };
  }

  _onFrequencyChange() {
    if (this.frequency<0.001 || this.frequency > 100) {
      console.error('Frequency must be between 0.001 and 100 images per second');
      this.frequency = 10;
    }
    if (this.debug) {
      console.log('[granite-app-media-periodic-image-capture] _onFrequencyChange',
          this.capture, this.frequency);
    }
    if (this.capture) {
      this._stopCapture();
      this._startCapture();
    }
  }

  _onCaptureChange() {
    if (this.debug) {
      console.log('[granite-app-media-periodic-image-capture] _onCaptureChange',
          this.capture, this.frequency);
    }
    if (this.capture) {
      this._startCapture();
      return;
    }
    this._stopCapture();
  }

  _doCapture() {
    this.takePhoto();
    if (this.debug) {
      console.log('[granite-app-media-periodic-image-capture] _doCapture period', 
        1000 / this.frequency);
    }
    this._timeoutId = setTimeout(() => {
      if (this.debug) {
        console.log('[granite-app-media-periodic-image-capture] _doCapture - capturing');
      }
      this._doCapture();
    }, 1000 / this.frequency);
    console.log('timeoutId', this._timeoutId);
  }

  _startCapture() {
    if (this.debug) {
      console.log('[granite-app-media-periodic-image-capture] _startCapture');
    }
    if (!this._timeoutId) {
      this._doCapture();
    }
  }

  _stopCapture() {
    if (this.debug) {
      console.log('[granite-app-media-periodic-image-capture] _stopCapture');
    }
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = undefined;
    }
  }
}

window.customElements.define(GraniteAppMediaPeriodicImageCapture.is, GraniteAppMediaPeriodicImageCapture);
