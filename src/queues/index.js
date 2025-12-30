import MatcherWorker from './matcher/matcher-worker.js';

export const initWorkers = () => {
    MatcherWorker.setup();
    // EmailWorker.setup();
    console.log('👷 All background workers initialized.');
};

initWorkers();