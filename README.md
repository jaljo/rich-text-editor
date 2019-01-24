# KNP Text editor

A POC of a rich text editor based on javascript native API.

## Installation

With docker:

```
$ git clone git@github.com:jaljo/rich-text-editor.git
$ cd rich-text-editor
```

Launch the frontend development server (using swarm):

```
$ make dev
```

Launch the frontend test daemon:

```
$ make test-dev
```

## What is inside ?

This is a non exhaustive list of libraries used for various purpose:

- [`ramda`](http://ramdajs.com/docs/): Provide various functional helpers.
- [`redux`](https://redux.js.org/): Handle state changement.
- [`redux-observable`](https://redux-observable.js.org/): Provide scalable and
  reactive tools in order to handle state changement side effects.
- [`rxjs`](http://reactivex.io/rxjs/manual/index.html): Used by `redux-observable`.
- [`sass`](http://sass-lang.com/): An extension of css.
