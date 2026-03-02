// Importing required libraries
import XLSX from 'xlsx';
import Chart from 'chart.js';

// Function to read Excel file
function readExcel(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        renderTable(jsonData);
        drawChart(jsonData);
    };
    reader.readAsArrayBuffer(file);
}

// Function to render table
function renderTable(data) {
    const table = document.getElementById('data-table');
    table.innerHTML = '';
    const headers = Object.keys(data[0]);
    let headerRow = '<tr>'; 
    headers.forEach(header => {
        headerRow += `<th>${header}</th>`;
    });
    headerRow += '</tr>';
    table.innerHTML += headerRow;

    data.forEach(row => {
        let rowHtml = '<tr>';
        headers.forEach(header => {
            rowHtml += `<td>${row[header]}</td>`;
        });
        rowHtml += '</tr>';
        table.innerHTML += rowHtml;
    });
}

// Function to apply filters
function applyFilters() {
    // Implement filtering logic here based on user input
}

// Function to draw charts
function drawChart(data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const labels = data.map(row => row['Player']); // Change to your label field
    const scores = data.map(row => row['Score']); // Change to your score field
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Scores',
                data: scores,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Example usage
document.getElementById('upload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        readExcel(file);
    }
});
