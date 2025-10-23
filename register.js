// Auto-set location on focus
document.getElementById('add').addEventListener('focus', function() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			const lat = position.coords.latitude;
			const lon = position.coords.longitude;
			// Use a free API to get location name from lat/lon
			fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
				.then(response => response.json())
				.then(data => {
					if (data.address && data.address.city) {
						document.getElementById('add').value = data.address.city;
					} else if (data.address && data.address.town) {
						document.getElementById('add').value = data.address.town;
					} else if (data.address && data.address.village) {
						document.getElementById('add').value = data.address.village;
					} else if (data.display_name) {
						document.getElementById('add').value = data.display_name;
					}
				});
		});
	}
});

// Alert on register

document.querySelector('.registerbtn').addEventListener('click', function(e) {
	e.preventDefault();
	alert('Successfully registered. Verify your email');
});

// Show registered mail modal
document.getElementById('viewRegisteredMailBtn').addEventListener('click', function() {
	document.getElementById('registeredMailModal').style.display = 'block';
});

// Close modal
document.getElementById('closeMailModal').addEventListener('click', function() {
	document.getElementById('registeredMailModal').style.display = 'none';
});
