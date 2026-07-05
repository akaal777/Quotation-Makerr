from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="NewFriends SolarEnergy Quotation API")
api_router = APIRouter(prefix="/api")


# =============================
# Models
# =============================
class QuotationItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    sr: str
    label: str


class QuotationCreate(BaseModel):
    customer_name: str
    phone: str
    address: str
    quotation_date: str  # ISO date string yyyy-mm-dd
    service: str  # e.g. Solar Rooftop
    kw_range: str  # e.g. "3 KW"
    total_amount: float
    items: List[QuotationItem]
    notes: Optional[str] = ""


class Quotation(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    quote_no: str  # human-friendly quote number
    customer_name: str
    phone: str
    address: str
    quotation_date: str
    service: str
    kw_range: str
    total_amount: float
    gst_rate: float = 8.9
    basic_price: float
    gst_amount: float
    items: List[QuotationItem]
    notes: Optional[str] = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# =============================
# Helpers
# =============================
def compute_totals(total_amount: float, gst_rate: float = 8.9):
    # GST is a straight percentage of the entered Total amount.
    # e.g. Total=100000, GST=8.9% => gst=8900, basic=91100
    gst = round(total_amount * (gst_rate / 100.0), 2)
    basic = round(total_amount - gst, 2)
    return basic, gst


async def next_quote_no() -> str:
    year = datetime.now(timezone.utc).strftime("%Y")
    prefix = f"NFS/{year}/"
    # Count existing docs for this year
    count = await db.quotations.count_documents({"quote_no": {"$regex": f"^{prefix}"}})
    return f"{prefix}{count + 1:04d}"


# =============================
# Routes
# =============================
@api_router.get("/")
async def root():
    return {"message": "NewFriends SolarEnergy Quotation API"}


@api_router.post("/quotations", response_model=Quotation)
async def create_quotation(payload: QuotationCreate):
    if payload.total_amount <= 0:
        raise HTTPException(status_code=400, detail="total_amount must be greater than 0")

    basic, gst = compute_totals(payload.total_amount, 8.9)
    quote_no = await next_quote_no()
    q = Quotation(
        quote_no=quote_no,
        customer_name=payload.customer_name,
        phone=payload.phone,
        address=payload.address,
        quotation_date=payload.quotation_date,
        service=payload.service,
        kw_range=payload.kw_range,
        total_amount=round(payload.total_amount, 2),
        gst_rate=8.9,
        basic_price=basic,
        gst_amount=gst,
        items=payload.items,
        notes=payload.notes or "",
    )
    doc = q.model_dump()
    await db.quotations.insert_one(doc)
    return q


@api_router.get("/quotations", response_model=List[Quotation])
async def list_quotations():
    docs = await db.quotations.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs


@api_router.get("/quotations/{quote_id}", response_model=Quotation)
async def get_quotation(quote_id: str):
    doc = await db.quotations.find_one({"id": quote_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Quotation not found")
    return doc


@api_router.delete("/quotations/{quote_id}")
async def delete_quotation(quote_id: str):
    res = await db.quotations.delete_one({"id": quote_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Quotation not found")
    return {"success": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
