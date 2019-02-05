let entry: Component;

const jsToCss = (style: any) => {
  let str = '';
  for (const key in style) {
    let newKey = '';
    let value: string = style[key].toString();

    for (let i = 0; i < key.length; i++) {
      if (key[i] === key[i].toUpperCase()) {
        newKey += `-${key[i].toLowerCase()}`;
      } else {
        newKey += key[i];
      }
    }

    if (typeof style[key] === 'number') {
      value += 'px';
    }

    str += `${newKey}:${value};`;
  }
  return str;
};

export function reactive(target: any, key: string) {
  let val = target[key];

  const e = {
    get() {
      console.log(e.get.caller);

      return val;
    },
    set(value: any) {
      val = value;

      if (entry) {
        entry.forceUpdate();
      }
    },
    configurable: true,
    enumerable: true,
  };

  Object.defineProperty(target, key, e);
}

export const updateElement = (
  name: any,
  props: any = null,
  ...children: any[]
) => {
  if (typeof name === 'function') {
    const component = new name();
    component.props = { ...props };

    component.props.children = children;

    const root = component.render(component.props, component.state);

    return root;
  }

  const element: any = {
    attributes: {},
    children: [],
  };

  if (props) {
    for (const key in props) {
      if (key === 'className') {
        element.attributes['class'] = props[key];
      } else if (key === 'style' && typeof props[key] === 'object') {
        element.attributes[key] = jsToCss(props[key]);
      } else if (key.startsWith('on')) {
        element[key.toLowerCase()] = props[key];
      } else if (key !== 'ref') {
        element.attributes[key] = props[key];
      }
    }
  }

  for (const child of children) {
    if (child instanceof Array) {
      for (const c of child) {
        element.children.push(c);
      }
    } else if (typeof child === 'number') {
      element.children.push(child.toString());
    } else {
      element.children.push(child);
    }
  }

  return element;
};

const _createElement = (name: any, props: any = null, ...children: any[]) => {
  if (typeof name === 'function') {
    const component = new name();
    component.props = { ...props };

    component.props.children = children;

    if (typeof component.props['ref'] === 'function') {
      component.props['ref'](component);
    }

    if (!entry) {
      entry = component;
    }

    return component._render();
  }

  const element = document.createElement(name);

  for (const child of children) {
    if (typeof child === 'string' || typeof child === 'number') {
      const text = document.createTextNode(child.toString());
      element.appendChild(text);
    } else if (child instanceof HTMLElement) {
      element.appendChild(child);
    } else if (child instanceof Component) {
      element.appendChild(child._render());
    } else if (child instanceof Array) {
      for (const c of child) {
        if (typeof c === 'string' || typeof c === 'number') {
          element.textContent = c.toString();
        } else {
          element.appendChild(c);
        }
      }
    }
  }

  if (props) {
    element._key = props.key;
    for (const key in props) {
      if (key === 'className') {
        element.setAttribute('class', props[key]);
      } else if (key === 'ref') {
        props[key](element);
      } else if (key.startsWith('on')) {
        (element as any)[key.toLowerCase()] = props[key];
      } else if (key === 'style' && typeof props[key] === 'object') {
        element.setAttribute(key, jsToCss(props[key]));
      } else {
        element.setAttribute(key, props[key]);
      }
    }
  }

  return element;
};

export let createElement = _createElement.bind({});

export const render = (type: any, dest: HTMLElement) => {
  dest.appendChild(type);
};

export class Component {
  public root: any;
  public state: any = {};
  public props: any = {};

  public setState(newState: any) {
    this.state = { ...this.state, ...newState };
    this.forceUpdate();
  }

  public forceUpdate() {
    createElement = updateElement;
    const newTree = this.render(this.props, this.state);
    createElement = _createElement;

    this.updateAttributes(newTree, this.root);
  }

  public updateAttributes(obj: any, dom: any) {
    if (typeof obj === 'object') {
      for (const attr in obj.attributes) {
        dom.setAttribute(attr, obj.attributes[attr]);
      }

      for (let i = 0; i < obj.children.length; i++) {
        if (dom.childNodes[i] && obj.children[i]) {
          this.updateAttributes(obj.children[i], dom.childNodes[i]);
        }
      }
    } else if (typeof obj === 'string' && dom.textContent !== obj) {
      dom.textContent = obj;
    }
  }

  public _render() {
    this.root = this.render(this.props, this.state);
    this.onRender();

    return this.root;
  }

  public render(props?: any, state?: any): any {
    return null;
  }

  public onRender() {}
}
