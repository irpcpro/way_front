"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import AuthMessagesApi from "../../api/AuthMessagesApi.jsx";

export function useWebSocket(url, appKey, token, clientId) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [subscribedChannels, setSubscribedChannels] = useState(new Map());
  const [channelAuthTokens, setChannelAuthTokens] = useState(new Map());
  const wsRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const [socketId, setSocketId] = useState(null);
  const socketIdRef = useRef(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      console.log('Connecting to WebSocket:', url);

      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log('✅ WebSocket connected successfully');
        setIsConnected(true);
        reconnectAttempts.current = 0;
        toast.success('Connected to WebSocket');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket message:', data);

          if (data.event === 'pusher:connection_established' && data.data?.socket_id) {
            socketIdRef.current = data.data.socket_id;
            console.log('📌 Socket ID received:', socketIdRef.current);
          }

          handleMessage(data);
          setLastMessage(data);
        } catch (error) {
          console.error('Error parsing message:', error, event.data);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        toast.error('WebSocket error occurred');
      };

      wsRef.current.onclose = (event) => {
        console.log('🔌 WebSocket closed:', event.code, event.reason);
        setIsConnected(false);

        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(`Reconnecting... attempt ${reconnectAttempts.current}`);
          setTimeout(() => {
            connect();
          }, 3000 * reconnectAttempts.current);
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }
  }, [url]);

  const handleMessage = (data) => {
    const { event, channel, data: messageData } = data;

    console.log('🦷 event', event)

    switch (event) {
      case 'pusher:connection_established':
        console.log('🔴 Connection established:', messageData, messageData?.socket_id);
        if(JSON.parse(messageData).socket_id !== null){
          setSocketId(messageData.socket_id);
          console.log('📌 Socket ID saved:', JSON.parse(messageData).socket_id);
        }

        // بعد از اتصال، subscribe به کانال‌های ذخیره شده
        resubscribeToChannels();
        break;

      case 'pusher_internal:subscription_succeeded':
        console.log(`✅ Subscribed to channel: ${channel}`);
        toast.success(`Subscribed to ${channel}`);
        break;

      case 'pusher:subscription_error':
        console.error(`❌ Subscription error for ${channel}:`, messageData);
        toast.error(`Failed to subscribe to ${channel}`);
        break;

      case 'new_message':
        console.log('New message received:', messageData);
        toast.success('New message received');
        break;

      default:
        console.log('Unhandled event:', event, data);
        break;
    }
  };

  const resubscribeToChannels = () => {
    subscribedChannels.forEach((authToken, channelName) => {
      subscribeToChannel(channelName, authToken);
    });
  };

  const subscribeToChannel = (channelName, authToken) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('Cannot subscribe: WebSocket not connected');
      return false;
    }

    try {
      const subscribeMessage = {
        event: "pusher:subscribe",
        data: {
          auth: authToken,
          channel: channelName
        }
      };


      console.log('🦷🦷🦷 subscribeMessage', subscribeMessage)
      wsRef.current.send(JSON.stringify(subscribeMessage));
      return true;
    } catch (error) {
      console.error('Error subscribing to channel:', error);
      return false;
    }
  };

  // ذخیره auth token برای کانال
  const setAuthToken = useCallback((channelName, authToken) => {
    setChannelAuthTokens(prev => new Map(prev).set(channelName, authToken));

    // اگر WebSocket متصل است، بلافاصله subscribe کن
    if (isConnected) {
      subscribeToChannel(channelName, authToken);
    }
  }, [isConnected]);

  // Subscribe به یک کانال با auth token
  const subscribe = useCallback((channelName, authToken) => {
    setSubscribedChannels(prev => new Map(prev).set(channelName, authToken));
    setAuthToken(channelName, authToken);
  }, [setAuthToken]);

  // Unsubscribe از یک کانال
  const unsubscribe = useCallback((channelName) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return false;
    }

    try {
      const unsubscribeMessage = {
        event: "pusher:unsubscribe",
        data: {
          channel: channelName
        }
      };

      wsRef.current.send(JSON.stringify(unsubscribeMessage));

      setSubscribedChannels(prev => {
        const newMap = new Map(prev);
        newMap.delete(channelName);
        return newMap;
      });

      setChannelAuthTokens(prev => {
        const newMap = new Map(prev);
        newMap.delete(channelName);
        return newMap;
      });

      console.log(`Unsubscribed from ${channelName}`);
      return true;
    } catch (error) {
      console.error('Error unsubscribing from channel:', error);
      return false;
    }
  }, []);

  const getSocketId = useCallback(() => {
    // اگر socket_id داریم، برگردان
    if (socketIdRef.current) {
      return socketIdRef.current;
    }

    // اگر نداریم، منتظر باشیم (مثلاً ۵ ثانیه)
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 50; // 5 ثانیه با 100ms interval

      const checkSocketId = () => {
        if (socketIdRef.current) {
          resolve(socketIdRef.current);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkSocketId, 100);
        } else {
          // اگر timeout شد، یک socket_id موقت بساز
          const tempSocketId = `${Date.now()}.${Math.floor(Math.random() * 1000000)}`;
          console.warn('⚠️ Using temporary socket_id:', tempSocketId);
          resolve(tempSocketId);
        }
      };

      checkSocketId();
    });
  }, []);

  // دریافت auth tokens برای multiple channels
  const fetchAuthTokens = useCallback(async (channelNames) => {
    const currentSocketId = await getSocketId();

    if(currentSocketId === null) return;

    let data = {
      socket_id: currentSocketId,
      channel_names: channelNames
    };

    console.log('get auth messages =========> data', data)

    AuthMessagesApi.get(data).then((res) => {
      console.log('AuthMessagesApi.get -> data', res)
      if (res.success && res.data) {
        res.data.forEach(({ channel_name, auth }) => {
          setAuthToken(channel_name, auth);
        });
        return res.data;
      }
      return [];
    }).catch((error) => {
      toast.error(error.message);
      console.error('Error fetching auth tokens:', error);
      return [];
    }).finally(() => {

    })
  }, [token, getSocketId, setAuthToken]);

  // Subscribe به multiple channels
  const subscribeToMultipleChannels = useCallback(async (channelNames) => {
    const authTokens = await fetchAuthTokens(channelNames);
    if(authTokens === null) return;

    authTokens.forEach(({ channel_name, auth }) => {
      subscribe(channel_name, auth);
    });

    return authTokens;
  }, [fetchAuthTokens, subscribe]);

  useEffect(() => {
    if (appKey) {
      connect();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [appKey, connect]);

  return {
    isConnected,
    lastMessage,
    subscribe,
    unsubscribe,
    subscribeToMultipleChannels,
    fetchAuthTokens,
    subscribedChannels: Array.from(subscribedChannels.keys()),
    reconnect: connect
  };
}