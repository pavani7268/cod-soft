import random

def get_user_choice():
    """
    Prompts the user to choose rock, paper, or scissors.
    Validates the input and returns the choice.
    """
    while True:
        choice = input("Choose rock, paper, or scissors: ").lower()
        if choice in ['rock', 'paper', 'scissors']:
            return choice
        else:
            print("Invalid choice. Please choose rock, paper, or scissors.")

def get_computer_choice():
    """
    Generates a random choice for the computer.
    """
    return random.choice(['rock', 'paper', 'scissors'])

def determine_winner(user_choice, computer_choice):
    """
    Determines the winner based on the game rules.
    Returns 'user', 'computer', or 'tie'.
    """
    if user_choice == computer_choice:
        return "tie"
    elif (user_choice == 'rock' and computer_choice == 'scissors') or \
         (user_choice == 'scissors' and computer_choice == 'paper') or \
         (user_choice == 'paper' and computer_choice == 'rock'):
        return "user"
    else:
        return "computer"

def main():
    """
    Main game loop.
    Handles score tracking and multiple rounds.
    """
    user_score = 0
    computer_score = 0
    print("Welcome to Rock Paper Scissors!")
    print("Rules: Rock beats scissors, scissors beat paper, paper beats rock.")
    print("Let's play!\n")

    while True:
        user_choice = get_user_choice()
        computer_choice = get_computer_choice()
        winner = determine_winner(user_choice, computer_choice)

        print(f"\nYou chose: {user_choice}")
        print(f"Computer chose: {computer_choice}")

        if winner == "tie":
            print("It's a tie!")
        elif winner == "user":
            print("You win!")
            user_score += 1
        else:
            print("Computer wins!")
            computer_score += 1

        print(f"Score: You {user_score} - Computer {computer_score}")

        play_again = input("\nPlay again? (y/n): ").lower()
        if play_again != 'y':
            print("Thanks for playing!")
            break

if __name__ == "__main__":
    main()