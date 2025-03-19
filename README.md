# Smart Schedule
The application takes into account the courses a student wants to take and all
available sections of each course. It then uses a scheduling algorithm to generate all possible
schedules without any time conflicts. This allows students to easily explore different scheduling
options. The application features a user-friendly interface where students can enter their course
preferences, view the generated schedules, and choose the one that works best for them based on
their personal needs and preferences 

# How to run
For Windows
Click on Releases to get the latest release
Click on schedule_compiler_windows.zip to download it
Go to the folder where you downloaded the zip file
Right-click on the zip file and click "Extract all"
Pick a folder to extract the file(s) to
Double-click on schedule_compiler.exe in the folder you selected to extract the file to to run
For Linux
Click on Releases to get the latest release
Click on the schedule_compiler_linux.tar.gz file to download it
In your terminal, navigate to the directory where the file was downloaded
Enter "tar -xvzf " and then the file name in the terminal and click enter
Type "./schedule_compiler" to run
How to contribute
Follow this project board to know the latest status of the project in the project board. Submit a PR with working code.

# How to build
Clone the repository in your desired IDE that works with Python
git clone "https://github.com/cis3296f23/01-Schedule-Compiler/"
Set up the virtual environment (done only once):
For Windows, run "py -3 -m venv .venv"
For Linux, run "python3 -m venv .venv"
Run the virtual environment (done every time you open up the project):
For Windows, run ".venv/scripts/activate"
For Linux, run "source .venv/bin/activate"
Run "pip install -r requirements.txt"
In Linux, run "sudo apt-get install python3-tk"
Run "python schedule_compiler.py"
User interface should show up with title "Schedule Compiler" and options for preferences in schedule creation
