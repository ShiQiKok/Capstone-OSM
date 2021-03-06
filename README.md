# Capstone-OSM

## Getting Started

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

At this step, make sure you've activated your virtual environment (if you decided to use python virtual environment).

```
pip install -r requirements.txt
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