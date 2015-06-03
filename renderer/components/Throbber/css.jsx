let Radium = require('radium');

let keyframes = Radium.keyframes({
  [`${(100 / 8) * 1}%`]: { transform: 'rotate(45deg)' },
  [`${(100 / 8) * 2}%`]: { transform: 'rotate(90deg)' },
  [`${(100 / 8) * 3}%`]: { transform: 'rotate(135deg)' },
  [`${(100 / 8) * 4}%`]: { transform: 'rotate(180deg)' },
  [`${(100 / 8) * 5}%`]: { transform: 'rotate(225deg)' },
  [`${(100 / 8) * 6}%`]: { transform: 'rotate(270deg)' },
  [`${(100 / 8) * 7}%`]: { transform: 'rotate(315deg)' },
  [`${(100 / 8) * 8}%`]: { transform: 'rotate(360deg)' },
});

module.exports = {

  section: {
  },

  div: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    left: 0,
    minHeight: '100%',
    minWidth: '100%',
    position: 'fixed',
    top: 0,
    zIndex: 10000,
  },

  img: {
    animation: `${keyframes} 1.1s steps(1, start) 0s infinite`,
    bottom: 0,
    left: 0,
    margin: 'auto',
    position: 'fixed',
    right: 0,
    top: 0,
  },

};
