class Context {
  public Provider: Component;
}

export const createContext = () => {
  const ctx = new Context();
  ctx.Provider = new Component();
  return ctx;
};

export const forwardRef = () => {};

export const findDOMNode = (a: any) => {
  return a.root;
};

export const updateElement = (
  name: any,
  props: any = null,
  ...children: any[]
) => {
  if (typeof name === 'function') {
    const component = new name();
    component.props = props;
    if (component.props) {
      component.props.children = children;
    }

    return component.render();
  }

  const element: any = {
    attributes: {},
    children: [],
  };

  if (props) {
    for (const key in props) {
      if (key === 'className') {
        element.attributes['class'] = props[key];
      } else if (!key.startsWith('on') && key !== 'ref') {
        element.attributes[key] = props[key];
      }
    }
  }

  for (const child of children) {
    if (child instanceof Array) {
      for (const c of child) {
        element.children.push(c);
      }
    } else if (typeof child === 'object') {
      element.children.push(child);
    }
  }

  return element;
};

export let createElement = (
  name: any,
  props: any = null,
  ...children: any[]
) => {
  if (typeof name === 'function') {
    const component = new name();
    component.props = props;

    if (component.props) {
      component.props.children = children;

      if (typeof props['ref'] === 'function') {
        props['ref'](component);
      }
    }

    return component;
  }

  const element = document.createElement(name);

  for (const child of children) {
    if (typeof child === 'string') {
      const text = document.createTextNode(child);
      element.appendChild(text);
    } else if (child instanceof HTMLElement) {
      element.appendChild(child);
    } else if (child instanceof Component) {
      element.appendChild(child._render());
    } else if (child instanceof Array) {
      for (const c of child) {
        element.appendChild(c);
      }
    }
  }

  if (props) {
    for (const key in props) {
      if (key === 'className') {
        element.setAttribute('class', props[key]);
      } else if (key === 'ref') {
        props[key](element);
      } else if (key.startsWith('on')) {
        (element as any)[key.toLowerCase()] = props[key];
      } else {
        element.setAttribute(key, props[key]);
      }
    }
  }

  return element;
};

export const render = (type: any, dest: HTMLElement) => {
  dest.appendChild(type._render());
};

export class Component {
  public root: HTMLElement;
  public state: any;

  public setState(newState: any) {
    this.state = { ...newState };

    const c = createElement.bind({});

    createElement = (name: string, props: any, ...children: any[]) => {
      return updateElement(name, props, ...children);
    };

    const newTree = this.render();

    this.updateAttributes(newTree, this.root);

    createElement = c;
  }

  public updateAttributes(obj: any, dom: HTMLElement) {
    for (const attr in obj.attributes) {
      dom.setAttribute(attr, obj.attributes[attr]);
    }

    for (let i = 0; i < obj.children.length; i++) {
      if (dom.childNodes[i] && obj.children[i]) {
        this.updateAttributes(obj.children[i], dom.children[i] as HTMLElement);
      }
    }
  }

  public _render() {
    this.root = this.render();

    this.onRender();

    return this.root;
  }

  public render(): HTMLElement {
    return null;
  }

  public onRender() {}
}
