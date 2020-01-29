import { IdGenerator, Id } from './IdGenerator';

let counter = 0;
let counterOverflow = 0x1000;

export class ActualIdGenerator implements IdGenerator {
  public generate(): Id {
    const millisec = new Date().getTime();
    const user = 1;
    const device = 1;

    counter += 0xb57;
    if (counter >= counterOverflow) {
      counter -= counterOverflow;
    }

    return (
      counter.toString(16).padStart(3, '0') +
      '' +
      rev(millisec.toString(16).padStart(11, '0')) +
      '' +
      device.toString(16) +
      '' +
      user.toString(16)
    );
  }
}

function rev(str: string): string {
  return str
    .split('')
    .reverse()
    .join('');
}
