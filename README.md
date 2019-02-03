# Rivi
`Rivi` is a much faster alternative to React which relies on DOM instead of Virtual DOM to achieve maximum performance.

# Why?
React is a great framework for building complex UI with a bunch of components, but it has also some cons. 
The main weakness of React is the performance, and that's why Rivi was created. Calling `setState` in your components 
doesn't unnecessarily re-render all of your components, but instead it just modifies the actual DOM without doing any 
advanced diffing algorithms on Virtual DOM. This library gave me the ability to make really smooth tabs system in 
[Wexond](https://github.com/wexond/wexond) using the same beautiful syntax as in React without sacrificing performance.

# Installation
```bash
$ npm install rivi
```

# Quick example
It doesn't differ from React that much, except these changes:
- `componentDidMount` is now called `onRender`
- There's no `shouldComponentUpdate` since there's no need to worry if your app is doing any unnecessary re-renders somewhere.

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
