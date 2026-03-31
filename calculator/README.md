# Simple Calculator

A basic calculator application built in Python that performs arithmetic operations.

## Features

- Addition (+)
- Subtraction (-)
- Multiplication (*)
- Division (/)
- Error handling for invalid inputs and division by zero

## Usage

Run the calculator.exe file in the dist folder.

The program will prompt you to:
1. Enter the first number
2. Enter the operation (+, -, *, /)
3. Enter the second number

It will then display the result.

## Building from Source

If you have Python installed:

1. Install PyInstaller: `pip install pyinstaller`
2. Run: `pyinstaller --onefile calculator.py`
3. The executable will be in the `dist` folder.

## Files

- `calculator.py`: The main Python script
- `calculator.spec`: PyInstaller spec file
- `dist/calculator.exe`: The built executable
- `build/`: Build artifacts