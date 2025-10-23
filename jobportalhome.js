// Search bar
document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('searchForm');
	const input = document.getElementById('searchInput');

	if (!form || !input) return;

	form.addEventListener('submit', function (e) {
		e.preventDefault();
		const query = (input.value || '').trim().toLowerCase();

		if (!query) return;
		const companies = {
			'kcdc': 'https://kvaliteta.in/#about/careers',
			'zoho': 'https://careers.zohocorp.com/jobs/careers',
			'google': 'https://www.google.com/about/careers/applications/jobs/results#!t=jo&jid=127025001&',
			'tcs': 'https://www.tcs.com/careers',
			'wipro': 'https://careers.wipro.com/content/Early-Careers/?locale=en_US',
			'infosys': 'https://career.infosys.com/joblist'
		};

		if (companies.hasOwnProperty(query)) {
			input.value = '';
			input.blur && input.blur();
			window.location.href = companies[query];
		} else {
			const url = 'https://www.google.com/search?q=' + encodeURIComponent(query);
			window.open(url, '_blank');
			input.value = '';
			input.blur && input.blur();
		}
	});
});



