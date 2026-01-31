"""Country and State response schemas."""

from pydantic import BaseModel


class StateOut(BaseModel):
    code: str
    name: str


class CountryOut(BaseModel):
    code: str
    name: str
    region: str
    phone_code: str = ""
    display_order: int = 0


class CountryWithStatesOut(CountryOut):
    states: list[StateOut] = []
