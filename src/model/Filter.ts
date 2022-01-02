import { ItemId } from './Item/ItemId';
import { HashtagInfo, ViewItem } from './Item/ViewItem';

export interface Filter {
    id: string;
    name: string;
    f: (items: Record<ItemId, ViewItem>) => (id: ItemId) => boolean;
    rule: FilterRule;
    on: boolean;
    hashtag?: HashtagInfo;
}

export interface FilterRule {
    name: string;
    field?: string;
    value?: any;
    hashtagInfo?: HashtagInfo;
    start?: Date;
    end?: Date;
    startDay?: number;
    endDay?: number;
}

const transformRuleToFunction = (rule: FilterRule): (items: Record<string, ViewItem>) => (id: string) => boolean => {
    switch (rule.name) {
        case 'noParents':
            return (items: Record<ItemId, ViewItem>) => (x: ItemId) =>
                items[x].parents.length === 0;

        case 'isNotGiven':
            return (items: Record<ItemId, ViewItem>) => (x: ItemId) =>
                !items[x].originalFields[rule.field as string] ||
                !items[x].originalFields[rule.field as string].value;

        case 'isGiven':
            return (items: Record<ItemId, ViewItem>) => (x: ItemId) =>
                items[x].originalFields[rule.field as string] &&
                items[x].originalFields[rule.field as string].value;

        case 'isNot':
            return (items: Record<ItemId, ViewItem>) => (x: ItemId) =>
                !items[x].originalFields[rule.field as string] ||
                items[x].originalFields[rule.field as string].value !== rule.value;

        case 'hashtag':
            const id = rule.hashtagInfo ? rule.hashtagInfo.id : '';
            return (items: Record<ItemId, ViewItem>) => (x: ItemId) =>
                items[x].hashtags.some(hash => hash.id === id);

        case 'during':
            return (items: Record<ItemId, ViewItem>) => (x: ItemId) => items[x].originalFields.due &&
                items[x].originalFields.due.value >= (rule.start as Date) &&
                items[x].originalFields.due.value <= (rule.end as Date);

        case 'days':
            const start: Date = (new Date());
            start.setHours(0, 0, 0, 0);
            start.setDate(start.getDate() + (rule.startDay as number));

            const end: Date = (new Date());
            end.setHours(23, 59, 59, 999);
            end.setDate(end.getDate() + (rule.endDay as number));

            return (items: Record<ItemId, ViewItem>) => (x: ItemId) => items[x].originalFields.due &&
                items[x].originalFields.due.value >= (start as Date).toISOString() &&
                items[x].originalFields.due.value <= (end as Date).toISOString();

        default:
            return () => () => false;
    }
}

export const transformFilter = (filter: Filter): Filter => {
    return {
        ...filter,
        f: transformRuleToFunction(filter.rule)
    };
}
