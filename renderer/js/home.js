const year = document.getElementById("year");

if (year) {
    year.textContent = `© ${new Date().getFullYear()} MediStock`;
}

console.log("MediStock Home Page Loaded");