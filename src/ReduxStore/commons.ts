import { ItemId } from '../model/Item/ItemId';
import { Actions } from '../LocalStore/Actions';

export function getPriority(c: string, items: any) {
  if (
    !items[c] ||
    !items[c].originalFields ||
    !items[c].originalFields.priority ||
    !items[c].originalFields.priority.value
  ) {
    return Number.MAX_VALUE;
  }
  return parseInt(items[c].originalFields.priority.value, 10);
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
