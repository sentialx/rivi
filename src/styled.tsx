import * as Rivi from './rivi';

class Styled extends Rivi.Component {
  component: any;
  callback: (props: any) => any;
  hoverCallback: (props: any) => any;
  hoverable: boolean;

  onMouseEnter = () => {
    this.setState({ hovered: true });
  };

  onMouseLeave = () => {
    this.setState({ hovered: false });
  };

  render(props: any, { hovered }: any) {
    const baseStyle = this.callback(props);

    const style = hovered
      ? { ...baseStyle, ...this.hoverCallback(props) }
      : baseStyle;

    return (
      <this.component
        style={style}
        onMouseEnter={this.hoverable && this.onMouseEnter}
        onMouseLeave={this.hoverable && this.onMouseLeave}
      >
        {props.children}
      </this.component>
    );
  }
}

class StyledProxy {
  hover(cb: (props?: any) => any) {}
}

export function div(callback: (props?: any) => any): StyledProxy {
  const s = Styled;
  s.prototype.callback = callback;
  s.prototype.component = 'div';

  ((s as unknown) as StyledProxy).hover = (cb: (props?: any) => any) => {
    s.prototype.hoverCallback = cb;
    s.prototype.hoverable = true;

    return s;
  };

  return (s as unknown) as StyledProxy;
}
