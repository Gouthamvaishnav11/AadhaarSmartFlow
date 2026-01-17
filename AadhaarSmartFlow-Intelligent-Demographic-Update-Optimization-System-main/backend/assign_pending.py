
from app import app, db, UpdateRequest, ProcessingCenter, Officer, assign_to_processing_center, assign_to_officer

with app.app_context():
    # 1. Ensure centers exist
    if ProcessingCenter.query.count() == 0:
        center1 = ProcessingCenter(center_id='PC001', name='Delhi Processing Center', location='Delhi', state='Delhi')
        db.session.add(center1)
        center2 = ProcessingCenter(center_id='PC002', name='Mumbai Processing Center', location='Mumbai', state='Maharashtra')
        db.session.add(center2)
        db.session.commit()
        print("Created sample centers")

    # 2. Ensure officers exist
    if Officer.query.count() == 0:
        off1 = Officer(officer_id='OFF001', name='Rajesh Kumar', email='officer1@uidai.gov.in', processing_center='Delhi Processing Center')
        off1.set_password('password123')
        db.session.add(off1)
        off2 = Officer(officer_id='OFF002', name='Priya Sharma', email='officer2@uidai.gov.in', processing_center='Mumbai Processing Center')
        off2.set_password('password123')
        db.session.add(off2)
        db.session.commit()
        print("Created sample officers")

    # 3. Assign pending requests
    pending = UpdateRequest.query.filter_by(status='pending').all()
    print(f"Found {len(pending)} pending requests")
    
    for req in pending:
        if not req.processing_center:
            center = assign_to_processing_center(req)
            if center:
                req.processing_center = center.name
                officer = assign_to_officer(center)
                if officer:
                    req.assigned_officer = officer.name
                    req.status = 'processing'
                    print(f"Assigned {req.request_id} to {officer.name}")
    
    db.session.commit()
    print("Cleanup complete")
