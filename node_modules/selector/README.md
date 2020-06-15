<h1 align="center">Welcome to selector 👋</h1>

<p>Generic selector library in Typescript</p>

<p>
  <a href="https://www.npmjs.com/package/selector" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/selector.svg">
  </a>
  <img alt="Commit Activity" src="https://img.shields.io/github/commit-activity/m/arnaud-zg/selector" />
  <a href="https://travis-ci.org/arnaud-zg/selector" target="_blank">
    <img alt="Build Status" src="https://travis-ci.org/arnaud-zg/selector.svg?branch=develop" />
  </a>
  <a href="https://bundlephobia.com/result?p=selector" target="_blank">
    <img alt="Bundle Size" src="https://badgen.net/bundlephobia/min/selector" />
  </a>
</p>

### Installing

Using npm:

```shell
npm i --save selector
```

Using yarn:

```shell
yarn add --dev selector
```

## Usage

Here are examples of how you can use `selector`.

### createSelector

> Return a selector helper

#### Examples

##### Get first item

```ts
const data = ['John']
const getFirstItemSelector = createSelector(0)
const item = getFirstItemSelector(data)
console.log(item) // It'll display 'John'
```

##### Get first item's name

```ts
const data = { item: { name: 'Television', isActive: true } }
const selector = createSelector('item', 'name')
const itemName = selector(data)
console.log(itemName) // It'll display 'Television'
```

##### Get first item active

```ts
const data = {
  items: [
    {
      name: 'Television',
      isActive: false,
    },
    {
      name: 'Sofa',
      isActive: true,
    },
    {
      name: 'Door',
      isActive: true,
    },
  ],
}
const firstActiveItemSelector = createSelector('items', (items: IItem[]) =>
  items.find((item: IItem) => item.isActive)
)
const item = firstActiveItemSelector(data)
console.log(item) // It'll display '{ "isActive": true, "name": "Sofa" }'
```

##### Select item with path

```ts
const path = 'items.0.name'
const data = { items: [{ name: 'Television', isActive: true }] }
const selector = createSelector(...path.split('.'))
const itemName = selector(data)
console.log(itemName) // It'll display 'Television'
```

## Running the tests

Tests are written with jest

### Unit tests

Using jest:

```shell
yarn run test
```

## Deployment

Deployment is done with Travis.

## Built With

- [TSDX](https://github.com/palmerhq/tsdx) - TSDX

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/arnaud-zg/selector/tags).

## Authors

- **Arnaud Zheng** - _Initial work_ - [arnaud-zg](https://github.com/arnaud-zg)

See also the list of [contributors](https://github.com/arnaud-zg/selector/graphs/contributors) who participated in this project.

## Show your support

Give a ⭐️ if this project helped you!

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
