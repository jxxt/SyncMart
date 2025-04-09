from fastapi import FastAPI
from firebase_admin import db, initialize_app, credentials
import os

# Firebase Admin Init
cred = credentials.Certificate("./firebase.json")
initialize_app(cred, {
    "databaseURL": "https://sync-mart-default-rtdb.asia-southeast1.firebasedatabase.app"
})

app = FastAPI()

@app.post("/sync-reserved")
def sync_reserved():
    ref = db.reference("global/products")
    products = ref.get()

    for product_id, data in products.items():
        addedtocart = data.get("addedtocart", {})
        quantity = data.get("quantity", 0)

        if addedtocart:
            # Sort by timestamp (values)
            sorted_users = sorted(addedtocart.items(), key=lambda x: x[1])
            reserved_users = sorted_users[:quantity]

            reserved_map = {user_id: timestamp for user_id, timestamp in reserved_users}

            # Set the reservedfor key
            ref.child(product_id).child("reservedfor").set(reserved_map)

    return {"message": "Reserved list updated successfully"}
