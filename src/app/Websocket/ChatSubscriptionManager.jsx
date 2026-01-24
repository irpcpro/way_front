// ChatSubscriptionManager.jsx
import { useEffect, useState, useCallback } from 'react';
import { useWebSocketContext } from './WebSocketProvider.jsx';

const ChatSubscriptionManager = ({ messages }) => {
    const { subscribeToMultipleChannels, unsubscribe, isConnected } = useWebSocketContext();
    const [subscribedHooks, setSubscribedHooks] = useState(new Set());

    // استخراج unique message hook IDs از لیست messages
    const extractMessageHookIds = useCallback((messages) => {
        const hookIds = new Set();

        messages.forEach(item => {
            if (item.message?.id_message_hook) {
                hookIds.add(item.message.id_message_hook);
            }
        });

        return Array.from(hookIds);
    }, []);

    // ساخت channel names از hook IDs
    const buildChannelNames = useCallback((hookIds) => {
        return hookIds.map(hookId => `private-new_messages.id_message_hook.${hookId}`);
    }, []);

    // Subscribe به تمام message hookها
    const subscribeToAllHooks = useCallback(async () => {
        if (!messages || messages.length === 0) return;

        const hookIds = extractMessageHookIds(messages);
        const channelNames = buildChannelNames(hookIds);

        console.log('Subscribing to channels:', channelNames);

        const result = await subscribeToMultipleChannels(channelNames);

        if (result.length > 0) {
            setSubscribedHooks(new Set(hookIds));
            console.log('Successfully subscribed to', result.length, 'channels');
        }
    }, [messages, extractMessageHookIds, buildChannelNames, subscribeToMultipleChannels]);

    // Unsubscribe از یک hook خاص
    const unsubscribeFromHook = useCallback((hookId) => {
        const channelName = `private-new_messages.id_message_hook.${hookId}`;
        unsubscribe(channelName);

        setSubscribedHooks(prev => {
            const newSet = new Set(prev);
            newSet.delete(hookId);
            return newSet;
        });
    }, [unsubscribe]);

    // وقتی messages تغییر کرد یا WebSocket وصل شد
    useEffect(() => {
        if (isConnected && messages && messages.length > 0) {
            subscribeToAllHooks();
        }
    }, [isConnected, messages, subscribeToAllHooks]);

    // وقتی کامپوننت unmount می‌شود
    useEffect(() => {
        return () => {
            // Unsubscribe از همه channels
            subscribedHooks.forEach(hookId => {
                unsubscribeFromHook(hookId);
            });
        };
    }, [subscribedHooks, unsubscribeFromHook]);

    // هندل incoming messages از WebSocket
    useEffect(() => {
        // این بخش باید در WebSocketContext هندل شود
        // اما می‌توانید اینجا هم logic اضافه کنید
    }, []);

    return null; // این کامپوننت فقط side effects دارد
};

export default ChatSubscriptionManager;