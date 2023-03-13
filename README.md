# Capstone-OSM

## Getting Started
### NPM Version
Ensure your node version is 16.X.

### Create Virtual Environment (Optional)

This step is optional, but **highly recommended**.

- Create a virtual environment
  ```
  python3 -m venv /path/to/your/virtual/environment
  ```
- Avtivate the virtual environment
  ```
  source /path/to/your/virtual/environment/bin/activate
  ```
- Deavtivate the virtual environment
  ```
  deactivate
  ```

### Install the libraries
#### 1. Backend (Django)

Make sure you are in the directory containing requirements.txt

At this step, make sure you've activated your virtual environment (if you decided to use python virtual environment).

```
pip install -r requirements.txt
```

#### 2. Frontend (Angular)
Make sure you are in the directory 'angular'.

Run the following command
```
npm install
```

### Connect to database (MongoDB)
Ensure you have these install on you device.
- brew

Run the following commands:

```
brew tap mongodb/brew
brew update                                 //get the lastest fomulars
brew install mongodb-community@6.0          //install the mongodb server
brew services start mongodb-community@6.0   //start the server in your local devide
```

To stop the server:
```
brew services stop mongodb-community@6.0
```

## Run the application
You need to open two terminal to run the front and back end.

1. BACKEND - Change the directory into the outer 'osm' folder. Run the following command:

```
cd osm
./manage.py runserver
```

2. FRONTEND - Change the directory into the 'angular' folder. Run the following command:

```
cd angular
npm start
```