import React from 'react';
declare type Item = {
    title: string;
    description: string;
};
interface ListItemProps {
    item: Item;
}
export declare const ListItem: React.FC<ListItemProps>;
interface ListProps {
    items: Item[];
}
export declare const List: React.FC<ListProps>;
export {};
