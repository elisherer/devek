const Environment = require('jest-environment-jsdom');
const { TextEncoder, TextDecoder } = require('util');

class CustomTestEnvironment extends Environment {
    async setup() {
        await super.setup();
        if (typeof this.global.TextEncoder === 'undefined') {
            this.global.TextEncoder = TextEncoder;
        }
        if (typeof this.global.TextDecoder === 'undefined') {
            this.global.TextDecoder = TextDecoder;
        }
    }
}

module.exports = CustomTestEnvironment;