import os
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")


def test_demo_golden_path_and_controlled_errors():
    session = requests.Session()
    login = session.post(f"{BASE_URL}/api/demo/login", json={"username": "operator", "password": "demo-operator"})
    assert login.status_code == 200
    token = login.json()["token"]
    session.headers["Authorization"] = f"Bearer {token}"

    state = session.get(f"{BASE_URL}/api/demo/state")
    assert state.status_code == 200
    assert state.json()["company"]["id"] == "NSC-2048"

    assert session.post(f"{BASE_URL}/api/demo/ingest", json={"kind": "valid"}).json()["status"] == "ready"
    assert session.post(f"{BASE_URL}/api/demo/ingest", json={"kind": "invalid"}).json()["status"] == "needs_correction"
    pcf = session.post(f"{BASE_URL}/api/demo/pcf", json={"delta": 1}).json()
    assert pcf["version"] == "PCF-08" and pcf["total"] != 2.84
    assert session.post(f"{BASE_URL}/api/demo/pcf", json={"delta": -1}).json()["version"] == "PCF-07"
    assert session.post(f"{BASE_URL}/api/demo/workflow", json={"action": "correct"}).status_code == 200
    assert session.post(f"{BASE_URL}/api/demo/workflow", json={"action": "verify"}).json()["workflow"]["locked"] is True
    issued = session.post(f"{BASE_URL}/api/demo/workflow", json={"action": "issue"})
    assert issued.status_code == 200
    assert session.post(f"{BASE_URL}/api/demo/workflow", json={"action": "issue"}).status_code == 409

    passport_id = issued.json()["passport"]["id"]
    public = session.get(f"{BASE_URL}/api/public/verify/{passport_id}")
    assert public.status_code == 200 and public.json()["status"] == "valid"
    unknown = session.get(f"{BASE_URL}/api/public/verify/UNKNOWN-TEST")
    assert unknown.status_code == 200 and unknown.json()["status"] == "unverifiable"
    assert session.post(f"{BASE_URL}/api/demo/role", json={"role": "bad-role"}).status_code == 400


def test_public_unissued_default_identifier_is_not_valid():
    # This assertion exposes whether a fresh demo state can falsely claim an issued passport.
    response = requests.get(f"{BASE_URL}/api/public/verify/SAU-NSC-08-4F2A")
    assert response.status_code == 200
    assert response.json()["status"] == "unverifiable"