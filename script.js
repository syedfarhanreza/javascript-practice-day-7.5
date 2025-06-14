document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const mealCardsContainer = document.getElementById('mealCardsContainer');
    const notFoundMessage = document.getElementById('notFoundMessage');
    const mealDetailsContainer = document.getElementById('mealDetailsContainer');
    const mealDetailsContent = document.getElementById('mealDetailsContent');

    searchBtn.addEventListener('click', fetchMeals);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchMeals();
        }
    });

    async function fetchMeals() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm === '') {
            alert('Please enter a meal name to search.');
            return;
        }

        mealCardsContainer.innerHTML = ''; 
        notFoundMessage.style.display = 'none';
        mealDetailsContainer.style.display = 'none'; 

        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
            const data = await response.json();

            if (data.meals) {
                displayMeals(data.meals);
            } else {
                notFoundMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error fetching meals:', error);
            alert('Failed to fetch meals. Please try again later.');
        }
    }

    function displayMeals(meals) {
        mealCardsContainer.innerHTML = ''; 
        mealDetailsContainer.style.display = 'none'; 

        meals.forEach(meal => {
            const mealCard = document.createElement('div');
            mealCard.classList.add('col-md-3', 'col-sm-6', 'mb-4');
            mealCard.innerHTML = `
                <div class="meal-card" data-meal-id="${meal.idMeal}">
                    <img src="${meal.strMealThumb}" class="img-fluid" alt="${meal.strMeal}">
                    <h5>${meal.strMeal}</h5>
                </div>
            `;
            mealCardsContainer.appendChild(mealCard);

            mealCard.querySelector('.meal-card').addEventListener('click', () => {
                fetchMealDetails(meal.idMeal);
            });
        });
    }

    async function fetchMealDetails(mealId) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
            const data = await response.json();

            if (data.meals && data.meals.length > 0) {
                displayMealDetails(data.meals[0]);
            } else {
                alert('Meal details not found.');
            }
        } catch (error) {
            console.error('Error fetching meal details:', error);
            alert('Failed to fetch meal details. Please try again later.');
        }
    }

    function displayMealDetails(meal) {
        mealCardsContainer.innerHTML = ''; 
        notFoundMessage.style.display = 'none'; 

        let ingredientsList = '';
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim() !== '') {
                ingredientsList += `<li>${measure} ${ingredient}</li>`;
            }
        }

        mealDetailsContent.innerHTML = `
            <div class="meal-card">
                <img src="${meal.strMealThumb}" class="img-fluid" alt="${meal.strMeal}">
                <h5>${meal.strMeal}</h5>
                <h4>Ingredients:</h4>
                <ul>
                    ${ingredientsList}
                </ul>
            </div>
        `;
        mealDetailsContainer.style.display = 'block'; 
    }
}); 