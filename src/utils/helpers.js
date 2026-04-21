/**
 * Bytes ko readable format mein convert karta hai (e.g. 1024 -> 1 KB)
 */
export const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * File extension nikalne ke liye
 */
export const getFileExtension = (filename) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

/**
 * Custom Delay (agar humein kahin fake wait karwana ho)
 */
export const delay = (ms) => new Promise(res => setTimeout(res, ms));