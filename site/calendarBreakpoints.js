// lib/tailwind.js
import { create } from 'twrnc';

// create the customized version...
const cw = create(require('./CalendarBreakpoints.Config.js'));
// tailwind.config.js
module.exports = {
    theme: {
      screens: {
        sm: '380px',
        md: '420px',
        lg: '680px',
      },
    },
  };
export default cw;