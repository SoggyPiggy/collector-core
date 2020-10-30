import {
  Account,
  Coin,
  CoinInstance,
  Series,
} from '../structures';

export const resolveMessage = function resolveMessageFromContentPassed(content) {
  switch (true) {
    case content instanceof Account:
    case content instanceof Coin:
    case content instanceof CoinInstance:
    case content instanceof Series:
    default:
      return ':)';
  }
};

export const resolveDestination = function resolveDestinationFromDataPassed(target, { message }) {
  switch (target) {
    case 'reply':
      return message.channel;
    case 'notify':
    case 'direct':
    default:
      return message.author;
  }
};

export const send = function sendMessage(content, target, data) {
  const message = typeof content === 'string' ? content : resolveMessage(content, data);
  const destination = resolveDestination(target, data);
  destination.send(message);
};
