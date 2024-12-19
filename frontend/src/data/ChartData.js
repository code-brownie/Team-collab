export const doughnutChartData = {
    labels: ["Projects Completed", "Tasks Completed", "Tasks Pending"],
    datasets: [
        {
            data: [45, 35, 20], // Percentages
            backgroundColor: ["#6366F1", "#A5B4FC", "#E0E7FF"], // Colors for each segment
            borderWidth: 0, // No border for a clean look
        },
    ],
};

export const lineChartData = {
    labels: ["Projects Completed", "Tasks Completed", "Tasks Pending"],
    datasets: [
        {
            label: "Performance Data",
            data: [45, 35, 20], // Same data as doughnut chart
            borderColor: "#6366F1",
            backgroundColor: "rgba(99, 102, 241, 0.2)",
            borderWidth: 2,
            tension: 0.4, // Smooth line
            pointBackgroundColor: "#6366F1",
        },
    ],
};

export const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows manual size adjustment
    plugins: {
        legend: {
            display: false, // Hide the default legend
        },
        tooltip: {
            callbacks: {
                label: (context) => `${context.label}: ${context.raw}%`,
            },
        },
    },
    cutout: "70%", // Creates the hollow center
};

export const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true, // Display legend for the line chart
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                stepSize: 10,
            },
        },
    },
};