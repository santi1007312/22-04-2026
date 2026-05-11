export const notify = {
    show(message, type = 'info') {
        const container = document.getElementById('notification-container') || this._createContainer();
        const toast = document.createElement('div');
        toast.classList.add('toast', `toast-${type}`); // Clases para el sistema de notas
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('toast-content');

        const iconSpan = document.createElement('span');
        iconSpan.textContent = this._getIcon(type);

        const messageSpan = document.createElement('span');
        messageSpan.textContent = message;

        const closeBtn = document.createElement('button');
        closeBtn.classList.add('toast-close');
        closeBtn.textContent = '×';
        closeBtn.onclick = () => toast.remove();

        contentDiv.append(iconSpan, messageSpan);
        toast.append(contentDiv, closeBtn);
        container.appendChild(toast);

        setTimeout(() => { if(toast.parentElement) toast.remove(); }, 4000);
    },

    _createContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
        return container;
    },

    _getIcon(type) {
        const icons = { success: '✅', error: '❌', info: 'ℹ️' };
        return icons[type] || icons.info;
    }
};