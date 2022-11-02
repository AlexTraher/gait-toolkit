"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const undici_1 = require("undici");
const createOrGetAgent = (() => {
    let agent;
    return () => {
        if (agent) {
            return agent;
        }
        agent = new undici_1.MockAgent();
        agent.disableNetConnect();
        (0, undici_1.setGlobalDispatcher)(agent);
        return agent;
    };
})();
function handler(req, res) {
    const { basePath, response, ...config } = JSON.parse(req.body);
    const agent = createOrGetAgent();
    const client = agent.get(basePath);
    client
        .intercept(config)
        .reply(response.statusCode, response.data);
    res.status(200).json({ message: 'ok' });
}
exports.default = handler;
