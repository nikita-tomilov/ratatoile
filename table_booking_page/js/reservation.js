function reserveTable() {
    //pure govnokod going on here
    const datetimefrom = document.getElementById('datetimepicker1').value.toString();

    if (datetimefrom === "") {
        alert("Не задана дата")
        return
    }

    const longevity = document.getElementById('longevity').value.toString();
    const tabletype = document.getElementById('tabletype').value.toString();
    const message = document.getElementById('message').value.toString();

    const dateFrom = datetimefrom.split(" ")[0];
    const timeFrom = datetimefrom.split(" ")[1];

    const dayFrom = dateFrom.split(".")[0]
    const monFrom = dateFrom.split(".")[1]
    const yearFrom = dateFrom.split(".")[2]
    const hourFrom = timeFrom.split(":")[0]
    const minuteFrom = timeFrom.split(":")[1]

    const tsFrom = Date.parse(yearFrom + "-" + monFrom + "-" + dayFrom + "T" + hourFrom + ":" + minuteFrom + ":00")
    const tsTo = tsFrom + Number(longevity[0]) * 60 * 60 * 1000;
    let type = "NORMAL";
    if (tabletype === "У окна") {
        type = "NEAR_WINDOW";
    }
    if (tabletype === "У бара") {
        type = "NEAR_BAR";
    }
    const comment = message;

    const form = document.getElementById('reservation-form');
    form.style.display = 'none';

    const status = document.getElementById('reservation-status');
    status.innerHTML = "<h2>Столик заказан, спасибо!</h2><a href=\"index.html\">На главную</a>"

    const requestBody = {
        from: tsFrom,
        to: tsTo,
        seats: 2,
        type: tabletype,
        comment: comment
    }
    const requestBodyJson = JSON.stringify(requestBody)
    fetch(url, {
        
    })
}