import { ItemId } from '../model/Item/ItemId';
import { Actions } from '../LocalStore/Actions';

export function getPriority(c: string, items: any) {
  return getField(c, 'priority', items);
}

const fieldDefault: any = {
  priority: Number.MAX_VALUE,
  state: 'todo',
  title: ''
};

export function getField(id: string, field: string, items: any) {
  if (
    !items[id] ||
    !items[id].originalFields ||
    !items[id].originalFields[field] ||
    !items[id].originalFields[field].value
  ) {
    return fieldDefault[field] || undefined;
  }
  return items[id].originalFields[field].value;
}

export function getState(id: string, items: any) {
  return getField(id, 'state', items);
}

export function getTitle(id: string, items: any): string {
  return getField(id, 'title', items);
}

export function common(a: string, b: string): string[] {
  const aa = a.split('_');
  const ba = b.split('_');
  let com = [];
  const len = Math.min(aa.length, ba.length);
  let i = 0;
  for (; i < len; i++) {
    if (aa[i] === ba[i]) {
      com.push(aa[i]);
    } else {
      break;
    }
  }
  return [com.join('_'), i === 0 ? '' : aa[i - 1], aa[i], ba[i]];
}

export function fillInPrioritiesOfAParent(
  parentId: ItemId | undefined,
  itemsMeta: any,
  viewedItemList: ItemId[],
  items: any,
  actions: Actions
) {
  const children = parentId
    ? itemsMeta[parentId].viewedChildren
    : viewedItemList;
  let highest = 0;
  for (let child of children) {
    if (getPriority(child, items) < Number.MAX_VALUE) {
      highest = getPriority(child, items);
    } else {
      highest += Math.pow(2, 20);
      actions.changeItem(child, 'priority', undefined, highest);
    }
  }
  return highest;
}

export function getContrastColor(hexcolor: string) {
  if (!hexcolor || hexcolor.length < 7) return '#ffffff';

  var r = parseInt(hexcolor.substr(1, 2), 16);
  var g = parseInt(hexcolor.substr(3, 2), 16);
  var b = parseInt(hexcolor.substr(5, 2), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
}

export function getRandomColor() {
  return (
    '#' +
    Math.random()
      .toString(16)
      .substr(2, 6)
  );
}
