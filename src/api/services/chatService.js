import { API_BASE_URL } from '../api';

class ChatSocketService {
    constructor(key, token) {
        this.key = key;
        this.token = token;
        this.socket = null;
        this.pingInterval = null;
    }

    start(onMessageCallback, onStatusChange) {
        // Заменяем протокол http на ws для вебсокетов
        const wsBase = API_BASE_URL.replace(/^http/, 'ws');
        const url = `${wsBase}/ws/chat/v2/${this.key}/?token=${this.token}`;

        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log(`[ChatService] Connected to ${this.key}`);
            if (onStatusChange) onStatusChange('connected');

            // Очищаем старый интервал, если он был
            if (this.pingInterval) clearInterval(this.pingInterval);

            // Пинг каждые 25 секунд для поддержания соединения (сердцебиение)
            this.pingInterval = setInterval(() => {
                if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                    // Используем JSON.stringify вместо jsonEncode
                    this.socket.send(JSON.stringify({ action: 'ping' }));
                }
            }, 25000);
        };

        this.socket.onmessage = (event) => {
            try {
                const response = JSON.parse(event.data);
                const action = response.action || '';
                const data = response.data || {};
                onMessageCallback(action, data);
            } catch (e) {
                console.error("[ChatService] Decode error:", e);
            }
        };

        this.socket.onclose = (event) => {
            console.log(`[ChatService] Closed: ${event.code}`);
            this.clearResources();
            if (onStatusChange) onStatusChange('disconnected');
        };

        this.socket.onerror = (error) => {
            console.error("[ChatService] WebSocket Error:", error);
            if (onStatusChange) onStatusChange('error');
        };
    }

    sendMessage(text, photosId = null) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const payload = {
                action: 'message',
                data: {
                    text: text || '',
                    uploaded_images: photosId,
                }
            };
            this.socket.send(JSON.stringify(payload));
        } else {
            console.error("[ChatService] Cannot send message: Socket is not open");
            throw new Error("Socket is not open");
        }
    }

    // Вспомогательный метод для очистки таймеров
    clearResources() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    stop() {
        this.clearResources();
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}

export default ChatSocketService;