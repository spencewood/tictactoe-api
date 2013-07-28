module.exports = {
    isDevelopment: process.env.NODE_ENV !== 'production',
    port: process.env.PORT || 5000,
    database: {
        url: process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            'mongodb://localhost/TicTacToe'
    },
    pubnub: {
        subscribe_key: process.env.PUBNUB_SUBSCRIBE_KEY || 'demo',
        publish_key: process.env.PUBNUB_PUBLISH_KEY || 'demo'
    },

    /**
     * Cross-origin allowed domains
     */
    allowedDomains: [
        'http://localhost:8000'
    ]
};