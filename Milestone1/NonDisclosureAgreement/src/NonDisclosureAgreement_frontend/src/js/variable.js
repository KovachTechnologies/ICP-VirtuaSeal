        // JavaScript code to handle user input and set a variable

        // Initialize the variable to store the user input
        let userVariable = '';

        // Function to handle user input and set the variable
        function handleUserInput() {
            // Get the user input from the input field
	console.log( "1" );
            const userInput = document.getElementById('userInput').value;
	console.log( "2" );

            // Set the userVariable to the user's input
            userVariable = userInput;
	console.log( "3" );

            // Display the userVariable in the HTML
            document.getElementById('outputVariable').textContent = userVariable;
	console.log( "4" );
        }

