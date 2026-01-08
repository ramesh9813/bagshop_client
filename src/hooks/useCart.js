import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const useCart = () => {
    const dispatch = useDispatch();
    const { cartItems, cartCount } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth);

    const formatProductName = (name, maxChars = 60) => {
        if (!name) return "Item";
        const normalized = String(name).trim().replace(/\s+/g, " ");
        if (normalized.length <= maxChars) return normalized;
        const suffix = "...";
        const limit = Math.max(1, maxChars - suffix.length);
        const words = normalized.split(" ");
        let result = "";
        for (const word of words) {
            const next = result ? `${result} ${word}` : word;
            if (next.length > limit) {
                if (!result) {
                    return `${word.slice(0, limit)}${suffix}`;
                }
                break;
            }
            result = next;
        }
        return `${result}${suffix}`;
    };

    // 1. Initialization Logic
    useEffect(() => {
        const initCart = async () => {
            if (user) {
                // Logged In: Check for local items to sync first
                const localCart = JSON.parse(localStorage.getItem('cart')) || [];
                
                if (localCart.length > 0) {
                    try {
                        // Sync local items to server
                        await Promise.all(localCart.map(item => 
                            axios.post(`${import.meta.env.VITE_API_BASE_URL}/cart/add`, {
                                productId: item.product._id,
                                quantity: item.quantity
                            }, { withCredentials: true })
                        ));
                        
                        localStorage.removeItem('cart'); // Clear after sync
                        toast.success("Cart synced from guest session");
                    } catch (err) {
                        console.error("Cart sync failed", err);
                    }
                }

                // Fetch Final Server Cart
                try {
                    const { data } = await axios.get(
                        `${import.meta.env.VITE_API_BASE_URL}/cart`, 
                        { withCredentials: true }
                    );
                    if (data.success) {
                        const items = data.cart?.cartItems || [];
                        dispatch({ type: 'SET_CART_ITEMS', payload: items });
                    }
                } catch (error) {
                    console.error("Failed to fetch server cart", error);
                }
            } else {
                // Guest: Load from LocalStorage
                const localCart = JSON.parse(localStorage.getItem('cart')) || [];
                dispatch({ type: 'SET_CART_ITEMS', payload: localCart });
            }
        };

        initCart();
    }, [user, dispatch]); // Re-run when user logs in/out

    // 2. Action Helpers
    const addToCart = async (product, quantity = 1) => {
        const item = { product, quantity };
        
        // Optimistic Redux Update
        dispatch({ type: 'ADD_TO_CART', payload: item });
        const displayName = formatProductName(product?.name);
        toast.success(`${displayName} added to cart`);

        if (user) {
            // Server Sync
            try {
                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/cart/add`,
                    { productId: product._id, quantity },
                    { withCredentials: true }
                );
            } catch (error) {
                toast.error("Failed to sync with server");
                // Ideally revert Redux here
            }
        } else {
            // LocalStorage Sync
            // We need to read the *latest* Redux state, but since we just dispatched, 
            // we can simulate the update for LS.
            const currentItems = JSON.parse(localStorage.getItem('cart')) || [];
            const existingIndex = currentItems.findIndex(i => i.product._id === product._id);
            if (existingIndex >= 0) {
                currentItems[existingIndex].quantity += quantity;
            } else {
                currentItems.push(item);
            }
            localStorage.setItem('cart', JSON.stringify(currentItems));
        }
    };

    const getItemName = (productId) => {
        const item = cartItems.find(entry => {
            const entryId = entry?.product?._id || entry?.product;
            return String(entryId) === String(productId);
        });
        return formatProductName(item?.product?.name || item?.name);
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        dispatch({ type: 'UPDATE_QTY', payload: { productId, quantity: newQuantity } });

        if (user) {
            try {
                await axios.put(
                    `${import.meta.env.VITE_API_BASE_URL}/cart/update`,
                    { productId, quantity: newQuantity },
                    { withCredentials: true }
                );
            } catch (error) {
                console.error("Update failed", error);
            }
        } else {
            const currentItems = JSON.parse(localStorage.getItem('cart')) || [];
            const updated = currentItems.map(item => 
                item.product._id === productId ? { ...item, quantity: newQuantity } : item
            );
            localStorage.setItem('cart', JSON.stringify(updated));
        }
    };

    const removeItem = async (productId) => {
        const itemName = getItemName(productId);
        dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
        toast.error(`${itemName} was removed`);

        if (user) {
            try {
                await axios.delete(
                    `${import.meta.env.VITE_API_BASE_URL}/cart/remove/${productId}`,
                    { withCredentials: true }
                );
            } catch (error) {
                console.error("Delete failed", error);
            }
        } else {
            const currentItems = JSON.parse(localStorage.getItem('cart')) || [];
            const updated = currentItems.filter(item => item.product._id !== productId);
            localStorage.setItem('cart', JSON.stringify(updated));
        }
    };

    return {
        cartItems,
        cartCount,
        addToCart,
        updateQuantity,
        removeItem
    };
};

export default useCart;
