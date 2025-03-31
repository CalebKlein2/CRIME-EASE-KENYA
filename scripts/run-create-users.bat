@echo off
echo Creating sample users for Crime Ease Kenya...
cd %~dp0..
echo.
echo Before running this script, make sure you have:
echo 1. Created a .env.local file with your Clerk and Convex credentials
echo 2. Installed required dependencies (npm install dotenv @clerk/clerk-sdk-node convex)
echo.
echo Running script...
node scripts/create-sample-users.mjs
echo.
echo If you encounter any errors, check your .env.local file and make sure all dependencies are installed.
pause
