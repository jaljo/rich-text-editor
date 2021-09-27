# Rich Text editor

:warning: __This repository is NOT production ready and is no longer maintained.__

It has been created on the sole purpose to illustrate the technical aspects of
[this article](https://knplabs.com/fr/blog/how-we-built-a-medium-like-rich-text-editor),
which has been published in january 2019. At the time the article was written,
this editor was still at experimental state. Therefore, lots of bugs and side
effects are still to be fixed.

Some features have been disabled, and need to be fixed:
- tweet insertion
- brightcove video insertion

You can still build the projet and run it localy to test the editing features :)

## Installation

You will need docker and docker-compose to run this project on your local env.

```
$ git clone git@github.com:jaljo/rich-text-editor.git
$ cd rich-text-editor
$ make dev
```

You can now access the project by browsing [localhost:5000/](http://localhost:5000/)

## Tests

To run the tests localy:

```
$ make test
```
