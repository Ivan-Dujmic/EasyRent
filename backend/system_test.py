from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from time import sleep
from selenium.webdriver.support.ui import Select

# Setup
chrome_driver_path = "/usr/bin/chromedriver"  # Update this path if necessary
service = Service(chrome_driver_path)

options = Options()
# (Optional) Run in headless mode
# options.add_argument("--headless")

# Initialize WebDriver
driver = webdriver.Chrome(service=service, options=options)
wait = WebDriverWait(driver, 10)  # WebDriverWait with a timeout of 10 seconds

# Open the homepage URL
driver.get("https://easy-rent-ashy.vercel.app/home")

# Wait for the login link to be clickable
login_div = wait.until(
    EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'Login')]"))
)

# Click the Login div
login_div.click()
sleep(2)

# Wait for the login page to load (check the URL)
wait.until(EC.url_to_be("https://easy-rent-ashy.vercel.app/login"))
print("Login page loaded!")

# Locate the email input field using the 'type' attribute
email_input = wait.until(
    EC.presence_of_element_located((By.XPATH, "//input[@type='email']"))
)
email_input.send_keys("ava@example.com")
sleep(1)

# Locate the password input field using the 'type' attribute
password_input = wait.until(
    EC.presence_of_element_located((By.XPATH, "//input[@type='password']"))
)
password_input.send_keys("username")
sleep(1)

# Locate the login button and click it
login_button = wait.until(
    EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Login')]"))
)
login_button.click()

# Wait for the next page to load (for example, a redirect to the home page after successful login)
wait.until(EC.url_to_be("https://easy-rent-ashy.vercel.app/home"))
print("Logged in successfully!")

# Wait for the page to load and find the input fields
sleep(1)  # Small delay to ensure the page is fully loaded

# Find all input fields on the page
input_fields = wait.until(EC.presence_of_all_elements_located((By.XPATH, "//input")))

# Ensure there are at least 4 input fields
print(len(input_fields))
if len(input_fields) >= 4:
    # Fill the input fields in the required order:
    input_fields[0].click()  # Click the first input field
    sleep(1)  # Wait for 1 second to ensure it's focused

    # Find and click the "Sydney" button after clicking the first input field
    sydney_button = driver.find_element(
        By.XPATH, "//button[contains(text(), 'Sydney')]"
    )
    sydney_button.click()
    sleep(1)  # Wait for a moment after clicking the Sydney button

    # Click the second input field
    input_fields[1].click()  # Click the second input field
    sleep(1)  # Wait for 1 second to ensure it's focused

    # Find and click the "Sydney" button after clicking the second input field
    sydney_button = driver.find_element(
        By.XPATH, "//button[contains(text(), 'Sydney')]"
    )
    sydney_button.click()
    sleep(1)  # Wait for a moment after clicking the Sydney button

    # For the third and fourth fields (date pickers):
    date_input_3 = input_fields[2]
    date_input_4 = input_fields[3]

    date_input_3.click()  # Click to open the date picker
    sleep(1)
    # **Step 2: Directly click the date button for the first date (24)**
    date_button_3 = driver.find_element(By.XPATH, "//button[.//abbr[text()='24']]")
    sleep(1)
    date_button_3.click()  # Click to select the date 22
    sleep(1)

    # **Step 3: Open the second date picker by clicking the second input field**
    date_input_4.click()  # Click to open the date picker for the second field
    sleep(1)
    # Directly click the date button for the second date (31)
    date_button_4 = driver.find_element(By.XPATH, "//button[.//abbr[text()='28']]")
    sleep(1)
    date_button_4.click()  # Click to select the date 31
    sleep(1)
    # Find the <select> elements for time
    time_selects = driver.find_elements(By.XPATH, "//select")
    sleep(1)
    if len(time_selects) >= 2:
        # Select the options for time (4th and 6th fields are time dropdowns)
        select_4th_time = Select(time_selects[0])
        select_4th_time.select_by_visible_text("10:00")  # Select the 10:00 option

        select_6th_time = Select(time_selects[1])
        select_6th_time.select_by_visible_text("15:00")  # Select the 15:00 option

        print("Successfully selected time in the dropdowns!")

    print("Successfully entered values into the first 4 input fields!")

else:
    print("Not enough input fields found on the page!")


sleep(3)  # Optional sleep for visual confirmation
try:
    search_button = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Search')]"))
    )
    search_button.click()  # Click the search button
    wait.until(EC.url_to_be("https://easy-rent-ashy.vercel.app/listing"))
    sleep(2)
    print("Search button clicked!")
except Exception as e:
    print(f"Error finding or clicking search button: {e}")
# Close the browser after all actions
try:
    sleep(1)
    checkbox_4_5 = driver.find_element(
        By.XPATH, "//input[@type='checkbox'][@value='4-5']"
    )
    span_4_5 = checkbox_4_5.find_element(By.XPATH, "following-sibling::span")
    checkbox_limo = driver.find_element(
        By.XPATH, "//input[@type='checkbox'][@value='Limo/Estate']"
    )
    span_limo = checkbox_limo.find_element(By.XPATH, "following-sibling::span")
    checkbox_manual = driver.find_element(
        By.XPATH, "//input[@type='checkbox'][@value='Manual']"
    )
    span_manual = checkbox_manual.find_element(By.XPATH, "following-sibling::span")
    # Click each checkbox individually with 1 second delay between clicks
    span_4_5.click()  # Click the "4-5" checkbox
    sleep(1)  # Wait for 1 second before clicking the next checkbox

    span_limo.click()  # Click the "Limo" checkbox
    sleep(1)  # Wait for 1 second before clicking the next checkbox

    span_manual.click()  # Click the "Manual" checkbox
    sleep(1)  # Wait for 1 second before continuing

    apply_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Apply')]")
    apply_button.click()  # Click the "Apply" button
    sleep(5)
except Exception as e:
    print(f"Error finding or clicking filter buttons: {e}")
try:
    driver.back()
    wait.until(EC.url_to_be("https://easy-rent-ashy.vercel.app/home"))
    sleep(3)
except Exception as e:
    print(f"Error going back: {e}")


buttons = driver.find_elements(By.CLASS_NAME, "chakra-button css-4csaz9")

# Click each button

driver.get("https://easy-rent-ashy.vercel.app/home")
# Find all input fields on the page
sleep(1)
input_fields = wait.until(EC.presence_of_all_elements_located((By.XPATH, "//input")))
sleep(1)
time_selects = driver.find_elements(By.XPATH, "//select")
sleep(1)
if len(time_selects) >= 2:
    select_4th_time = Select(time_selects[0])
    select_4th_time.select_by_visible_text("1:00")  # Select the 10:00 option

    select_6th_time = Select(time_selects[1])
    select_6th_time.select_by_visible_text("2:00")  # Select the 15:00 option
    search_button = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Search')]"))
    )
    search_button.click()  # Click the search button
    wait.until(EC.url_to_be("https://easy-rent-ashy.vercel.app/listing"))
    sleep(2)

    print("Successfully selected time in the dropdowns!")

print("Successfully entered values into the first 4 input fields!")

sleep(2)
driver.quit()
