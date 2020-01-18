import utils from '@/helpers/utils';

export default class {
  static validate(value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.8) {
          if (value && value.length > 8 && /^(a|e|i|o|u)/.test(value)) {
            resolve();
          } else {
            reject(new Error(utils.getMessage(value)));
          }
        } else {
          reject(new Error('Network error'));
        }
      }, utils.randomRange(100, 1000));
    });
  }

  static submit(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.5) {
          resolve(data);
          return;
        }

        reject(new Error('BANG! Try again later'));
      }, 2000);
    });
  }
}
