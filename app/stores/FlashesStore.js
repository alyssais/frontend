// @flow

type FlashType = "error" | "success" | "info";

export type FlashItem = {
  id: number | 'FLASH_CONN_ERROR',
  type: FlashType,
  message: Object
};

import EventEmitter from 'eventemitter3';

class FlashesStore extends EventEmitter {
  preloaded: Array<FlashItem>;

  constructor() {
    super(...arguments);
    this.preloaded = [];
    this.ERROR = "error";
    this.SUCCESS = "success";
    this.INFO = "info";
  }

  preload(flashes: Array<FlashItem>) {
    for (const flash of flashes) {
      this.preloaded.push({ id: (new Date()).valueOf(), ...flash });
    }
  }

  flash(type: FlashType, message: Object) {
    let returnMessage: Object | string = message;

    // See if the message is actually a GraphQL exception
    if (message.source && message.message) {
      if (message.source.errors && message.source.errors[0] && message.source.errors[0].message) {
        if (message.source.type === "unknown_error") {
          returnMessage = "Sorry, there’s been an unexpected error and our engineers have been notified";
        } else {
          returnMessage = message.source.errors[0].message;
        }
      } else {
        returnMessage = "An unknown error occured";
      }
    }

    this.emit('flash', { id: (new Date()).valueOf(), type: type, message: returnMessage });
  }

  reset() {
    this.emit('reset');
  }
}

export default new FlashesStore();
