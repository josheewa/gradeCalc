'use strict';

var markingPeriod, className, letterGrade, percent, num;
var names = [], categories = [], scores = [];

document.body.addEventListener('keyup', function (e) {if (e.key === 'Escape'){document.getElementById('alertContainer').innerHTML = '';}});
document.getElementById('field').addEventListener('keypress', function (e) {if (e.key === 'Enter'){parse();}});

function parse() {

    const text = document.getElementById('field').value;
    document.getElementById('field').value = '';
    let header = text.substring(text.search("MP"), text.search("\nAssignments\n")).split("\n");
    let data = text.substring(text.search("\nAssignments\n") + 15, text.search("Totals")).split("\n");
    
    className = header[1];
    // letterGrade = header[2];
    percent = header[3];

    let grade = +percent.substring(0, percent.length-1)
    num = (data.length - 1) / 5;

    if (grade >= 89.5) { letterGrade = 'A'; }
    else if (grade >= 79.5) { letterGrade = 'B'; }
    else if (grade >= 69.5) { letterGrade = 'C'; }
    else if (grade >= 59.5) { letterGrade = 'D'; }
    else { letterGrade = 'E'; }

    if (header.length < 4 || num < 1) { return invalidInput(); }
    
    for (let i = 0; i < data.length-1; i += 5) {
        
        names.push(data[i + 1]);
        
        let category = data[i + 2].substring(0, 1);
        categories.push(category);
        
        let raw = data[i + 3].split(" out of ");
        
        if (data[i + 3] == 'Not Graded') { var arr = [0, 0]; }
        else { var arr = [+raw[0], +raw[1]]; }
        
        scores.push(arr);
    }
    
    sessionStorage.setItem('className', className);
    sessionStorage.setItem('letterGrd', letterGrade);
    sessionStorage.setItem('percent', percent);
    sessionStorage.setItem('num', num);
    sessionStorage.setItem('names', names);
    sessionStorage.setItem('categories', categories);
    sessionStorage.setItem('scores', scores);

    window.location.href = 'grades.html';
}

function invalidInput() {
    const cont = document.getElementById('alertContainer');
    cont.style.display = 'block';
    cont.innerHTML = "<div class=\"alert\"><span onclick=\"this.parentElement.style.display='none';\" class=\"closebtn\">&times;</span>Invalid input; Please Try Again.</div>";
}
