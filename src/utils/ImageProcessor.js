export class ImageProcessor {
  static canvas = null;
  static ctx = null;

  static initCanvas() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
    }
  }

  static async processImageFromUrl(url, filters) {
    this.initCanvas();
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.ctx.filter = this.buildFilterString(filters);
        this.ctx.drawImage(img, 0, 0);
        resolve(this.canvas.toDataURL());
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  static buildFilterString(filters) {
    return `
      contrast(${filters.contrast}%)
      brightness(${filters.brightness}%)
      saturate(${filters.saturate}%)
      blur(${filters.blur}px)
      hue-rotate(${filters.hueRotate}deg)
      sepia(${filters.sepia}%)
      invert(${filters.invert}%)
      grayscale(${filters.grayscale}%)
    `.replace(/\s+/g, ' ').trim();
  }
}
