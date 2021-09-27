# Rich Text editor

This repository has been created on the sole purpose to illustrate the technical
aspects of
[this article](https://knplabs.com/fr/blog/how-we-built-a-medium-like-rich-text-editor).

:warning: __It is no longer maintained.__

At the moment, a few things have to be fixed:
- The tweet insertion no longer works
- The brightcove video insertion no longer works

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
