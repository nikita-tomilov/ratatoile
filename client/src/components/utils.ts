// Here you can change the time between to requests for the data
export const fetchDataTimer = 3000;

export const setUpAnIntervalPollingOfFunction = (updateData: () => void): () => void => {
    updateData();
    const interval = setInterval(updateData, fetchDataTimer);
    return () => clearInterval(interval);
}