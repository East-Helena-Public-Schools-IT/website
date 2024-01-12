// Runs on HTTP GET
function doGet() {
  const selectedSheet = getCurrentScheduleSheet();
  const sheet = selectedSheet.getDataRange().getDisplayValues();
  let schedules = [];
  let scheduleIndex = 0;
 
  for (let i = 1; i < sheet.length; i++) {
    cell = sheet[i][0];
    // start taking cells
    if (cell != "") {
      let block = takeFrom(sheet, i);
      i = block.lastIndex; // jump loop forward
      let sport = {};
      // Only allow chars and spaces
      let name = block.table[0].name
        .replace(/[0-9]|\//g,'')
        .replace("BB", "Basketball")
        .trim();
      sport.name = name;
      sport.schedule = block.table.slice(1, block.table.length);

      schedules[scheduleIndex] = sport;
      scheduleIndex++;
    }
  }
  let output = JSON.stringify(schedules);
  Logger.log(output)
  return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JSON);
}

// Collects from the passed value "startTaking" until it 
// hits a blank cell.
function takeFrom(sheet, startTaking) {
  let block = {};
  block.table = [];

  let taking = startTaking;
  for (taking; taking < sheet.length; taking++) {
    const cell = sheet[taking][0];
    // stop taking cells if it is blank
    if (cell == "") { 
      break;
    }
    let row = {};
    row.name      = sheet[taking][0];
    row.date      = sheet[taking][1];
    row.time      = sheet[taking][2];
    row.location  = sheet[taking][3];
    block.table[taking-startTaking] = row;
  }
  block.lastIndex = taking;
  return block;
}


// This *should* be able to continue into the future indefinitely.
// The sheet just needs to follow "yy/yy Master Schedule"
function getCurrentScheduleSheet() {
  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  function fallTime() {
    const currentYear = (new Date().getYear() -100).toString();
    const nextYear = (new Date().getYear() -99).toString();
    return currentYear+"/"+nextYear;
  }
  function springTime() {
    const currentYear = (new Date().getYear() -101).toString();
    const nextYear = (new Date().getYear() -100).toString();
    return currentYear+"/"+nextYear
  }

  let yearyear  = new Date().getMonth() > 6 ? fallTime() : springTime();

  sheetName = yearyear + " Master Schedule"
  Logger.log("Getting \""+sheetName+"\"");
  // TODO: fallback to previous year if current year isn't found
  return spreadsheet.getSheetByName(sheetName);
}