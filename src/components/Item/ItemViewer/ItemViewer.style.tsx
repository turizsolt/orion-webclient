import { style } from 'typestyle';

export const itemStyle = style({
  borderRadius: '20px',
  backgroundColor: '#87b6b8',
  marginBottom: '5px'
});

export const headerStyle = style({
  padding: '5px',
  borderRadius: '20px',
  backgroundColor: '#bcd2d3',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '18px'
});

export const childrenStyleDynamic = (hide: boolean) => {
  return {
    display: hide ? 'none' : 'block'
  };
};

export const childrenStyle = style({
  marginLeft: '20px',
  marginBottom: '5px'
});

export const propsStyle = style({
  padding: '5px',
  fontSize: '14px'
});

export const headerButtonStyle = style({
  marginLeft: '5px'
});
