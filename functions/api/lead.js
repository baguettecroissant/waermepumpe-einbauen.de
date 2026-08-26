import { createLeadHandlers } from '../_lib/taptaphome-direct.js';

const handlers = createLeadHandlers({
  site: 'waermepumpe-einbauen.de',
  mode: 'heat_pump',
  defaultHeatPumpType: 'Luft-Wasser-Wärmepumpe'
});

export const onRequestGet = handlers.onRequestGet;
export const onRequestOptions = handlers.onRequestOptions;
export const onRequestPost = handlers.onRequestPost;
