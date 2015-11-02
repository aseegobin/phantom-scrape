var fs = require('fs');
var users = [];
var oldPercent = 0;
var totalPages = 2412;

for (i = 1; i < totalPages; i++) {
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

                for (i = 1; i < table.length; i++) {
                    var text = table[i].innerText;
                    if (text.indexOf('ADI:') !== -1) {
                        data.ADI = '\"'+ text.replace('ADI:\t', '')+'\"';
                    }
                    if (text.indexOf('FEMA No.:') !== -1) {
                        data.FEMA = '\"'+ text.replace('FEMA No.:\t', '')+'\"';
                    }
                    if (text.indexOf('Comments:') !== -1) {
                        data.comments = '\"'+ text.replace('Comments:\t', '')+'\"';
                    }
                    if (text.indexOf('Report:') !== -1) {
                        data.report = '\"'+ text.replace('Report:\t', '') + '\"';
                    }
                }
                data.chemicalName = '\"' + table[0].innerText + '\"';
                return data;
            });
            CSVoutput += [allData.chemicalName, allData.FEMA, allData.ADI, allData.comments, allData.report + '\n'];
        }
        
        page.close();
        callback.apply();
    });
}

function process() {
    var path = 'output.csv';
    if (users.length > 0) {
        getProgress(users.length);
        var user = users[0];
        users.splice(0, 1);
        follow(user, process);
    } else {
        fs.write(path, CSVoutput, 'w');
        phantom.exit();
    }
}

function getProgress(whereUAt) {
    var percent = parseInt(((totalPages - whereUAt)/totalPages * 100).toFixed(0));
    if (percent > oldPercent) {
        if (percent % 5 === 0) {
            console.log(percent, '%');
            oldPercent = percent;
        }
    }
}

process();