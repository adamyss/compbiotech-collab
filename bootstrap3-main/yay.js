(function(){
	const FilterStatus = Object.freeze({
		UNKNOWN: 'Unknown',
		OK: 'OK',
		NEEDS_REPLACEMENT: 'Needs Replacement'
	});
	let status = FilterStatus.OK;
	const notifications = [];

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

	document.addEventListener('DOMContentLoaded', function(){
		const top = document.getElementById('filter-status');
		const nav = document.getElementById('nav-filter-status');
		if(top) top.textContent = status;
		if(nav) nav.textContent = status;
		renderNotifications();
	});
    addNotification("Your filter will need replacement soon");
	window.addNotification = addNotification;
	window.notifications = notifications;
})();

