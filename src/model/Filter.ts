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
}

const transformRuleToFunction = (rule: FilterRule): (items: Record<string, ViewItem>) => (id: string) => boolean => {
    switch (rule.name) {
        case 'noParents':
            return (items: Record<ItemId, ViewItem>) => (x: ItemId) =>
                items[x].parents.length === 0;

        case 'isGiven':
            return (items: Record<ItemId, ViewItem>) => (x: ItemId) =>
                !items[x].originalFields[rule.field as string] ||
                !items[x].originalFields[rule.field as string].value;

        case 'isNot':
            return (items: Record<ItemId, ViewItem>) => (x: ItemId) =>
                !items[x].originalFields[rule.field as string] ||
                items[x].originalFields[rule.field as string].value !== rule.value;

        case 'hashtag':
            const id = rule.hashtagInfo ? rule.hashtagInfo.id : '';
            return (items: Record<ItemId, ViewItem>) => (x: ItemId) =>
                items[x].hashtags.some(hash => hash.id === id);

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
