'use strict';

var className, letterGrade, percent, num;
var dates = [], names = [], categories = [], scores = [];

// loads data from sessionStorage
function load() {
    className = sessionStorage.getItem('className');
    letterGrade = sessionStorage.getItem('letterGrd');
    percent = sessionStorage.getItem('percent');
    num = sessionStorage.getItem('num');
    names = sessionStorage.getItem('names').split(',');
    categories = sessionStorage.getItem('categories').split(',');

    // creates matrix for storing scores
    let temp = sessionStorage.getItem('scores').split(',');

    for (let i = 0; i < temp.length; i+=2) {
        let arr = [+temp[i], +temp[i + 1]]
        scores.push(arr)
    }
    document.querySelector('.class-name').innerText = className;
    displayScores();
}

// displays the scores prints the grade
function displayScores() {
    updateGrades();

    // adds each row of assignment data
    for (let i = 0; i < num; i++) {

        let nodes = Array.from({ length: 3 }, () => (document.createElement("div")));

        nodes[0].innerText = names[i];

        let letter = categories[i];
        nodes[1].innerText = letter;


        // adds event listener to the numerator and denominator input tags
        let numerator = document.createElement('input');
        numerator.type = 'number';
        numerator.value = scores[i][0];
        numerator.addEventListener('input', (event) => {
            if (letter === 'P') {
                scores[i][0] = +event.target.value;
            } else if (letter === 'A') {
                scores[i][0] = +event.target.value;
            }
            calculateFinal();
            updateGrades();
        })
        
        let slash = document.createElement('span');
        slash.innerText = " / ";
        
        let denominator = document.createElement('input');
        denominator.type = 'number';
        denominator.value = scores[i][1];
        denominator.addEventListener('input', (event) => {
            if (letter === 'P') {
                scores[i][1] = +event.target.value;
            } else if (letter === 'A') {
                scores[i][1] = +event.target.value;
            }
            calculateFinal();
            updateGrades();
        })

        nodes[2].appendChild(numerator);
        nodes[2].appendChild(slash);
        nodes[2].appendChild(denominator);
        nodes[2].className = 'grade-edit'

        nodes.map(x => x = document.getElementById("container").appendChild(x));
    }
}

// calculates the final grade by going through the scores matrix
function calculateFinal() {
    let pracPoints = pracTotal = allPoints = allTotal = 0;

    // calculates the totals of each category of assignment
    for (let i = 0; i < num; i++) {

        if (categories[i] === 'P') {
            pracPoints += scores[i][0];
            pracTotal += scores[i][1];
        } else if (categories[i] === 'A') {
            allPoints += scores[i][0];
            allTotal += scores[i][1];
        }
    }

    // calculates the final percent grade, and decides which letter grade
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
    percent += '%';
}

// redirects to the input page
function back() {
    sessionStorage.clear();
    window.location.href = 'index.html'
}

// reloads the page to go back to original grades
function refresh() {
    location.reload();
}

// adds an assignment to the list
function addAssignment() {

    // prompts for weight category and grade weight
    while (category != 'P' && category != 'A') {var category = prompt("Enter weight category ('P' or 'A'):", "A");}
    while (!(val > 0)) {var val = prompt("Enter grade point value of assignment (positive number): ", '10');}

    // resets the container, pushes the assignment data to the start of each array
    document.getElementById('container').innerHTML = '';
    names.unshift('Custom Assignment');
    categories.unshift(category);
    scores.unshift([+val, +val]);
    num++;

    calculateFinal();
    displayScores();
}

// updates the letter grade, percent, and bar
function updateGrades() {

    let bar = document.getElementById('grade-bar');
    bar.style.width = percent;
    bar.className = letterGrade;
    bar.innerText = letterGrade + ' ' + percent;
}