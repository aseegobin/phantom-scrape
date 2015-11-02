var page = require('webpage').create();

// for (i=1; i<2413; i++) {
    var url = 'http://www.inchem.org/documents/jecfa/jeceval/jec_' + 1 + '.htm';
    // console.log(url);
    // page.open(url, function(status) {
    //     console.log("Status: " + status);
    //     if(status === "success") {
    //         // console.log('worked');
    //     }
    // });

    page.open(url, function(status) {
        var title = page.evaluate(function() {
            return document.title;
        });
        console.log('Page title is ' + title);
        phantom.exit();
    });
// }
// phantom.exit();