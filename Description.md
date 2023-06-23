# The concept

Orion is basically a graph, like the stars on the night sky. Shining things with made up connections. In Orion everything is an Item, a Field, a Relation or a Transaction/Change.

## Item

An item can be everything. It is the base thing. A todo is an item, a calendar appointment is an item, a tag is an item. It is the basic brick of the whole system.

## Field

Every item can contain fields. It is a property of the item. Eg. deadline can be a field. Or a state that is it done or still todo? Every field belongs to a single item. Fields can be chosen from premade types.

## Relation

A relation is a defined relation between two items. It can be one of the following relations at the moment:

- Child/Parent
- Hash/HashOf
- Responsible/ResponsibleOf
- TemplateTemplateOf
- Generated/GeneratedBy
- Copied/CopiedFrom

See details in [the source](src/model/Relation/RelationType.ts)

## Transaction/Change

Is a change in the data. It can be sent to the server, act as a log, and it can be put in a waiting queue when working in offline mode. Transaction is a set of changes that should be handled together.



# Available views

## /

The rootview where every item is listed. You can filter the items or search in them.

## /:id

One particular item is listed with the given :id.

## /sprint/:id

This view lists all items that are in a Hash relation with the item, that has id :id. Also it divides these items into four columns based on their state (todo, doing, done, rejected).

So in order to use the sprint view, you have to create a specific hashtag, tag all the items you want to see in this view, and then open it. Moving between the columns should automatically update the state of the item.

## /panels/:panelsId

On the rootview you can define any number of panels with predefined filters. You can also save them for later with a string :panelsId. You can load the same panels with the same predined filters any time now.



#Hashtag

Just fill in the hashtag box in the details of the item, if the hashtag is not exist yet, it will create automatically. Also if the view is filtered by a specific hashtag a newly added item automatically gets that hashtag as well.

#Generators

Generator is a specific item. Its purpose is to automatically create an item again and again when a specific condition is met. There are two type of generators explained later.

In both cases you should set an array as a stringified JSON. Each element in that array must be either {"weekday": number} or {"day": number} where number is 0 for sunday and 1 for monday and so on or number is the day of the month. You can mix and match any combinations into the array.

Eg. [{"weekday": 1}, {"day": 1}, {"day": 16}] will activate the generator on every Monday and every 1st and 16th day of the month. If one of those day is also a Monday, it will take effect only once.

## Simple generator

A simple generator is a single item without any dependencies. When the condition in the "simpleGenerator" field is met this item's status is set back to todo. So eg. hence you set it as done, it will appear again amongst the todos.

## (Complex) generator

In a complex generator it will check the "generator" field. Also you may set a "template" relation to this generator. When the generator condition is met, it will create a copy of the template and duplicate it. If multiple templates are related to the generator all of them will be duplicated individually.

The duplicate will have relations to the generator (generatedBy) and the template (copiedFrom).

[TODO] It is unknown that either it is a shallow or a deep copy. I suspect shallow.



# How updating over the network works


# Known shortcomings, that needs to be optimised

- Items does not load when not online, when online they load to late
