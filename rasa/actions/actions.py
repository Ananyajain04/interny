# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []
import requests
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

# ---- INTENT ANSWERS ----
class ActionFetchIntentInfo(Action):
    def name(self) -> Text:
        return "action_fetch_intent_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        intent_name = tracker.latest_message['intent'].get('name')
        url = f"http://localhost:8000/intent/{intent_name}"
        try:
            res = requests.get(url)
            if res.status_code == 200:
                data = res.json()
                dispatcher.utter_message(text=data.get("long_answer", "No data found."))
            else:
                dispatcher.utter_message(text="Sorry, I couldn’t find that information.")
        except Exception as e:
            dispatcher.utter_message(text=f"Server error: {e}")

        return []


# ---- COMPANY INFO ----
class ActionFetchCompanyDetails(Action):
    def name(self) -> Text:
        return "action_fetch_company_details"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # extract entity
        company_entity = next(tracker.get_latest_entity_values("company"), None)

        if not company_entity:
            dispatcher.utter_message(text="Which company are you referring to?")
            return []

        url = f"http://localhost:8000/company/{company_entity}"
        try:
            res = requests.get(url)
            if res.status_code == 200:
                data = res.json()
                reply = (
                    f"{data['company']} selected {data['internships']} interns this season.\n"
                    f"CGPA Cutoff: {data.get('cgpa_cutoff', 'N/A')}\n"
                    f"Drive Mode: {data.get('drive_mode', 'N/A')}\n"
                    f"Month: {data.get('month', 'N/A')}\n"
                    f"Notes: {data.get('notes', '')}"
                )
                dispatcher.utter_message(text=reply)
            else:
                dispatcher.utter_message(text="Sorry, I don’t have details for that company.")
        except Exception as e:
            dispatcher.utter_message(text=f"Server error: {e}")

        return []
