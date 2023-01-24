var markingPeriod, className, letterGrade, percent, num;
var dates = [], names = [], categories = [], scores = [];


function load() {
    markingPeriod = sessionStorage.getItem('markPd');
    className = sessionStorage.getItem('className');
    letterGrade = sessionStorage.getItem('letterGrd');
    percent = sessionStorage.getItem('percent');
    num = sessionStorage.getItem('num');
    names = sessionStorage.getItem('names').split(',');
    categories = sessionStorage.getItem('categories').split(',');
    let temp = sessionStorage.getItem('scores').split(',');

    for (let i = 0; i < temp.length; i+=2) {
        let arr = [temp[i], [temp[i + 1]]]
        scores.push(arr)
    }
    
    displayScores();
}

function displayScores() {

    document.getElementById('grade').innerText = letterGrade + ' ' + percent;
    document.getElementById('quarter').innerText = markingPeriod;
    document.getElementById('className').innerText = className;

    for (let i = 0; i < num; i++) {

        let nodes = Array.from({ length: 3 }, () => (document.createElement("div")));

        nodes[0].innerText = names[i];

        let letter = categories[i];
        nodes[1].innerText = letter;

        let numerator = document.createElement('input');
        numerator.type = 'number';
        numerator.value = scores[i][0];
        numerator.addEventListener('input', (event) => {
            if (letter == 'P') {
                scores[i][0] = +event.target.value;
            } else if (letter == 'A') {
                scores[i][0] = +event.target.value;
            }
            calculateFinal();
            document.getElementById('grade').innerText = letterGrade + ' ' + percent;
        })

        let slash = document.createElement('span');
        slash.innerText = " / ";

        let denominator = document.createElement('input');
        denominator.type = 'number';
        denominator.value = scores[i][1];
        denominator.addEventListener('input', (event) => {
            if (letter == 'P') {
                scores[i][1] = +event.target.value;
            } else if (letter == 'A') {
                scores[i][1] = +event.target.value;
            }
            calculateFinal();
            document.getElementById('grade').innerText = letterGrade + ' ' + percent;
        })

        nodes[2].appendChild(numerator);
        nodes[2].appendChild(slash);
        nodes[2].appendChild(denominator);

        nodes.map(x => x = document.getElementById("container").appendChild(x));
    }
}

function calculateFinal() {
    let pracPoints = pracTotal = allPoints = allTotal = 0;

    for (let i = 0; i < num; i++) {

        if (categories[i] == 'P') {
            pracPoints += scores[i][0];
            pracTotal += scores[i][1];
        } else if (categories[i] == 'A') {
            allPoints += scores[i][0];
            allTotal += scores[i][1];
        }
    }

    percent = (100 * ((pracPoints / pracTotal) * .1 + (allPoints / allTotal) * .9)).toFixed(2);

    if (percent >= 89.5)
        letterGrade = 'A';
    else if (percent >= 79.5)
        letterGrade = 'B';
    else if (percent >= 69.5)
        letterGrade = 'C';
    else if (percent >= 59.5)
        letterGrade = 'D';
    else
        letterGrade = 'E';
}

function refresh() {
    sessionStorage.clear();
    window.location.href = 'index.html'
}

function addAssignment() {

    while (category != 'P' && category != 'A')
        var category = prompt("Enter weight category ('P' or 'A'):", "A");

    while (!(val > 0))
        var val = prompt("Enter grade point value of assignment (positive number): ", '10');

    document.getElementById('container').innerHTML = '';
    names.unshift('Custom Assignment');
    categories.unshift(category);
    scores.unshift([+val, +val]);
    num++;

    calculateFinal();
    displayScores();
    document.getElementById('grade').innerText = letterGrade + ' ' + percent;
}