var markingPeriod, className, letterGrade, percent, num;
var dates = [], names = [], categories = [], scores = [];

document.body.addEventListener('keyup', function (e) {
    if (e.key === 'Escape')
        document.getElementById('alertContainer').innerHTML = '';
});
document.getElementById('field').addEventListener('keypress', function (e) {
    if (e.key === 'Enter')
        parse();
});

function parse() {

    let text = document.getElementById('field').value;
    document.getElementById('field').value = '';
    let header = text.substring(text.search("MP"), text.search("\nAssignments\n")).split("\n");

    markingPeriod = header[0];
    className = header[1];
    letterGrade = header[2];
    percent = header[3];

    let data = text.substring(text.search("\nAssignments\n") + 15, text.search("Totals")).split("\n");

    num = (data.length - 1) / 5;

    if (header.length < 4 || num < 1) {
        invalidInput();
        return;
    }
    
    for (let i = 0; i < data.length-1; i += 5) {

        names.push(data[i + 1]);

        let category = data[i + 2].substring(0, 1);
        categories.push(category);

        let raw = data[i + 3].split(" out of ");

        if (data[i + 3] == 'Not Graded') 
            var arr = [0, 0];
        else 
            var arr = [+raw[0], +raw[1]];

        scores.push(arr);
    }

    displayScores();
}

function displayScores() {
    document.querySelector('.home').style.display = 'none';
    document.querySelector('.grades').style.display = 'block';

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
    
    document.querySelector('.home').style.display = 'block';
    document.querySelector('.grades').style.display = 'none';

    document.getElementById('container').innerHTML = '';
    dates = [], names = [], categories = [], scores = [];
}

function invalidInput() {
    const cont = document.getElementById('alertContainer');
    cont.style.display = 'block';
    cont.innerHTML = "<div class=\"alert\"><span onclick=\"this.parentElement.style.display='none';\" class=\"closebtn\">&times;</span>Invalid input; Please Try Again.</div>";
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