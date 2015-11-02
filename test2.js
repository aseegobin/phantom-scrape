var fs = require('fs');
var users = [];

for (i = 1; i < 13; i++) {
    users.push(i);
}

var CSVoutput = 'name,fema,adi,comments,report\n';


function follow(user, callback) {
    var page = require('webpage').create();
    page.open('http://www.inchem.org/documents/jecfa/jeceval/jec_' + user + '.htm', function (status) {
        if (status === 'fail') {
            console.log(user + ': ?');
        } else {
            var allData = page.evaluate(function () {
                var data = {
                    chemicalName: '',
                    FEMA: '',
                    ADI: '',
                    comments: '',
                    report: ''

                };
                var table = document.querySelectorAll('tbody tr');

                for (i = 0; i < table.length; i++) {
                    var text = table[i].innerText;
                    if (text.indexOf('ADI:') !== -1) {
                        data.ADI = text.replace('ADI:\t', '');
                    }
                    if (text.indexOf('FEMA No.:') !== -1) {
                        data.FEMA = text.replace('FEMA No.:\t', '');
                    }
                    if (text.indexOf('Comments:') !== -1) {
                        data.comments = text.replace('Comments:\t', '');
                    }
                    if (text.indexOf('Report:') !== -1) {
                        data.report = text.replace('Report:\t', '') + '\n';
                    }
                }
                data.chemicalName = table[0].innerText;
                return data;
            });
            CSVoutput += [allData.chemicalName, allData.FEMA, allData.ADI, allData.comments, allData.report];
        }
        
        page.close();
        callback.apply();
    });
}

function process() {
    var path = 'output.csv';
    if (users.length > 0) {
        var user = users[0];
        users.splice(0, 1);
        follow(user, process);
    } else {
        fs.write(path, CSVoutput, 'w');
        phantom.exit();
    }
}

function getChemical() {
    document.querySelector('tbody tr').innerText;
}

process();