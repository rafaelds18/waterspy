const env = require('./env.json');

exports.configs = () => {
    const node_env = process.env.NODE_ENV || 'dev';
    const env = require(`./env.${node_env.trim()}.json`);
    return env;
}