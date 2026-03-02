'use strict';

// Import necessary libraries
const xlsx = require('xlsx');
const Chart = require('chart.js');

// Function to read Excel file and extract player data
function readExcelFile(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Assume first sheet is the relevant one
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    return data;
}

// Function to display player data in a table
function displayPlayerData(players) {
    const table = document.createElement('table');
    let header = '<tr><th>Name</th><th>Age</th><th>Position</th></tr>';
    let rows = players.map(player => `<tr><td>${player.name}</td><td>${player.age}</td><td>${player.position}</td></tr>`).join('');
    table.innerHTML = header + rows;
    document.body.appendChild(table);
}

// Function to create statistics chart
function createStatisticsChart(playerStats) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: playerStats.map(stat => stat.name),
            datasets: [{
                label: 'Player Statistics',
                data: playerStats.map(stat => stat.value),
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

// Function to filter players based on criteria
function filterPlayers(players, criteria) {
    return players.filter(player => player.age >= criteria.minAge); // Filtering example
}

// Main function to handle Excel file and display data
function init(filePath) {
    const players = readExcelFile(filePath);
    displayPlayerData(players);
    const filteredPlayers = filterPlayers(players, { minAge: 18 }); // Example filter
    createStatisticsChart(filteredPlayers);
}

// Call init with the path to the Excel file
init('./path/to/excel/file.xlsx');
