import cv2
import time
import math
import matplotlib.pyplot as plt
import numpy as np

# Load Haar cascade classifiers for face and eyes
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')


def analyze_data(data, y_min=0, y_max=1, title="Data Analysis", window_size=None):
    """
    Analyze and plot data with a trend line and moving average.
    
    Parameters:
    - data: List of [x, y] points
    - y_min, y_max: Fixed y-axis limits
    - title: Plot title
    - window_size: Size of moving average window (defaults to ~10% of data points)
    """


    # Extract x and y values
    x = [point[0] for point in data]
    y = [point[1] for point in data]

    # Set default window size if not provided
    if window_size is None:
        window_size = max(5, len(data) // 10) # Default to ~10% of data points, minimum 5

    # Calculate trend line
    z = np.polyfit(x, y, 1)
    p = np.poly1d(z)

    # create the plot
    plt.figure(figsize=(12, 6)) # Create a large figure for better visibility

    # Plot data points
    #plt.scatter(x, y, color='blue', s=20, alpha=0.7, label='Data')

    # Plot trend line
    x_line = np.linspace(min(x), max(x), 1000)
    plt.plot(x_line, p(x_line), 'r--', linewidth=2.0, label=f'Trend line: y={z[0]:.4f}x + {z[1]:.4f}')

    # Calculate moving average if we have enough data points
    if len(y) > window_size:
        moving_avg = []
        for i in range(len(y) - window_size + 1):
            window_avg = sum(y[i:i+window_size]) / window_size
            moving_avg.append(window_avg)

        moving_avg_x = x[window_size-1:][:len(moving_avg)]
        plt.plot(moving_avg_x, moving_avg, 'g--', linewidth=1.5,
                 label=f'Moving avg (window={window_size})')

    # Add grid for better readability
    plt.grid(True, linestyle='--', alpha=0.7)

    # Set the plot and limits
    x_padding = (max(x) - min(x)) * 0.02 # 2% padding on each side
    plt.xlim(min(x) - x_padding, max(x) + x_padding)
    plt.ylim(y_min, y_max)

    # Add labels, title, and legend
    plt.xlabel('X-axis')
    plt.ylabel('Y-axis')
    plt.title(title)
    plt.legend()

    # Show plot
    plt.tight_layout() # Adjust the layout
    plt.show()

    # Print the trend line equation
    print(f"Trend line equation: y = {z[0]:.6f}x + {z[1]:.6f}")

    # Additional statistics
    avg_y = sum(y) / len(y)
    print(f"Average y=value: {avg_y:.6f}")
    print(f"Data range: x from {min(x):.2f} to {max(x):.2f}, y from {min(y):.2f} to {max(y):.2f}")
    print(f"Number of data points: {len(data)}")

    return {
        "slope": z[0],
        "intercept": z[1],
        "average_y": avg_y,
        "x_range": (min(y), max(x)),
        "y_range": (min(y), max(y)),
        "data_count": len(data)
    }


# Open webcam
cap = cv2.VideoCapture(0)
past = time.time()
timeh = []
while True:

    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)
    eyes = []
    for (x, y, w, h) in faces:
        # Draw rectangle around face
        cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
        roi_gray = gray[y:y+h, x:x+w]
        roi_color = frame[y:y+h, x:x+w]

        # Detect eyes within the face
        eyes = eye_cascade.detectMultiScale(roi_gray, scaleFactor=1.1, minNeighbors=10)
        for (ex, ey, ew, eh) in eyes:
            cv2.rectangle(roi_color, (ex, ey), (ex+ew, ey+eh), (0, 255, 0), 2)
    #print(len(eyes) > 0)
    if len(eyes) > 0:
        timeh.append(1)
    else:
        timeh.append(0)
    cv2.imshow('Eye Detection', frame)

    # Press Q to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
curr = time.time()

print(len(timeh))
totTime = int(math.floor(curr - past))
print(totTime)

binSize = len(timeh)//(totTime*2)
binRem = len(timeh)%(totTime*2)
totSize = len(timeh) - binRem
print(str(binSize) +" " + str(binRem) + " " + str(totSize))

data = []
sum1 = 0
y = .5
for x in range(totSize+1):
    if x%binSize == 0 and x != 0:
        print(x)
        data.append([y,sum1/binSize])
        sum1 = 0
        y += .5
    sum1 += timeh[x]
print(data)

analyze_data(data, y_min=-0.1, y_max=1.1, title="Data with Fixed Y-Axis")

cap.release()
cv2.destroyAllWindows()
