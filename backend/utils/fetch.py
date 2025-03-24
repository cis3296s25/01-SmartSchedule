import requests
import time

def get_all_subjects(term_code: str) -> list[str]:
    """
    Sends POST request to Temple's registration system to get a list of all subject codes for a given semester term
    Params: ("202501")
    Returns: ["CIS", "MATH", "BIOL"...]
    """
    try:
        res = requests.post(
            "https://prd-xereg.temple.edu/StudentRegistrationSsb/ssb/classSearch/get_subject",
            json={"term": term_code}
        )
        data = res.json()
        return [entry["code"] for entry in data]
    except Exception as e:
        print(f"Error fetching subjects: {e}")
        return []

