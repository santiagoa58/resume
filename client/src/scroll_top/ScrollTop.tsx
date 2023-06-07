import React, { FC } from 'react';
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box, { BoxProps } from '@mui/material/Box';

interface IScrollTopProps extends BoxProps {
  // ref to the element that will be scrolled to
  anchorRef: React.RefObject<HTMLElement>;
}

export const scrollToElement = (anchorRef: React.RefObject<HTMLElement>) => {
  if (anchorRef.current) {
    anchorRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }
};

const ScrollTop: FC<IScrollTopProps> = ({ anchorRef, ...props }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  return (
    <Zoom in={trigger}>
      <Box
        onClick={() => scrollToElement(anchorRef)}
        position="fixed"
        bottom={16}
        right={16}
        {...props}
      >
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Zoom>
  );
};

export default ScrollTop;
