import { media, style } from 'typestyle';

export const itemStyle = style({
  borderRadius: '20px',
  backgroundColor: '#87b6b8',
  marginBottom: '5px'
});

export const headerStyle = style({
  padding: '5px',
  borderRadius: '20px',
  backgroundColor: '#bcd2d3',
  fontSize: '18px',
  flexDirection: 'column'
});

export const headerFirstRowStyle = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const headerSecondRowStyle = style(
  media(
    { minWidth: 0, maxWidth: 899 },
    {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }
  ),
  media(
    { minWidth: 900 },
    { display: 'none' }
  )
);

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

export const hashtagStyle = style({
  padding: '5px',
  borderRadius: '5px',
  border: '1px solid black',
  marginRight: '5px',
  marginBottom: '5px'
});

export const hashtagWidthStyle = style({
  maxWidth: '160px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  display: 'inline-block',
  verticalAlign: 'middle',
  '&:hover': {
    cursor: 'pointer'
  }
} as any);

export const hashtagRowStyle = style({
  fontSize: '16px',
  display: 'flex',
  minHeight: '1.5em',
  alignItems: 'center'
});

export const hashtagContainerStyle = style({
  padding: '5px 0 5px 0'
});

export const hashtagLabelStyle = style({
  width: '80px',
  minWidth: '80px',
  paddingLeft: '23px'
});

export const hashtagListStyle = style(
  media(
    { minWidth: 0, maxWidth: 899 },
    { display: 'none' }
  ),
  media(
    { minWidth: 900 },
    {
      display: 'flex',
      flexWrap: 'wrap'
    }
  )
);

export const hashtagDetailedListStyle = style(
  {
    display: 'flex',
    flexWrap: 'wrap'
  }
);

export const headerIdStyle = style(
  media(
    { minWidth: 0, maxWidth: 899 },
    { display: 'none' }
  ),
  media(
    { minWidth: 900 },
    {
      display: 'block'
    }
  )
);

export const hashtagListSecondRowStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  fontSize: '12px'
});

export const responsibleCircleStyle = style({
  width: '32px',
  height: '32px',
  border: '1px solid #86b6b8',
  borderRadius: '16px',
  fontSize: '28px',
  textAlign: 'center',
  backgroundColor: '#8c44b3',
  color: 'cornsilk',
  marginRight: '5px'
});

export const linkStyle = style({ textDecoration: 'none', color: 'inherit' });

export const hashtagRibbonStyle = style({ display: 'flex', flexWrap: 'wrap' });
