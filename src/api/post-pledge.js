async function postPledge(pledgeData, fundraiserId) {
    const url = `${import.meta.env.VITE_API_URL}/pledges/`;
    const token = localStorage.getItem('token');
    
    console.log('=== POST-PLEDGE API DEBUG ===');
    console.log('1. API URL:', url);
    console.log('2. Token exists:', !!token);
    console.log('3. Fundraiser ID:', fundraiserId);
    console.log('4. Original pledge data:', pledgeData);
    
    // Prepare the data with all required fields
    const dataToSend = {
        amount: parseFloat(pledgeData.amount),
        comment: pledgeData.comment || '',
        anonymous: pledgeData.anonymous || false,
        fundraiser: parseInt(fundraiserId), 
        supporter: null, // Assuming the backend assigns the supporter based on the token
    };

    console.log('5. Final data to send:', dataToSend);
    console.log('6. fundraiserId type:', typeof fundraiserId, 'value:', fundraiserId);
    console.log('7. parseInt result:', parseInt(fundraiserId));
    console.log('8. Is fundraiserId valid?', !isNaN(parseInt(fundraiserId)));
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        },
        body: JSON.stringify(dataToSend),
    });

    console.log('7. Response status:', response.status);

    if (!response.ok) {
        const responseText = await response.text();
        console.error('9. Error response text:', responseText);
        
        let errorData;
        try {
            errorData = JSON.parse(responseText);
            console.error('10. Error response JSON:', errorData);
        } catch (e) {
            errorData = { error: responseText };
        }
        
        throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const successData = await response.json();
    console.log('12. Success response:', successData);
    return successData;
}

export default postPledge;