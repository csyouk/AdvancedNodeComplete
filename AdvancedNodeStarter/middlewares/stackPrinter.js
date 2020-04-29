module.exports = function stackPrinter(req, res, next) {
    console.log('Printing Stack For', req.url);

    function printItem(item, prefix) {
        prefix = prefix || '';

        if (item.route) {
            console.log(prefix, 'Route', item.route.path);
        } else if (item.name === '<anonymous>') {
            console.log(prefix, item.name, item.handle);
        } else {
            console.log(prefix, item.name, item.method ? '(' + item.method.toUpperCase() + ')' : '');
        }

        printSubItems(item, prefix + ' -');
    }

    function printSubItems(item, prefix) {
        if (item.name === 'router') {
            console.log(prefix, 'MATCH', item.regexp);

            if (item.handle.stack) {
                item.handle.stack.forEach(function (subItem) {
                    printItem(subItem, prefix);
                });
            }
        }

        if (item.route && item.route.stack) {
            item.route.stack.forEach(function (subItem) {
                printItem(subItem, prefix);
            });
        }

        if (item.name === 'mounted_app') {
            console.log(prefix, 'MATCH', item.regexp);
        }
    }

    req.app._router.stack.forEach(function (stackItem) {
        printItem(stackItem);
    });

    next();
};