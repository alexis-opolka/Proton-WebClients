import { store } from 'proton-pass-web/app/Store/store';

import { createMonitorService } from '@proton/pass/lib/monitor/service';

import { core } from './core';

export const monitor = createMonitorService(core, store);
