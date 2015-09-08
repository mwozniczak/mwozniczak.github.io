// based on https://github.com/ariya/phantomjs/blob/master/examples/rasterize.js
// I mean, as if the name wasn't obvious enough

commons = require('../../common_names');

var page = require('webpage').create(),
    system = require('system'),
    address, output, size;


address = 'http://127.0.0.1:' + commons.devserverPort;
page.paperSize = {
    format: 'A4',
    orientation: 'portrait',
    margin: '1cm'
};

page.open(address, function(status) {
    if (status !== 'success') {
        console.log('Unable to load the address!');
        phantom.exit(1);
    } else {
        return page.render('cv.pdf');
        console.log(page);
        phantom.exit();
    }
});