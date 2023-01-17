var markingPeriod, className, letterGrade, percent
var dates = [], names = [], categories = [], scores = []
var pracprep = [], alltasks = []
var pracPoints, pracTotal, allPoints, allTotal
var num
// parse()

function parse() {

    let text = document.getElementById('field').value
    let header = text.substring(text.search("MP"), text.search("\nAssignments\n")).split("\n")

    markingPeriod = header[0]
    className = header[1]
    letterGrade = header[2]
    percent = header[3]

    let data = text.substring(text.search("\nAssignments\n") + 15, text.search("Totals")).split("\n")
    
    num = (data.length - 1) / 5

    for (let i = 0; i < data.length-1; i += 5) {

        names.push(data[i + 1])

        let category = data[i + 2].substring(0, 1)
        categories.push(category)

        let raw = data[i + 3].split(" out of ")
        let arr
        if (data[i + 3] == 'Not Graded') {
            arr = [0, 0]
        } else {
            arr = [+raw[0], +raw[1]]
        }
        
        if (category == 'P')
            pracprep.push(arr)
        else if (category == 'A')
            alltasks.push(arr)
        
        scores.push(arr)
    }


    displayScores()
    calculateFinal()
}

function displayScores() {

    document.getElementById('grade').innerText = letterGrade + ' ' + percent
    document.getElementById('quarter').innerText = markingPeriod
    document.getElementById('className').innerText = className
    document.getElementById('entry').style.display = 'none'
    document.getElementById('classInfo').style.display = 'flex'
    document.getElementById('container').style.display = 'grid';

    for (let i = 0; i < num; i++) {

        let nodes = Array.from({ length: 3 }, () => (document.createElement("div")))

        nodes[0].innerText = names[i]
        let letter = categories[i]
        nodes[1].innerText = letter

        let numerator = document.createElement('input')
        numerator.type = 'number'
        numerator.value = scores[i][0]
        numerator.addEventListener('input', (event) => {
            if (letter == 'P') {
                pracprep[i][0] = +event.target.value
            } else if (letter == 'A') {
                alltasks[i][0] = +event.target.value
            }
            calculateFinal()
            document.getElementById('grade').innerText = letterGrade + ' ' + percent
        })

        let slash = document.createElement('span')
        slash.innerText = " / "

        let denominator = document.createElement('input')
        denominator.type = 'number'
        denominator.value = scores[i][1]
        denominator.addEventListener('input', (event) => {
            if (letter == 'P') {
                pracprep[i][1] = +event.target.value
            } else if (letter == 'A') {
                alltasks[i][1] = +event.target.value
            }
            calculateFinal()
            document.getElementById('grade').innerText = letterGrade + ' ' + percent
        })

        nodes[2].appendChild(numerator)
        nodes[2].appendChild(slash)
        nodes[2].appendChild(denominator)

        nodes.map(x => x = document.getElementById("container").appendChild(x))
    }
}

function calculateFinal() {
    pracPoints = pracTotal = allPoints = allTotal = 0

    for (let i = 0; i < pracprep.length; i++) {

        pracPoints += pracprep[i][0]
        pracTotal += pracprep[i][1]
    }

    for (let i = 0; i < alltasks.length; i++) {
        allPoints += alltasks[i][0]
        allTotal += alltasks[i][1]
    }

    percent = (100 * ((pracPoints / pracTotal) * .1 + (allPoints / allTotal) * .9)).toFixed(2)

    if (percent >= 89.5)
        letterGrade = 'A'
    else if (percent >= 79.5)
        letterGrade = 'B'
    else if (percent >= 69.5)
        letterGrade = 'C'
    else if (percent >= 59.5)
        letterGrade = 'D'
    else
        letterGrade = 'E'
}

function refresh() {
    document.getElementById('entry').style.display = 'block'
    document.getElementById('classInfo').style.display = 'none'
    document.getElementById('container').style.display = 'none';
    document.getElementById('field').value = ''
    document.getElementById('container').innerHTML = ''
}