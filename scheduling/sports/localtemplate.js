const fs = require("node:fs");
fetch(
  "https://script.google.com/macros/s/AKfycbzDoEMTlOJeT2ei3-QGjyW-u_kGf3q33B2J91pg_l-zWWXwP96GmS4xdSaPCok1nCQvWg/exec"
)
  .then((res) => res.json())
  .then((data) => {
    for (const i in data) {
      let j = data[i].name;
      j = j.toLowerCase().replaceAll(" ", "-");
      console.log(j);

      const template =
`<div>
  <table border="1" dir="ltr" cellpadding="0" cellspacing="0" xmlns="http://www.w3.org/1999/xhtml" class="date-table">
    <colgroup><col width="371" style="width: 160px" /><col width="165" style="width: 80px" /><col width="100" style="width: 80px" /><col width="100" style="width: 80px" /></colgroup>
  <thead>
    <tr><td class="bold row">Event</td><td class="bold row">Date</td><td class="bold row">Time</td><td class="bold row">Location</td></tr>
  </thead>
  <tbody id="${j}-table-body">
    <tr id="loading"><td class="row">loading...</td><td class="row">loading...</td><td class="row">loading...</td><td class="row">loading...</td></tr>
  </tbody>
  </table>
</div>`;
      fs.writeFile("./" + j, template, (err) => {
        if (err) {
          console.error(err);
        }
        // file written successfully
      });
    }
  });
