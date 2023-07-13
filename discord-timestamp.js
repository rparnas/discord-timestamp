/* Document Elements */
let year_box = document.getElementById('year-box');
let month_box = document.getElementById('month-box');
let date_box = document.getElementById('date-box');
let hour_box = document.getElementById('hour-box');
let tod_select = document.getElementById('tod-select')
let minute_box = document.getElementById('minute-box');
let tz_select = document.getElementById('tz-select');

let error_label = document.getElementById('error-label');
let output_label = document.getElementById('output-label');

let generate_button = document.getElementById('generate-button');

let timeZones = Intl.supportedValuesOf('timeZone');
let localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

$( document ).ready(function() {
    let now = new Date();
    year_box.value = now.getFullYear();
    month_box.value = now.getMonth() + 1;
    date_box.value = now.getDate();

    let hour = now.getHours();
    let tod = hour >= 12 ? 'PM' : 'AM'
    tod_select.value = tod;

    var todHour = 
      tod == 'AM' ? (hour == 0 ? 12 : hour) :
      tod == 'PM' ? (hour - 12 == 0 ? 12 : hour - 12) :
      '??';
    hour_box.value = todHour;

    for (tz of timeZones) {
      tz_select.options[tz_select.options.length] = new Option(tz, tz);
    }
    tz_select.value = localTimeZone;

    minute_box.value = '00';
});

generate_button.onclick = () => {

  let rawYear = parseInt(year_box.value);
  let rawMonth = parseInt(month_box.value)
  let rawDate = parseInt(date_box.value);
  let rawHour = parseInt(hour_box.value);
  let rawTOD = tod_select.value;
  let rawMinute = parseInt(minute_box.value);
  let rawTZ = tz_select.value;

  let year = rawYear;
  let month = rawMonth;
  let date = rawDate;
  let hour = rawTOD == "AM" ? (rawHour == 12 ? 0 : rawHour) : 
             rawTOD == "PM" ? (rawHour == 12 ? 12 :  rawHour + 12) :
             Number.NaN;
  let minute = rawMinute;

  let choiceStr = "" + 
    year + "-" + 
    month.toString().padStart(2, '0') + "-" + 
    date.toString().padStart(2, '0') + " " + 
    hour.toString().padStart(2, '0') + ":" + 
    minute.toString().padStart(2, '0');
  let choice = moment.tz(choiceStr, rawTZ);

  var unixTS = choice.unix();
  if (isNaN(unixTS)) {
    error_label.innerText = "Invalid Date";
    output_label.innerText = "";
  }
  else {
    var discordTS = "<t:" + unixTS + ":F>";
    var discordRelativeTS = "<t:" + unixTS + ":R>";
    error_label.innerText = "";
    output_label.innerText = discordTS + " (" + discordRelativeTS + ")";
  }
};
