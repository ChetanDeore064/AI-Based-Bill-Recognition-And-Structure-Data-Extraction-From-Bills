from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter(prefix="/clients", tags=["Clients Directory"])

class ClientModel(BaseModel):
    id: str
    name: str
    contact: str
    email: str
    gstin: str
    address: str
    billCount: int = 0
    pendingCount: int = 0
    totalValue: float = 0.0

_CLIENTS_DB: Dict[str, ClientModel] = {
    "client-001": ClientModel(
        id="client-001",
        name="ABC Enterprises",
        contact="Rajesh Patil",
        email="rajesh@abcenterprises.in",
        gstin="27ABCDE1234F1Z5",
        address="123 MG Road, Pune, Maharashtra 411001",
        billCount=245,
        pendingCount=12,
        totalValue=1240000.0,
    ),
    "client-002": ClientModel(
        id="client-002",
        name="Patil Industries",
        contact="Suresh Patil",
        email="suresh@patilindustries.com",
        gstin="27HIJKL0123M1Z1",
        address="45 MIDC Industrial Area, Nashik, Maharashtra 422007",
        billCount=180,
        pendingCount=5,
        totalValue=890000.0,
    ),
}

@router.get("", response_model=List[ClientModel])
async def list_clients():
    return list(_CLIENTS_DB.values())

@router.post("", response_model=ClientModel)
async def create_client(client: ClientModel):
    _CLIENTS_DB[client.id] = client
    return client

@router.get("/{client_id}", response_model=ClientModel)
async def get_client(client_id: str):
    if client_id not in _CLIENTS_DB:
        raise HTTPException(status_code=404, detail="Client not found")
    return _CLIENTS_DB[client_id]
