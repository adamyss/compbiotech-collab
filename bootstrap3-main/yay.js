(function(){
	const FilterStatus = Object.freeze({
		UNKNOWN: 'Unknown',
		OK: 'OK',
		NEEDS_REPLACEMENT: 'Needs Replacement'
	});
	let status = FilterStatus.UNKNOWN;
	const notifications = [];
	const picoUrl = 'http://192.168.1.100/status'; // Replace with your Raspberry Pi Pico's IP address and endpoint

	function renderNotifications(){
		const list = document.getElementById('notification-list');
		const count = document.getElementById('notification-count');
		if(!list) return;
		list.innerHTML = '';
		notifications.forEach((msg, i) => {
			const li = document.createElement('li');
			li.textContent = msg;
			li.style.cursor = 'pointer';
			li.title = 'Click to dismiss';
			li.dataset.index = String(i);
			li.addEventListener('click', function(){
				removeNotification(parseInt(this.dataset.index, 10));
			});
			list.appendChild(li);
		});
		if(count) count.textContent = `(${notifications.length})`;
	}

	function removeNotification(index){
		if(typeof index !== 'number' || index < 0 || index >= notifications.length) return;
		notifications.splice(index, 1);
		renderNotifications();
	}

	function addNotification(msg){
		notifications.push(String(msg));
		renderNotifications();
	}

	function fetchFilterStatus(){
		fetch(picoUrl)
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then(data => {
				const newStatus = data.status;
				if (newStatus !== status) {
					status = newStatus;
					const statusElement = document.getElementById('filter-status');
					if(statusElement) statusElement.textContent = status;
					if (status === FilterStatus.NEEDS_REPLACEMENT) {
						addNotification("Filter needs replacement!");
					}
				}
			})
			.catch(error => {
				console.error('Error fetching filter status:', error);
				// Optionally set status to unknown on error
				if (status !== FilterStatus.UNKNOWN) {
					status = FilterStatus.UNKNOWN;
					const statusElement = document.getElementById('filter-status');
					if(statusElement) statusElement.textContent = status;
				}
			});
	}

	document.addEventListener('DOMContentLoaded', function(){
		const top = document.getElementById('filter-status');
		if(top) top.textContent = status;
		renderNotifications();
		// Fetch status immediately and then every 30 seconds
		fetchFilterStatus();
		setInterval(fetchFilterStatus, 30000);
	});
    addNotification("Your filter will need replacement soon");
	window.addNotification = addNotification;
	window.notifications = notifications;
})();

