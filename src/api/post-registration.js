async function postRegistration(registrationData) {
    const url = `${import.meta.env.VITE_API_URL}/users/`;
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
    });

    if (!response.ok) {
        const fallbackError = `Error trying to register`;
        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });
        const errorMessage = data?.detail ?? fallbackError;
        throw new Error(errorMessage);
    }

    return await response.json();
}

export default postRegistration;