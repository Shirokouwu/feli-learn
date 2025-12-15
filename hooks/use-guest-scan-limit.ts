"use client";

import { useState, useEffect, useCallback } from "react";

const GUEST_SCAN_KEY = "feli_guest_scans";
const MAX_FREE_SCANS = 2;

interface GuestScanLimit {
    count: number;
    lastScanDate: string;
}

export interface UseGuestScanLimitReturn {
    /** Number of scans used by guest */
    guestScanCount: number;
    /** Maximum free scans allowed */
    maxFreeScans: number;
    /** Remaining free scans */
    remainingScans: number;
    /** Whether the guest has reached the scan limit */
    hasReachedLimit: boolean;
    /** Whether the guest can still scan */
    canScan: boolean;
    /** Increment the guest scan count */
    incrementScanCount: () => void;
    /** Reset the guest scan count (for testing or if needed) */
    resetScanCount: () => void;
    /** Check if user is logged in */
    isLoggedIn: boolean;
    /** Set the login state */
    setIsLoggedIn: (value: boolean) => void;
}

export const useGuestScanLimit = (): UseGuestScanLimitReturn => {
    const [guestScanCount, setGuestScanCount] = useState<number>(0);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    // Load guest scan count from localStorage on mount
    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            const stored = localStorage.getItem(GUEST_SCAN_KEY);
            if (stored) {
                const data: GuestScanLimit = JSON.parse(stored);
                setGuestScanCount(data.count);
            }
        } catch (error) {
            console.error("Error loading guest scan count:", error);
            // Reset if corrupted
            localStorage.removeItem(GUEST_SCAN_KEY);
        }
        setIsInitialized(true);
    }, []);

    // Save guest scan count to localStorage
    const saveScanCount = useCallback((count: number) => {
        if (typeof window === "undefined") return;

        try {
            const data: GuestScanLimit = {
                count,
                lastScanDate: new Date().toISOString(),
            };
            localStorage.setItem(GUEST_SCAN_KEY, JSON.stringify(data));
        } catch (error) {
            console.error("Error saving guest scan count:", error);
        }
    }, []);

    // Increment the guest scan count
    const incrementScanCount = useCallback(() => {
        if (isLoggedIn) return; // Don't count if logged in

        const newCount = guestScanCount + 1;
        setGuestScanCount(newCount);
        saveScanCount(newCount);
    }, [guestScanCount, isLoggedIn, saveScanCount]);

    // Reset the guest scan count
    const resetScanCount = useCallback(() => {
        setGuestScanCount(0);
        if (typeof window !== "undefined") {
            localStorage.removeItem(GUEST_SCAN_KEY);
        }
    }, []);

    // Calculate derived values
    const remainingScans = Math.max(0, MAX_FREE_SCANS - guestScanCount);
    const hasReachedLimit = guestScanCount >= MAX_FREE_SCANS;
    const canScan = isLoggedIn || !hasReachedLimit;

    return {
        guestScanCount,
        maxFreeScans: MAX_FREE_SCANS,
        remainingScans,
        hasReachedLimit,
        canScan,
        incrementScanCount,
        resetScanCount,
        isLoggedIn,
        setIsLoggedIn,
    };
};
