# Rivi
`Rivi` is a much lighter alternative to React which relies on DOM instead of Virtual DOM.

# Why?
React is a great framework for building complex UI with a bunch of components, but it has also some cons. 
The main weakness of React is the bundle size, and that's why Rivi was created. Rivi is a really small library with all the basic features of React, like `setState`. It also has built-in similar API to styled-components, but much lighter and based on the inline styles. If you want a global store for your app, there is no need to worry since this library has @reactive decorators like the @observable decorator in MobX.

# Installation
```bash
$ npm install rivi
```

# Features
- A basic and fast `setState`, but without mapping arrays in `render`.
- Props and state are passed to the `render` function, so you can destructure them cleanly:
  ```jsx
  render({ visible }, { hovered }) { ... }
  ```
- Built-in styled-components like API, but based on inline styles. Example:
  ```js
  import { styled } from 'rivi';
  
  const Button = styled
    .div(props => {
      display: props.visible ? 'block' : 'none'
    })
    .hover(props => {
      backgroundColor: 'blue'
    });
  ```
- Built-in MobX like stores. Example:
  ```js
  import { reactive } from 'rivi';
  
  class Store {
    @reactive visible = false;
  }
  ```
  
# Changes
It doesn't differ from React that much, except these changes:
- `componentDidMount` is now called `onRender`
- There's no `shouldComponentUpdate` since there's no need to worry if your app is doing any unnecessary re-renders somewhere.
- `setState` doesn't support arrays, just add components using refs:
  ```jsx
  onRender() {
    this.div.appendChild(<SomeComponent />)
  }
  ...
  render() {
    return (
      <div ref={r => (this.div = r) />
    );
  }
  ```

# Quick example
Here's the code of an example component:
```jsx
import Rivi from "rivi";

class App extends Rivi.Component {
  state = {
    visible: false
  };

  onRender() {
    setTimeout(() => {
      this.setState({ visible: true });
    }, 5000);
  }

  render() {
    return (
      <div ref={r => (this.rootRef = r)} style={`display: ${this.state.visible ? 'block' : 'none'}`}>
        Now you can see me!
      </div>
    );
  }
}

Rivi.render(<App />, document.getElementById("app"));
```
The above example creates a component that shows `Now you can see me!` after 5 seconds using `setState`.

# Projects using Rivi
You can create a pull request to add your own project to this list.
- [Wexond](https://github.com/wexond/wexond)
