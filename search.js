// Function to get user's location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // Use Nominatim for reverse geocoding (free and no API key required)
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.display_name) {
                            const locationInput = document.getElementById('location');
                            // Extract city and state from the address
                            const addressParts = data.display_name.split(',');
                            const city = addressParts[addressParts.length - 4]?.trim() || '';
                            const state = addressParts[addressParts.length - 3]?.trim() || '';
                            const location = `${city}, ${state}`.trim();
                            
                            locationInput.value = location;
                            alert('Location detected: ' + location);
                        }
                    })
                    .catch(error => {
                        console.error('Error getting address:', error);
                        const locationInput = document.getElementById('location');
                        const location = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                        locationInput.value = location;
                        alert('Location detected: ' + location);
                    });
            },
            (error) => {
                alert('Error getting your location: ' + error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

// Search button functionality
document.addEventListener('DOMContentLoaded', () => {
    const findButton = document.getElementById('find-button');
    const locationInput = document.getElementById('location');
    const jobTitleInput = document.getElementById('job-title');

    // Add click event to location input
    locationInput.addEventListener('click', () => {
        getUserLocation();
    });

    // Helper: filter job cards by company query (case-insensitive). Empty query shows all.
    function filterCardsByCompany(query) {
        const cards = Array.from(document.querySelectorAll('.job-card'));
        const q = (query || '').toLowerCase();
        let visibleCount = 0;

        cards.forEach(card => {
            const company = (card.getAttribute('data-company') || '').toLowerCase();
            const matches = q ? company.includes(q) : true;
            if (matches) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Ensure a no-results element exists and update visibility
        let noResults = document.getElementById('no-results');
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.id = 'no-results';
            noResults.style.textAlign = 'center';
            noResults.style.margin = '20px';
            noResults.style.color = '#333';
            noResults.textContent = 'No matching companies found.';
            document.querySelector('.container').insertAdjacentElement('afterend', noResults);
        }

        noResults.style.display = visibleCount ? 'none' : '';
        console.log(`Filtered results: ${visibleCount} visible`);
    }

    // Live input: when the job-title input is changed, update results immediately.
    jobTitleInput.addEventListener('input', () => {
        const jobTitle = jobTitleInput.value.trim();
        // If input is empty, show all cards
        filterCardsByCompany(jobTitle);
    });

    findButton.addEventListener('click', () => {
        const location = locationInput.value.trim();
        const jobTitle = jobTitleInput.value.trim();

        // If neither field is provided, show a message
        if (!location && !jobTitle) {
            alert('Please enter a location or job title to search');
            return;
        }

        // Apply the same company filter (for button-driven searches)
        filterCardsByCompany(jobTitle);
    });
});