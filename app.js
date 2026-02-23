let originalData = [];
let filteredData = [];
let currentSort = { column: null, asc: true };

document.getElementById('fileInput').addEventListener('change', handleFile);

function handleFile(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.SheetNames[0];
    const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { defval: '' });

    originalData = json;
    filteredData = [...originalData];

    renderTable(filteredData);
    renderCharts(filteredData);
  };

  reader.readAsArrayBuffer(file);
}

function applyFilters() {
  const pos = document.getElementById("filterPos").value;
  const conv = document.getElementById("filterConv").value;
  const minVict = Number(document.getElementById("filterVict").value);
  const minEntr = Number(document.getElementById("filterEntr").value);

  filteredData = originalData.filter(p => {
    if (pos && p["POSICION"] !== pos) return false;
    if (conv && String(p["CONVOCADO"]) !== conv) return false;
    if (Number(p["VICTORIAS LIGA"] || 0) < minVict) return false;
    if (Number(p["ENTRENOS"] || 0) < minEntr) return false;
    return true;
  });

  renderTable(filteredData);
  renderCharts(filteredData);
}

function renderTable(data) {
  const head = document.getElementById("tableHead");
  const body = document.getElementById("tableBody");

  head.innerHTML = "";
  body.innerHTML = "";

  if (!data.length) return;

  const cols = Object.keys(data[0]);
  const tr = document.createElement("tr");

  cols.forEach(col => {
    const th = document.createElement("th");
    th.textContent = col;
    th.onclick = () => sortByColumn(col);
    tr.appendChild(th);
  });

  head.appendChild(tr);

  data.forEach(row => {
    const tr = document.createElement("tr");
    cols.forEach(col => {
      const td = document.createElement("td");
      td.textContent = row[col];
      tr.appendChild(td);
    });
    body.appendChild(tr);
  });
}

function sortByColumn(column) {
  if (currentSort.column === column) {
    currentSort.asc = !currentSort.asc;
  } else {
    currentSort.column = column;
    currentSort.asc = true;
  }

  filteredData.sort((a, b) => {
    const A = a[column], B = b[column];
    const numA = parseFloat(A), numB = parseFloat(B);

    if (!isNaN(numA) && !isNaN(numB)) {
      return currentSort.asc ? numA - numB : numB - numA;
    }
    return currentSort.asc
      ? String(A).localeCompare(String(B))
      : String(B).localeCompare(String(A));
  });

  renderTable(filteredData);
  renderCharts(filteredData);
}

let charts = {};

function renderCharts(data) {
  const labels = data.map(p => p["JUGADOR"]);

  const datasets = {
    victoriasLiga: data.map(p => Number(p["VICTORIAS LIGA"] || 0)),
    victoriasAmericana: data.map(p => Number(p["VICTORIAS AMERICANA"] || 0)),
    puntos: data.map(p => Number(p["PUNTOS ACUMULADOS"] || 0)),
    entrenos: data.map(p => Number(p["ENTRENOS"] || 0)),
    nota: data.map(p => Number(p["NOTA MEDIA DEL JUGADOR"] || 0)),
  };

  createChart("victoriasLigaChart", labels, datasets.victoriasLiga, "Victorias Liga");
  createChart("victoriasAmericanaChart", labels, datasets.victoriasAmericana, "Victorias Americana");
  createChart("puntosChart", labels, datasets.puntos, "Puntos Acumulados");
  createChart("entrenosChart", labels, datasets.entrenos, "Entrenos");
  createChart("notaChart", labels, datasets.nota, "Nota Media");
}

function createChart(id, labels, data, label) {
  if (charts[id]) charts[id].destroy();

  const ctx = document.getElementById(id).getContext("2d");
  charts[id] = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label,
        data,
        backgroundColor: "rgba(54,162,235,0.6)"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { x: { ticks: { autoSkip: false } } }
    }
  });
}
