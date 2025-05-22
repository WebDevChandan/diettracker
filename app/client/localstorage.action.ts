"use client";

export function getLocalStorageData(key: string) {
    const fetchedLocalData = localStorage.getItem(key) as string;

    const parsedData = JSON.parse(fetchedLocalData);
    return parsedData;
}

export function setLocalStorageData(key: string, value: any) {
    const stringifyData = JSON.stringify(value);
    
    localStorage.setItem(key, stringifyData);
}