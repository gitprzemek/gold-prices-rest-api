// JQUERY CALENDAR + CHANGE FORMAT DATE 
$(function () {
    $(".date-container__input").datepicker({
        dateFormat: "yy-mm-dd"
    });
});



// FILTER TABLE COLUMN *********************************************************************
const inputDate = document.getElementById("filterDate");
const inputPrice = document.getElementById("filterPrice");


function filterText() {
    let filter, table, tr, td, i, cell, cellIndex;

    filter = this.value.toUpperCase();
    table = document.getElementById("statTable");
    tr = table.querySelectorAll("tbody > tr");
    cell = $(this).closest('td');
    cellIndex = cell[0].cellIndex;

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[cellIndex];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

inputDate.addEventListener("keyup", filterText);
inputPrice.addEventListener("keyup", filterText);

// SORT TABLE COLUMN*********************************************************************
const sortDate = document.getElementById("dateBtn");
const sortPrice = document.getElementById("priceBtn");

function sortTable() {
    let table, rows, switching, i, x, y, shouldSwitch, dir, cell, cellInd, switchcount = 0;
    table = document.getElementById("tableBody");
    cell = $(this).closest("th");
    cellInd = cell[0].cellIndex;
    switching = true;
    dir = "asc";

    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 0; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[cellInd];
            y = rows[i + 1].getElementsByTagName("TD")[cellInd];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}
sortDate.addEventListener("click", sortTable);
sortPrice.addEventListener("click", sortTable);

// AJAX GET JSON DATA FROM SERVER*********************************************************************

$('.date-container__element--btn').on('click', function () {
    const dateFrom = document.getElementById("date-from").value;
    const dateTo = document.getElementById("date-to").value;

    $.ajax({
            url: "http://api.nbp.pl/api/cenyzlota/" + dateFrom + "/" + dateTo + "/",
            dataType: "json",
            type: "get"
        })
        // .always(function() {
        //     $(".table-container").hide();
        // })
        .done(function (respond) {
            let textData = "";

            respond.forEach(function (value) {
                textData += "<tr>";
                textData += "<td>" + value.data + "</td>";
                textData += "<td>" + value.cena + "</td>";
                textData += "</tr>";
            });

            $("#tableBody").empty();
            $(".table-container").css("display", "flex");
            $("#tableBody").append(textData);
            $(".stat-container").css("display", "flex");

            // MAX MIN MEDIAN*************************************************************

            // MIN VALUE
            const table = document.getElementById("tableBody");
            let sumVal = 0;
            const minPrice = document.getElementById("minPrice");
            const minPriceDate = document.getElementById("minPriceDate");
            const maxPrice = document.getElementById("maxPrice");
            const maxPriceDate = document.getElementById("maxPriceDate");
            const medianInput = document.getElementById("median");
            // getMax();
            function getMin() {
                let minVal, minDate;
                for (let i = 0; i < table.rows.length; i++) {
                    if (i === 0) {
                        minVal = table.rows[i].cells[1].innerHTML;
                        minDate = table.rows[i].cells[0].innerHTML;
                    } else if (minVal > table.rows[i].cells[1].innerHTML) {
                        minVal = table.rows[i].cells[1].innerHTML;
                        minDate = table.rows[i].cells[0].innerHTML;
                    }
                }
                minPrice.innerHTML = minVal;
                minPriceDate.innerHTML = minDate;
            }

            // MAX VALUE
            function getMax() {
                let maxVal, maxDate;
                for (let i = 0; i < table.rows.length; i++) {
                    if (i === 0) {
                        maxVal = table.rows[i].cells[1].innerHTML;
                        maxDate = table.rows[i].cells[0].innerHTML;
                    } else if (maxVal < table.rows[i].cells[1].innerHTML) {
                        maxVal = table.rows[i].cells[1].innerHTML;
                        maxDate = table.rows[i].cells[0].innerHTML;
                    }
                }
                maxPrice.innerHTML = maxVal;
                maxPriceDate.innerHTML = maxDate;
            }
            // MEDIAN
            // change value from column to number
            let tableArr = [];
            for (let i = 0; i < table.rows.length; i++) {
                tableArr.push(table.rows[i].cells[1].innerHTML);
            }
            let arrayOfNumbers = tableArr.map(Number);
            // calculate median
            function median(values) {
                values.sort(function (a, b) {
                    return a - b;
                });
                let half = Math.floor(values.length / 2);
                if (values.length % 2)
                    return values[half];
                else
                    return (values[half - 1] + values[half]) / 2.0;
            }
            medianInput.innerHTML = median(arrayOfNumbers);

            // **** RUN FUNCTION ****
            getMin();
            getMax();
        })

        .fail(function () {
            console.warn("Error with connection");
        })


})
