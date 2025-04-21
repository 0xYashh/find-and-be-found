document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');

    // Handle profile submission
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = profileForm.querySelector('.submit-btn');
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Creating...';
        submitBtn.disabled = true;
        
        const formData = {
            name: document.getElementById('name').value,
            location: document.getElementById('location').value,
            interests: document.getElementById('interests').value,
            intro: document.getElementById('intro').value,
            socialLinks: document.getElementById('socialLinks').value,
            building: document.getElementById('building').value
        };

        try {
            const response = await fetch('/api/profiles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                showSuccessMessage('Profile created successfully!');
                profileForm.reset();
            } else {
                throw new Error(data.error || 'Failed to create profile');
            }
        } catch (error) {
            showErrorMessage(error.message);
        } finally {
            submitBtn.innerHTML = originalBtnContent;
            submitBtn.disabled = false;
        }
    });

    // Handle search
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    async function performSearch() {
        const query = searchInput.value.trim();
        if (!query) return;

        // Show loading state
        searchResults.innerHTML = `
            <div class="searching">
                <span>Searching</span>
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query })
            });

            const data = await response.json();

            if (response.ok) {
                displaySearchResults(data);
            } else {
                throw new Error(data.error || 'Search failed');
            }
        } catch (error) {
            showErrorMessage(error.message);
        }
    }

    function displaySearchResults(data) {
        let html = `<p class="search-message">${data.message}</p>`;
        
        if (data.profiles && data.profiles.length > 0) {
            html += data.profiles.map(profile => `
                <div class="profile-card">
                    <h3>
                        <i class='bx bx-user-circle'></i>
                        ${profile.name}
                    </h3>
                    <div class="location">
                        <i class='bx bx-map'></i>
                        ${profile.location}
                    </div>
                    ${profile.building ? `
                        <p>
                            <i class='bx bx-building-house'></i>
                            <strong>Building:</strong> ${profile.building}
                        </p>
                    ` : ''}
                    ${profile.intro ? `
                        <p>
                            <i class='bx bx-message-square-detail'></i>
                            ${profile.intro}
                        </p>
                    ` : ''}
                    ${profile.interests && profile.interests.length > 0 ? `
                        <div class="interests">
                            ${profile.interests.map(interest => `
                                <span class="interest-tag">
                                    <i class='bx bx-star'></i>
                                    ${interest}
                                </span>
                            `).join('')}
                        </div>
                    ` : ''}
                    ${profile.social_links ? `
                        <p class="social-links">
                            <i class='bx bx-link'></i>
                            <strong>Connect:</strong> 
                            <a href="${profile.social_links}" target="_blank" rel="noopener noreferrer">
                                ${profile.social_links}
                            </a>
                        </p>
                    ` : ''}
                </div>
            `).join('');
        }

        searchResults.innerHTML = html;
    }

    function showErrorMessage(message) {
        searchResults.innerHTML = `
            <div class="error-message">
                <i class='bx bx-error-circle'></i>
                ${message}
            </div>
        `;
    }

    function showSuccessMessage(message) {
        searchResults.innerHTML = `
            <div class="success-message">
                <i class='bx bx-check-circle'></i>
                ${message}
            </div>
        `;
    }
}); 