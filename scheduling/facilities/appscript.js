// Runs on HTTP GET
function doGet() {
  const selectedSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Current Week");
  const sheet = selectedSheet.getDataRange().getDisplayValues();
  let district = [];

  const map = new Map();
  const schools = ["Radley", "Eastgate", "Prickly Pear", "East Valley", "East Helena High School"];
  for (const i in schools) { map.set(schools[i], {}) }
  function isSchool(cell) { return map.get(cell) == undefined ? false : true }

  // Figure out how the data is stored (the sheet isn't always the same)
  let dateCollum = 0;
  let timeCollum = 0;
  let titleCollum = 0;
  for (const cellIndex in sheet[0]) {
    const cell = sheet[0][cellIndex];
    if (cell === "Date") {
      dateCollum = cellIndex
      continue
    }
    if (cell === "Time") {
      timeCollum = cellIndex
      continue
    }
    if (cell !== "") {
      // must be the title
      titleCollum = cellIndex
      continue
    }
  }

  // Look for school names in the sheet
  for (let i = 0; i < sheet.length; i++) {
    let cell = sheet[i][titleCollum].trim()

    if (isSchool(cell)) { // the cell is one of the schools
      let school = map.get(cell)
      school.startIndex = i
      // Loop forward till you hit another shcool (or end of sheet)
      for (let j = i + 1; j < sheet.length; j++) {
        if (isSchool(sheet[j][1])) {
          school.endIndex = j
          i = j - 1
          break;
        }
      }
    }
  }

  for (const i in schools) {
    let mappedSchool = map.get(schools[i])
    let schedule = sheet.slice(mappedSchool.startIndex + 1, mappedSchool.endIndex)

    let school = {}
    school.name = schools[i]
    school.schedule = []

    for (const j in schedule) {
      let scheduleItem = schedule[j]
      let schoolScheduleObj = {}
      schoolScheduleObj.date = scheduleItem[dateCollum]
      schoolScheduleObj.title = scheduleItem[titleCollum]
      schoolScheduleObj.time = scheduleItem[timeCollum]
      if (schoolScheduleObj.title != "") {
        school.schedule.push(schoolScheduleObj)
      }
    }
    district[i] = school
  }

  let output = JSON.stringify(district);
  return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JSON);
}