
from app import app, db, UpdateRequest, Officer

with app.app_context():
    all_reqs = UpdateRequest.query.all()
    print(f"Total Requests in DB: {len(all_reqs)}")
    
    statuses = {}
    for r in all_reqs:
        statuses[r.status] = statuses.get(r.status, 0) + 1
    
    print("Counts by Status:")
    for s, c in statuses.items():
        print(f"  {s}: {c}")
        
    officers = Officer.query.all()
    print("\nOfficers in DB:")
    for o in officers:
        print(f"  {o.name} (ID: {o.officer_id})")
