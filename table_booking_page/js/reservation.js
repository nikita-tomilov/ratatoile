function reserveTable() {
    //pure govnokod going on here
    const datetimefrom = document.getElementById('datetimepicker1').value.toString();
    if (datetimefrom === "") {
        alert("Не задана дата")
        return
    }

    const personName = document.getElementById('person_name').value.toString();
    if (personName === "") {
        alert("Не задано имя")
        return
    }

    const personPhone = document.getElementById('person_phone').value.toString();
    if (personPhone === "") {
        alert("Не задан номер телефона")
        return
    }

    const longevity = document.getElementById('longevity').value.toString();
    const tabletype = document.getElementById('tabletype').value.toString();
    const message = document.getElementById('message').value.toString();
    const personsCount = Number(document.getElementById('persons_count').value.toString());

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
    const requestBody = {
        from: tsFrom,
        to: tsTo,
        seats: personsCount,
        type: type,
        comment: message,
        personName: personName,
        personPhone: personPhone
    }
    const requestBodyJson = JSON.stringify(requestBody)
    const url = window.location.origin + "/freeapi/1.0/reservation/create"
    fetch(url, {
        method: "POST",
        body: requestBodyJson,
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        }
    }).then((data) => {
        if (data.ok) {
            ok(data)
        } else {
            fail(data)
        }
    }).catch((data) => {
        fail(data)
    })
}

function ok(data) {
    data.json().then((data) => {
        const form = document.getElementById('reservation-form');
        form.style.display = 'none';
        const status = document.getElementById('reservation-status');
        const name = data.personName;
        status.innerHTML = "<h2>Спасибо " + name + ", ваш запрос сохранен.<br>Ожидайте звонка с подтверждением.</h2><a href=\"index.html\">На главную</a>"
    });
}

function fail(data) {
    data.json().then((data) => {
        alert("Ошибка: " + data.message);
    });
}