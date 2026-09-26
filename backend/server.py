from fastapi import FastAPI, APIRouter, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional
import os, secrets

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")
client = AsyncIOMotorClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]
app = FastAPI(title="Saurient Carbon Passport Demo")
api = APIRouter(prefix="/api")

USERS = {
    "operator": {"password": "demo-operator", "name": "Maya Chen", "title": "Company Operator", "role": "operator"},
    "verifier": {"password": "demo-verifier", "name": "Jon Bell", "title": "Verifier", "role": "verifier"},
    "officer": {"password": "demo-officer", "name": "Priya Shah", "title": "Passport Officer", "role": "officer"},
}
sessions = {}
state = {
    "company": {"name": "Northstar Components", "id": "NSC-2048", "sector": "Industrial electronics", "facilities": 3, "products": 12, "suppliers": 28},
    "emissions": {"records": 148, "valid": 142, "invalid": 3, "duplicates": 3, "period": "FY 2025", "status": "ready"},
    "calculation": {"version": "v2.4", "scope1": 184.2, "scope2": 512.8, "scope3": 1267.4, "total": 1964.4, "updated": "18 Feb 2026, 14:32 UTC"},
    "pcf": {"version": "PCF-07", "product": "NSC Power Module 48V", "total": 2.84, "unit": "kgCO₂e / unit", "status": "calculated", "input": 0.0},
    "workflow": {"status": "submitted", "finding": True, "locked": False, "events": ["Draft created", "Submitted for MRV", "Finding raised: supplier allocation assumption"]},
    "passport": None,
}

async def persist(collection, document):
    try:
        await db[collection].update_one({"id": document.get("id")}, {"$set": document}, upsert=True)
    except Exception:
        pass

@app.on_event("startup")
async def seed():
    await persist("companies", {"id": "NSC-2048", **state["company"]})
    await persist("calculations", {"id": "NSC-CALC-v2.4", **state["calculation"]})
    await persist("products", {"id": "NSC-PCF-07", **state["pcf"]})

class Login(BaseModel):
    username: str
    password: str
class RoleChange(BaseModel):
    role: str
class ImportRequest(BaseModel):
    kind: str
class PCFChange(BaseModel):
    delta: float
class Action(BaseModel):
    action: str

def user_view(username, role=None):
    u = USERS[username]
    return {"username": username, "name": u["name"], "title": u["title"], "role": role or u["role"]}

def require_session(authorization: Optional[str]):
    token = authorization.replace("Bearer ", "") if authorization else ""
    if token not in sessions:
        raise HTTPException(401, "Demo session required")
    return sessions[token]

@api.get("/")
async def root(): return {"message": "Saurient Carbon Passport API", "demo": True}

@api.post("/demo/login")
async def login(body: Login):
    if body.username not in USERS or USERS[body.username]["password"] != body.password:
        raise HTTPException(401, "Use one of the three demo accounts")
    token = secrets.token_urlsafe(18)
    sessions[token] = {"username": body.username, "role": USERS[body.username]["role"]}
    return {"token": token, "user": user_view(body.username)}

@api.get("/demo/me")
async def me(authorization: Optional[str] = Header(None)):
    s = require_session(authorization); return {"user": user_view(s["username"], s["role"])}

@api.post("/demo/role")
async def role(body: RoleChange, authorization: Optional[str] = Header(None)):
    s = require_session(authorization)
    if body.role not in {"operator", "verifier", "officer"}: raise HTTPException(400, "Unknown demo role")
    s["role"] = body.role
    return {"user": user_view(s["username"], body.role)}

@api.get("/demo/state")
async def demo_state(authorization: Optional[str] = Header(None)):
    require_session(authorization); return state

@api.post("/demo/ingest")
async def ingest(body: ImportRequest, authorization: Optional[str] = Header(None)):
    require_session(authorization)
    if body.kind == "invalid": return {"status": "needs_correction", "message": "3 rows rejected: missing unit or factor", "invalid": 3}
    state["emissions"].update({"status": "ready", "valid": 142, "records": 148})
    return {"status": "ready", "message": "148 emissions records validated", "valid": 142}

@api.post("/demo/calculate")
async def calculate(authorization: Optional[str] = Header(None)):
    require_session(authorization); state["calculation"]["updated"] = "Just now · deterministic run"; return state["calculation"]

@api.post("/demo/pcf")
async def pcf(body: PCFChange, authorization: Optional[str] = Header(None)):
    require_session(authorization)
    state["pcf"]["input"] += body.delta; state["pcf"]["total"] = round(2.84 + state["pcf"]["input"] * 0.07, 2)
    state["pcf"]["version"] = "PCF-08" if state["pcf"]["input"] else "PCF-07"
    return state["pcf"]

@api.post("/demo/workflow")
async def workflow(body: Action, authorization: Optional[str] = Header(None)):
    s = require_session(authorization)
    if body.action == "correct": state["workflow"].update({"status": "corrected", "finding": False}); state["workflow"]["events"].append("Finding corrected · supplier allocation documented")
    elif body.action == "verify": state["workflow"].update({"status": "verified", "locked": True}); state["workflow"]["events"].append("Verified and locked by verifier")
    elif body.action == "issue":
        if not state["workflow"]["locked"]: raise HTTPException(409, "Verify and lock the record before issuing")
        if state["passport"]: raise HTTPException(409, "Passport already issued for PCF-08")
        state["passport"] = {"id": "SAU-NSC-08-4F2A", "status": "valid", "issued": "18 Feb 2026", "method": "Saurient v2.4 · deterministic", "product": state["pcf"]["product"]}
    else: raise HTTPException(400, "Unknown action")
    return {"workflow": state["workflow"], "passport": state["passport"], "actor": s["role"]}

@api.get("/public/verify/{passport_id}")
async def verify(passport_id: str):
    if passport_id != (state["passport"] or {}).get("id", "SAU-NSC-08-4F2A"):
        return {"status": "unverifiable", "message": "This Carbon Passport could not be found."}
    return {"status": "valid", "passport": state["passport"], "company": state["company"]["name"]}

app.include_router(api)
app.add_middleware(CORSMiddleware, allow_credentials=True, allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","), allow_methods=["*"], allow_headers=["*"])

@app.on_event("shutdown")
async def close_db(): client.close()