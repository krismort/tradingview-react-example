

module.exports = function(app, path='') {
    const UDF = require('./udf')
    const udf = new UDF()

    // Common

    const query = require('./query')

    function handlePromise(res, next, promise) {
        promise.then(result => {
            res.send(result)
        }).catch(err => {
            next(err)
        })
    }

    // Endpoints

    app.all( path + '/', (req, res) => {
        // console.log('/');
        res.set('Content-Type', 'text/plain').send('Welcome to the Binance UDF Adapter for TradingView. See ./config for more details.')
    })

    app.get( path + '/time', (req, res) => {
        // console.log('/time');
        const time = Math.floor(Date.now() / 1000)  // In seconds
        res.set('Content-Type', 'text/plain').send(time.toString())
    })

    app.get( path + '/config', (req, res, next) => {
        // console.log('/config');
        handlePromise(res, next, udf.config())
    })

    app.get('/symbol_info', (req, res, next) => {
        // console.log('/symbol_info');
        handlePromise(res, next, udf.symbolInfo())
    })

    app.get( path + '/symbols', [query.symbol], (req, res, next) => {
        // console.log('/symbols');
        handlePromise(res, next, udf.symbol(req.query.symbol))
    })

    app.get( path + '/search', [query.query, query.limit], (req, res, next) => {
        // console.log('/search');
        if (req.query.type === '') {
            req.query.type = null
        }
        if (req.query.exchange === '') {
            req.query.exchange = null
        }

        handlePromise(res, next, udf.search(
            req.query.query,
            req.query.type,
            req.query.exchange,
            req.query.limit
        ))
    })

    app.get( path + '/history', [
        query.symbol,
        query.from,
        query.to,
        query.resolution
    ], (req, res, next) => {
        // console.log('/history');
        handlePromise(res, next, udf.history(
            req.query.symbol,
            req.query.from,
            req.query.to,
            req.query.resolution
        ))
    })

    // Handle errors

    app.use((err, req, res, next) => {
        if (err instanceof query.Error) {
            return res.status(err.status).send({
                s: 'error',
                errmsg: err.message
            })
        }

        if (err instanceof UDF.SymbolNotFound) {
            return res.status(404).send({
                s: 'error',
                errmsg: 'Symbol Not Found'
            })
        }
        if (err instanceof UDF.InvalidResolution) {
            return res.status(400).send({
                s: 'error',
                errmsg: 'Invalid Resolution'
            })
        }

        console.error(err)
        res.status(500).send({
            s: 'error',
            errmsg: 'Internal Error'
        })
    })

}
